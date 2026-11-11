package com.onezerolabs.os

import android.content.Context
import android.util.Log
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.net.URLEncoder
import java.time.Instant
import java.util.concurrent.TimeUnit

/** Fetches reminders and new notices. Runs every 15 minutes, and at once when asked. */
object Sync {
    fun run(context: Context): Boolean = try {
        Reminders.apply(context, Api.get(context, "/api/app/reminders").getJSONArray("reminders"))
        checkInbox(context)
        true
    } catch (_: Api.SignedOut) {
        Reminders.clear(context)
        true
    } catch (error: Exception) {
        Log.w("OZL", "Sync failed: ${error.message}")
        false
    }

    /** Shows notices that arrived since the last check, unless a push already showed them. */
    private fun checkInbox(context: Context) {
        val since = Prefs.inboxSince(context)
        // First run: start from now, rather than showing a day of old notices at once.
        val from = since ?: Instant.now().toString()
        val answer = Api.get(context, "/api/app/inbox?since=" + URLEncoder.encode(from, "UTF-8"))
        if (since != null) {
            val items = answer.getJSONArray("items")
            for (i in 0 until items.length()) {
                val notice = items.getJSONObject(i)
                val key = notice.getString("id")
                if (Prefs.wasShown(context, key)) continue
                Notifier.show(context, Notifier.numberFor(key), notice.getString("title"), notice.optString("body"), notice.optString("url"), Notifier.NEWS)
                Prefs.markShown(context, key)
            }
        }
        Prefs.setInboxSince(context, answer.getString("now"))
    }
}

class SyncWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result = if (Sync.run(applicationContext)) Result.success() else Result.retry()

    companion object {
        private val online = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()

        fun schedule(context: Context) {
            val request = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES).setConstraints(online).build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork("ozl-sync", ExistingPeriodicWorkPolicy.KEEP, request)
        }

        fun now(context: Context) {
            val request = OneTimeWorkRequestBuilder<SyncWorker>().setConstraints(online).build()
            WorkManager.getInstance(context).enqueueUniqueWork("ozl-sync-now", ExistingWorkPolicy.REPLACE, request)
        }
    }
}
