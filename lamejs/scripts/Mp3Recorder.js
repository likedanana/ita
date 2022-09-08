// <script src="./scripts/lame.all.js"></script>
// <script src="./scripts/recorder.js"></script>
// <script src="./scripts/Mp3Recorder.js"></script>
class Mp3Recorder {
  constructor() {
    // propeties
    this.recorder;
    this.encoder = new lamejs.Mp3Encoder(1, 44100, 128);
  }

  setRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const audioContext = new AudioContext();
    const input = audioContext.createMediaStreamSource(stream);
    this.recorder = new Recorder(input);
  };

  record = () => {
    this.recorder.record();
  };

  stop = () => {
    this.recorder.stop();
  };

  getMp3 = () => {
    this.recorder.exportWAV((blob) => {
      const mp3Data = [this.encoder.encodeBuffer(blob), this.encoder.flush()];
      const mp3 = new File(mp3Data, "recording.mp3", { type: "audio/mp3" });
      audio.src = URL.createObjectURL(mp3);
    });
  };
}
