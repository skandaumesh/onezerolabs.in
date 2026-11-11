package com.onezerolabs.os

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject

/**
 * Sets an alarm for every reminder the server lists, replacing the ones set
 * before. The alarms live on the phone, so a reminder goes off on time even
 * without signal.
 */
object Reminders {
    private const val ACTION = "com.onezerolabs.os.REMIND"
    private const val MOST = 200

    private fun pending(context: Context, id: Int, reminder: JSONObject?): PendingIntent {
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = ACTION
            data = Uri.parse("ozl://reminder/$id")
            if (reminder != null) {
                putExtra("id", id)
                putExtra("title", reminder.optString("title"))
                putExtra("body", reminder.optString("body"))
                putExtra("url", reminder.optString("url"))
            }
        }
        return PendingIntent.getBroadcast(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    }

    @Synchronized
    fun apply(context: Context, list: JSONArray) {
        val alarms = context.getSystemService(AlarmManager::class.java)
        for (id in Prefs.alarms(context)) id.toIntOrNull()?.let { alarms.cancel(pending(context, it, null)) }

        val now = System.currentTimeMillis()
        val exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || alarms.canScheduleExactAlarms()
        val set = mutableSetOf<String>()
        for (i in 0 until minOf(list.length(), MOST)) {
            val reminder = list.getJSONObject(i)
            val at = reminder.optLong("at")
            val id = reminder.optInt("id")
            if (at <= now) continue
            val intent = pending(context, id, reminder)
            if (exact) {
                alarms.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, intent)
            } else {
                alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, intent)
            }
            set += id.toString()
        }
        Prefs.setAlarms(context, set)
        Prefs.setLastReminders(context, list.toString())
    }

    /** Signed out: this phone stops reminding about that person's tasks. */
    fun clear(context: Context) = apply(context, JSONArray()).also { Prefs.setLastReminders(context, null) }

    /** After a restart the phone has forgotten every alarm; set them again from the last list. */
    fun restore(context: Context) {
        val saved = Prefs.lastReminders(context) ?: return
        runCatching { apply(context, JSONArray(saved)) }
    }
}

/** An alarm went off: show the reminder. */
class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getIntExtra("id", 0)
        val title = intent.getStringExtra("title") ?: return
        Notifier.show(context, id, title, intent.getStringExtra("body"), intent.getStringExtra("url"), Notifier.REMINDERS)
    }
}

/** After a restart, an update, or a change of clock: alarms again, then a fresh check. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminders.restore(context)
        SyncWorker.schedule(context)
        SyncWorker.now(context)
    }
}
