// <script src="./scripts/lame.all.js"></script>
// <script src="./scripts/Mp3Recorder.js"></script>
class Mp3Recorder {
  constructor() {
    this.recorder;
    this.mimeType;
    this.ext;

    this.onstopCallback;
    this.onmp3setCallback;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  }

  // recorder 설정(호출 시 사용자에게 마이크 권한 요청)
  setRecorder = async () => {
    this.checkBrowserSupport();

    // 마이크 연결(권한 요청)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // recorder 설정
    const chunks = [];
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      const recordBlob = new Blob(chunks);
      const recordFile = new File([recordBlob], `recording.${this.ext}`, {
        type: this.mimeType,
      });

      this.setMp3(recordFile); // mp3setCallback 호출됨
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

  /*************
   private
  *************/
  // mp3 파일 세팅
  setMp3 = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      // wav로 다운샘플링
      // https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext/OfflineAudioContext#parameters
      const buffer = await new AudioContext().decodeAudioData(e.target.result);
      const offlineAudioCtx = new OfflineAudioContext({
        numberOfChannels: 1,
        length: 16000 * buffer.duration,
        sampleRate: 16000,
      });

      const soundSource = offlineAudioCtx.createBufferSource();
      soundSource.buffer = buffer;
      soundSource.connect(offlineAudioCtx.destination);

      const renderedBuffer = await offlineAudioCtx.startRendering();
      const wavBuffer = this.bufferToWav(renderedBuffer, offlineAudioCtx.length);

      // mp3로 인코딩
      const mp3Buffer = this.encodeMp3(wavBuffer);
      const mp3Blob = new Blob(mp3Buffer, { type: "audio/mp3" });

      if (this.onmp3setCallback) this.onmp3setCallback(mp3Blob);
    };
    fileReader.readAsArrayBuffer(file);
  };

  // 브라우저 지원 확인
  checkBrowserSupport = () => {
    if (!window.MediaRecorder) {
      // MediaRecorder
      this.onerrorCallback("MediaRecorder Not Emplemented");
    } else if (!this.isTypeSupported() && this.onerrorCallback) {
      // 확장자
      this.onerrorCallback("Type Unsupported");
      return;
    }
  };

  // 브라우저 지원 확인 - 확장자
  isTypeSupported = () => {
    if (MediaRecorder.isTypeSupported("audio/ogg")) {
      this.mimeType = "audio/ogg";
      this.ext = "ogg";
      return true;
    } else if (MediaRecorder.isTypeSupported("audio/webm")) {
      this.mimeType = "audio/webm";
      this.ext = "webm";
      return true;
    } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
      this.mimeType = "audio/mp4";
      this.ext = "m4a";
      return true;
    } else {
      return false;
    }
  };

  /**
   * Convert AudioBuffer to a Blob using WAVE representation by adding wav header
   * Read https://www.cnblogs.com/blqw/p/3782420.html
   * @param {*} abuffer
   * @param {*} len
   */
  bufferToWav = (abuffer, len) => {
    var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [],
      i,
      sample,
      offset = 0,
      pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    return buffer;

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  };

  /**
   * Re-engineered from https://github.com/zhuker/lamejs/blob/master/worker-example/worker.js
   * @param {*} arrayBuffer
   */
  encodeMp3 = (arrayBuffer) => {
    const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
    const dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
    const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
    const maxSamples = 1152;

    console.log("wav", wav);

    const samplesLeft = wav.channels === 1 ? dataView : new Int16Array(wav.dataLen / (2 * wav.channels));

    const samplesRight = wav.channels === 2 ? new Int16Array(wav.dataLen / (2 * wav.channels)) : undefined;

    if (wav.channels > 1) {
      for (var j = 0; j < samplesLeft.length; i++) {
        samplesLeft[j] = dataView[j * 2];
        samplesRight[j] = dataView[j * 2 + 1];
      }
    }

    let dataBuffer = [];
    let remaining = samplesLeft.length;
    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
      var left = samplesLeft.subarray(i, i + maxSamples);
      var right;
      if (samplesRight) {
        right = samplesRight.subarray(i, i + maxSamples);
      }
      var mp3buf = mp3Encoder.encodeBuffer(left, right);
      dataBuffer.push(new Int8Array(mp3buf));
      remaining -= maxSamples;
    }

    const mp3Lastbuf = mp3Encoder.flush();
    dataBuffer.push(new Int8Array(mp3Lastbuf));
    return dataBuffer;
  };
}
