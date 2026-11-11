package com.onezerolabs.os

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

/** Shows notices on the phone. Two channels, so each can be silenced on its own in Settings. */
object Notifier {
    const val REMINDERS = "reminders"
    const val NEWS = "news"

    fun ensureChannels(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = context.getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(
            NotificationChannel(REMINDERS, "Task reminders", NotificationManager.IMPORTANCE_HIGH).apply {
                description = "At the time a task is due"
            }
        )
        manager.createNotificationChannel(
            NotificationChannel(NEWS, "From your co-founder", NotificationManager.IMPORTANCE_HIGH).apply {
                description = "Tasks given to you, and meetings set for you both"
            }
        )
    }

    fun canNotify(context: Context): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

    /** A whole number for a notice, the same every time for the same key. */
    fun numberFor(key: String): Int = key.hashCode() and 0x7fffffff

    fun show(context: Context, id: Int, title: String, body: String?, url: String?, channel: String) {
        if (!canNotify(context)) return
        ensureChannels(context)
        val open = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(MainActivity.EXTRA_PATH, url ?: "/")
            // Makes each notice's intent distinct, so tapping one opens its own page.
            data = Uri.parse("ozl://notice/$id")
        }
        val tap = PendingIntent.getActivity(context, id, open, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        val notice = NotificationCompat.Builder(context, channel)
            .setSmallIcon(R.drawable.ic_notify)
            .setColor(ContextCompat.getColor(context, R.color.accent))
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setContentIntent(tap)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(if (channel == REMINDERS) NotificationCompat.CATEGORY_REMINDER else NotificationCompat.CATEGORY_MESSAGE)
            .build()
        try {
            NotificationManagerCompat.from(context).notify(id, notice)
        } catch (_: SecurityException) {
            // Notices were turned off for the app after the check above.
        }
    }
}
