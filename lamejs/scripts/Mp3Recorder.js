// <script src="./scripts/lame.all.js"></script>
// <script src="./scripts/Mp3Recorder.js"></script>
class Mp3Recorder {
  constructor() {
    this.mimeType;
    this.ext;
    this.chunks = [];

    this.recorder;
    this.encoder = new lamejs.Mp3Encoder(1, 44100, 128);

    this.onstopCallback;
    this.onerrorCallback;
  }

  // recorder 설정(호출 시 사용자에게 마이크 권한 요청)
  setRecorder = async () => {
    // 확장자 확인
    if (!this.isTypeSupported() && this.onerrorCallback) {
      this.onerrorCallback("Type Unsupported");
      return;
    }

    // 마이크 연결(권한 요청)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // recorder 설정
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks);
      this.mp3File = new File([blob], `recording.${this.ext}`, {
        type: this.mimeType,
      });
      if (this.onstopCallback) this.onstopCallback();
    };
  };

  // 녹음 시작
  start = () => {
    if (!this.recorder) return;
    this.recorder.start(30000);
  };

  // 녹음 완료
  stop = () => {
    if (!this.recorder) return;
    this.recorder.stop();
  };

  // mp3 파일 가져오기
  getMp3 = () => {
    if (!this.recorder) return;
    return this.mp3File;
  };

  /*************
   private
  *************/
  // 브라우저 확장자 지원 여부 확인
  isTypeSupported = () => {
    if (MediaRecorder.isTypeSupported("audio/ogg")) {
      this.mimeType = "audio/ogg";
      this.ext = "ogg";
      console.log(1);
    } else if (MediaRecorder.isTypeSupported("audio/webm")) {
      this.mimeType = "audio/webm";
      this.ext = "webm";
      console.log(2);
    } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
      this.mimeType = "audio/mp4";
      this.ext = "m4a";
      console.log(3);
    } else {
      return false;
    }

    return true;
  };
}
