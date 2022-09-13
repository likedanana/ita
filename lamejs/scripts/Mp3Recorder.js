// <script src="./scripts/lame.all.js"></script>
// <script src="./scripts/Mp3Recorder.js"></script>
class Mp3Recorder {
  constructor() {
    this.recorder;
    this.chunks = [];
    this.blob;
    this.encoder = new lamejs.Mp3Encoder(1, 44100, 128);

    this.onstopCallback;
  }

  // 마이크 - Recorder 연결(사용자에게 마이크 권한 요청)
  setRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      this.blob = new Blob(this.chunks);
      if (this.onstopCallback) this.onstopCallback();
    };
  };

  start = () => {
    if (!recorder) return;
    this.recorder.start(30000);
  };

  stop = () => {
    if (!recorder) return;
    this.recorder.stop();
  };

  getMp3 = () => {
    if (!recorder) return;
    return this.blob;
  };

  /*************
   private
  *************/
}
