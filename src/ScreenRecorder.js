import { NativeModules } from 'react-native';

const { MyScreenRecorder } = NativeModules;

export const startRecording = () => {
  MyScreenRecorder.startRecording();
};

export const stopRecording = () => {
  MyScreenRecorder.stopRecording();
};
