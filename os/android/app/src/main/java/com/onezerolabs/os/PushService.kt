package com.onezerolabs.os

import android.content.Context
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import org.json.JSONObject

/**
 * Push from the server, when Firebase is set up. A notice shows at once; any
 * push also has the phone fetch its reminders again, since a task changed.
 */
class PushService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        Prefs.setPushToken(this, token)
        Device.register(this, token)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        val data = message.data
        if (data["type"] == "notify") {
            val key = data["id"]
            if (key != null && !Prefs.wasShown(this, key)) {
                Notifier.show(this, Notifier.numberFor(key), data["title"] ?: "OneZeroLabs OS", data["body"], data["url"], Notifier.NEWS)
                Prefs.markShown(this, key)
            }
        }
        SyncWorker.now(this)
    }
}

/** Tells the server which phone this is, so pushes for the signed-in person reach it. */
object Device {
    fun register(context: Context, token: String) {
        Thread {
            runCatching { Api.post(context, "/api/app/devices", JSONObject().put("token", token)) }
        }.start()
    }
}
