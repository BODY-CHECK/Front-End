package com.bodycheck

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.hbisoft.hbrecorder.HBRecorder
import com.hbisoft.hbrecorder.HBRecorderListener
import android.widget.Toast
import android.os.Bundle
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.app.Activity

class MainActivity : ReactActivity(), HBRecorderListener {
    private lateinit var hbRecorder: HBRecorder
    private val SCREEN_RECORD_REQUEST_CODE = 1000
    private lateinit var mediaProjectionManager: MediaProjectionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hbRecorder = HBRecorder(this, this)
        mediaProjectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == SCREEN_RECORD_REQUEST_CODE && resultCode == Activity.RESULT_OK && data != null) {
            // 인자를 전달하여 녹화 시작
            hbRecorder.startScreenRecording(data, resultCode)
        } else {
            Toast.makeText(this, "Screen recording permission denied", Toast.LENGTH_SHORT).show()
        }
    }

    public fun startRecordingScreen() {
        val mediaProjectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        val permissionIntent = mediaProjectionManager.createScreenCaptureIntent()
        startActivityForResult(permissionIntent, SCREEN_RECORD_REQUEST_CODE)
    }

    public fun stopRecording() {
        hbRecorder.stopScreenRecording()
    }

    override fun HBRecorderOnStart() {
        Toast.makeText(this, "Recording started", Toast.LENGTH_SHORT).show()
    }

    override fun HBRecorderOnComplete() {
        Toast.makeText(this, "Recording completed", Toast.LENGTH_SHORT).show()
    }

    override fun HBRecorderOnError(errorCode: Int, reason: String?) {
        Toast.makeText(this, "Error: $errorCode, $reason", Toast.LENGTH_SHORT).show()
    }

    override fun HBRecorderOnPause() {
        // 필요시 기능 추가 가능
        Toast.makeText(this, "Recording paused", Toast.LENGTH_SHORT).show()
    }

    override fun HBRecorderOnResume() {
        Toast.makeText(this, "Recording resumed", Toast.LENGTH_SHORT).show()
    }

    override fun getMainComponentName(): String = "BodyCheck"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}


