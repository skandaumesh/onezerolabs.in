package com.onezerolabs.os

import android.content.Context
import android.content.SharedPreferences

/** What the app remembers between runs, in its own private storage. */
object Prefs {
    private fun of(context: Context): SharedPreferences =
        context.getSharedPreferences("ozl", Context.MODE_PRIVATE)

    /** A copy of the web view's cookies, so background checks can sign in as the person using the app. */
    fun cookie(context: Context): String? = of(context).getString("cookie", null)
    fun setCookie(context: Context, value: String?) = of(context).edit().putString("cookie", value).apply()

    fun pushToken(context: Context): String? = of(context).getString("push_token", null)
    fun setPushToken(context: Context, value: String) = of(context).edit().putString("push_token", value).apply()

    /** The alarms set for reminders, so they can be cancelled when the list changes. */
    fun alarms(context: Context): Set<String> = of(context).getStringSet("alarms", emptySet()) ?: emptySet()
    fun setAlarms(context: Context, ids: Set<String>) = of(context).edit().putStringSet("alarms", ids).apply()

    /** The last list of reminders, to set the alarms again after the phone restarts, before there is signal. */
    fun lastReminders(context: Context): String? = of(context).getString("reminders", null)
    fun setLastReminders(context: Context, json: String?) = of(context).edit().putString("reminders", json).apply()

    /** Where the last check for notices got up to. */
    fun inboxSince(context: Context): String? = of(context).getString("inbox_since", null)
    fun setInboxSince(context: Context, value: String) = of(context).edit().putString("inbox_since", value).apply()

    /** Notices already shown, by id, so a push and a background check never show one twice. */
    @Synchronized
    fun wasShown(context: Context, id: String): Boolean =
        (of(context).getString("shown", "") ?: "").split(',').contains(id)

    @Synchronized
    fun markShown(context: Context, id: String) {
        val kept = (of(context).getString("shown", "") ?: "").split(',').filter { it.isNotBlank() && it != id }.takeLast(99)
        of(context).edit().putString("shown", (kept + id).joinToString(",")).apply()
    }
}
