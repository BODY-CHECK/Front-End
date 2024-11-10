package com.bodycheck

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MyScreenRecorderModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MyScreenRecorder"
    }

    @ReactMethod
    fun startRecording() {
        val activity = currentActivity as? MainActivity
        activity?.startRecordingScreen()
    }

    @ReactMethod
    fun stopRecording() {
        val activity = currentActivity as? MainActivity
        activity?.stopRecording()
    }
}
