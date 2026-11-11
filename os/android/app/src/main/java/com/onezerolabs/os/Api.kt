package com.onezerolabs.os

import android.content.Context
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

/** Calls the OneZeroLabs OS server as the person signed in on this phone. Never on the main thread. */
object Api {
    /** Nobody is signed in, or the sign-in has run out. */
    class SignedOut : IOException("Signed out")

    private fun open(context: Context, path: String, method: String): HttpURLConnection {
        val cookie = Prefs.cookie(context)
        if (cookie.isNullOrBlank()) throw SignedOut()
        return (URL(BuildConfig.BASE_URL + path).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            // A signed-out request is sent to the sign-in page; following it would read that page as data.
            instanceFollowRedirects = false
            connectTimeout = 15_000
            readTimeout = 15_000
            setRequestProperty("Cookie", cookie)
            setRequestProperty("Accept", "application/json")
            setRequestProperty("X-OZL-App", "1")
        }
    }

    private fun read(connection: HttpURLConnection): JSONObject {
        try {
            val code = connection.responseCode
            if (code == 401 || code in 300..399) throw SignedOut()
            if (code !in 200..299) throw IOException("The server answered $code")
            return JSONObject(connection.inputStream.bufferedReader().use { it.readText() })
        } finally {
            connection.disconnect()
        }
    }

    fun get(context: Context, path: String): JSONObject = read(open(context, path, "GET"))

    fun post(context: Context, path: String, body: JSONObject): JSONObject {
        val connection = open(context, path, "POST").apply {
            doOutput = true
            setRequestProperty("Content-Type", "application/json")
        }
        connection.outputStream.use { it.write(body.toString().toByteArray()) }
        return read(connection)
    }
}
