package com.onezerolabs.os

import android.Manifest
import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.SystemClock
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging

/**
 * The whole app is the OneZeroLabs OS website in a web view. What a website
 * can't do well on Android lives here instead: reminders at an exact time,
 * notices while the app is closed, and push.
 */
class MainActivity : ComponentActivity() {
    companion object {
        const val EXTRA_PATH = "path"
    }

    private lateinit var root: FrameLayout
    private lateinit var web: WebView
    private val base: Uri = Uri.parse(BuildConfig.BASE_URL)
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private var lastSync = 0L

    private val pickFiles = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        fileCallback?.onReceiveValue(chosenFiles(result))
        fileCallback = null
    }
    private val askToNotify = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // The page draws edge to edge; the padding below keeps it clear of the status bar,
        // the gesture bar and the keyboard, so the website needs no Android-specific spacing.
        WindowCompat.setDecorFitsSystemWindows(window, false)
        root = FrameLayout(this)
        web = WebView(this)
        root.addView(web, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        setContentView(root)
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout() or WindowInsetsCompat.Type.ime()
            )
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            WindowInsetsCompat.CONSUMED
        }
        val night = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES
        paintBars(ContextCompat.getColor(this, R.color.page), night)

        setUpWebView()
        Notifier.ensureChannels(this)
        SyncWorker.schedule(this)
        setUpPush()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            askToNotify.launch(Manifest.permission.POST_NOTIFICATIONS)
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (web.canGoBack()) web.goBack() else moveTaskToBack(true)
            }
        })

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) {
            web.loadUrl(urlFor(intent))
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // A tapped notice opens its page in the app that is already running.
        if (intent.hasExtra(EXTRA_PATH)) web.loadUrl(urlFor(intent))
    }

    override fun onResume() {
        super.onResume()
        web.onResume()
        requestSync()
    }

    override fun onPause() {
        saveCookies()
        web.onPause()
        super.onPause()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    /** The page a notice points to, or the start page. Only paths on our own site are followed. */
    private fun urlFor(intent: Intent?): String {
        val path = intent?.getStringExtra(EXTRA_PATH)
        return if (path != null && path.startsWith("/") && !path.startsWith("//")) BuildConfig.BASE_URL + path else BuildConfig.BASE_URL + "/"
    }

    private fun isOurs(uri: Uri) = uri.scheme == base.scheme && uri.host == base.host && uri.port == base.port

    @SuppressLint("SetJavaScriptEnabled")
    private fun setUpWebView() {
        // Only the test build can be inspected from a computer; the real app can't.
        if (BuildConfig.DEBUG) WebView.setWebContentsDebuggingEnabled(true)
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            mediaPlaybackRequiresUserGesture = true
            setSupportZoom(false)
            userAgentString = "$userAgentString OZLApp/${BuildConfig.VERSION_NAME}"
        }
        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(web, false)
        }
        web.addJavascriptInterface(Bridge(), "OZLAndroid")

        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                if (isOurs(request.url)) return false
                openOutside(request.url)
                return true
            }

            override fun onPageFinished(view: WebView, url: String) {
                saveCookies()
            }

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) showOffline()
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(view: WebView, callback: ValueCallback<Array<Uri>>, params: FileChooserParams): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                val intent = params.createIntent().apply {
                    if (params.mode == FileChooserParams.MODE_OPEN_MULTIPLE) putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                }
                return try {
                    pickFiles.launch(intent)
                    true
                } catch (_: ActivityNotFoundException) {
                    fileCallback = null
                    false
                }
            }
        }

        web.setDownloadListener { url, userAgent, disposition, mime, _ -> download(url, userAgent, disposition, mime) }
    }

    private fun chosenFiles(result: ActivityResult): Array<Uri>? {
        if (result.resultCode != RESULT_OK) return null
        val data = result.data ?: return null
        data.clipData?.let { clip -> return Array(clip.itemCount) { clip.getItemAt(it).uri } }
        return data.data?.let { arrayOf(it) }
    }

    /** Invoices and documents save to Downloads, signed in as the person using the app. */
    private fun download(url: String, userAgent: String, disposition: String?, mime: String?) {
        if (!url.startsWith("http")) {
            Toast.makeText(this, "This file can’t be saved from here.", Toast.LENGTH_SHORT).show()
            return
        }
        val name = URLUtil.guessFileName(url, disposition, mime)
        val request = DownloadManager.Request(Uri.parse(url)).apply {
            CookieManager.getInstance().getCookie(url)?.let { addRequestHeader("Cookie", it) }
            addRequestHeader("User-Agent", userAgent)
            setMimeType(mime)
            setTitle(name)
            setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name)
        }
        getSystemService(DownloadManager::class.java).enqueue(request)
        Toast.makeText(this, "Saving $name to Downloads", Toast.LENGTH_SHORT).show()
    }

    /** Links to other sites, phone numbers, email and WhatsApp open in their own apps. */
    private fun openOutside(uri: Uri) {
        try {
            val intent = if (uri.scheme == "intent") Intent.parseUri(uri.toString(), Intent.URI_INTENT_SCHEME) else Intent(Intent.ACTION_VIEW, uri)
            intent.addCategory(Intent.CATEGORY_BROWSABLE)
            startActivity(intent)
        } catch (_: Exception) {
            Toast.makeText(this, "No app on this phone can open that link.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showOffline() {
        val page = """
            <!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
              body{font:16px system-ui,sans-serif;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:#F5F5F7;color:#1d1d1f}
              @media (prefers-color-scheme:dark){body{background:#000;color:#f5f5f7}}
              a{display:inline-block;margin-top:20px;padding:12px 24px;border-radius:999px;background:#0066CC;color:#fff;text-decoration:none;font-weight:600}
            </style>
            <div><h2>You’re offline</h2><p>Check your connection, then try again.</p><a href="/">Try again</a></div>
        """.trimIndent()
        web.loadDataWithBaseURL(BuildConfig.BASE_URL + "/", page, "text/html", "utf-8", null)
    }

    /** Background checks use a copy of the sign-in cookie; see Prefs.cookie. */
    private fun saveCookies() {
        val manager = CookieManager.getInstance()
        Prefs.setCookie(this, manager.getCookie(BuildConfig.BASE_URL))
        manager.flush()
    }

    private fun requestSync() {
        val now = SystemClock.elapsedRealtime()
        if (now - lastSync < 10_000) return
        lastSync = now
        saveCookies()
        SyncWorker.now(this)
    }

    /** Push, when Firebase is set up. The token rides along as a cookie, so the server links this phone to whoever signs in. */
    private fun setUpPush() {
        if (FirebaseApp.getApps(this).isEmpty()) return
        Prefs.pushToken(this)?.let { setDeviceCookie(it) }
        FirebaseMessaging.getInstance().token.addOnSuccessListener { token ->
            Prefs.setPushToken(this, token)
            setDeviceCookie(token)
            Device.register(this, token)
        }
    }

    private fun setDeviceCookie(token: String) {
        val secure = if (base.scheme == "https") "; Secure" else ""
        CookieManager.getInstance().setCookie(BuildConfig.BASE_URL, "ozl_device=$token; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax$secure")
    }

    /** The status and gesture bars take the page's colour, with icons that show up on it. */
    private fun paintBars(color: Int, dark: Boolean) {
        root.setBackgroundColor(color)
        window.decorView.setBackgroundColor(color)
        WindowInsetsControllerCompat(window, root).apply {
            isAppearanceLightStatusBars = !dark
            isAppearanceLightNavigationBars = !dark
        }
    }

    /** Called from the website's JavaScript, only when it runs inside this app. */
    inner class Bridge {
        @JavascriptInterface
        fun syncNow() = runOnUiThread { requestSync() }

        @JavascriptInterface
        fun setBars(css: String, dark: Boolean) {
            val parts = Regex("\\d+").findAll(css).map { it.value.toInt() }.toList()
            if (parts.size < 3) return
            runOnUiThread { paintBars(Color.rgb(parts[0], parts[1], parts[2]), dark) }
        }

        @JavascriptInterface
        fun isApp(): Boolean = true
    }
}
