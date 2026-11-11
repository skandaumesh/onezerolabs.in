import java.util.Properties
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// Push needs Firebase's settings file. Without it the app still builds and works,
// and checks for news by itself every 15 minutes instead.
if (file("google-services.json").exists()) {
    apply(plugin = "com.google.gms.google-services")
}

// The signing key lives outside the repository (see .gitignore).
val signing = Properties().apply {
    val file = rootProject.file("keystore.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}

android {
    namespace = "com.onezerolabs.os"
    compileSdk = 36

    defaultConfig {
        applicationId = "in.onezerolabs.os"
        minSdk = 26
        targetSdk = 36
        versionCode = 2
        versionName = "1.0.1"
        buildConfigField("String", "BASE_URL", "\"https://cofounders.onezerolabs.in\"")
        manifestPlaceholders["cleartext"] = "false"
    }

    signingConfigs {
        if (!signing.isEmpty) {
            create("release") {
                storeFile = rootProject.file(signing.getProperty("storeFile"))
                storePassword = signing.getProperty("storePassword")
                keyAlias = signing.getProperty("keyAlias")
                keyPassword = signing.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        // A test build installs beside the real one and talks to a test server.
        debug {
            // Normally a test build installs beside the real app. With -PozlSameId it takes the
            // real app's name, for testing push when Firebase only knows the real app.
            if (project.findProperty("ozlSameId") == null) applicationIdSuffix = ".test"
            versionNameSuffix = "-test"
            val testUrl = (project.findProperty("ozlTestUrl") as String?) ?: "http://10.0.2.2:3200"
            buildConfigField("String", "BASE_URL", "\"$testUrl\"")
            manifestPlaceholders["cleartext"] = "true"
            resValue("string", "app_name", "OZL OS Test")
        }
        release {
            isMinifyEnabled = false
            signingConfigs.findByName("release")?.let { signingConfig = it }
            resValue("string", "app_name", "OZL OS")
        }
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.16.0")
    implementation("androidx.activity:activity-ktx:1.10.1")
    // Firebase brings an old Fragment library; the result APIs above need 1.3 or later.
    implementation("androidx.fragment:fragment-ktx:1.8.6")
    implementation("androidx.work:work-runtime-ktx:2.10.1")
    implementation(platform("com.google.firebase:firebase-bom:33.15.0"))
    implementation("com.google.firebase:firebase-messaging")
}
