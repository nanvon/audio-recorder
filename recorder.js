const recordBtn = document.querySelector('.record-btn');
const player = document.querySelector('.audio-player');

if (navigator.mediaDevices.getUserMedia) {
  var chunks = [];
  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(
    (stream) => {
      console.log('授权成功！');

      const mediaRecorder = new MediaRecorder(stream);

      recordBtn.onclick = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          recordBtn.textContent = 'record';
          console.log('录音结束');
        } else {
          mediaRecorder.start();
          console.log('录音中...');
          recordBtn.textContent = 'stop';
        }
        console.log('录音器状态：', mediaRecorder.state);
      };

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
        //ws发送录屏切片
        //...
        console.log('录音切片：', e.data);
      };

      mediaRecorder.onstop = (e) => {
        var blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        chunks = [];
        var audioURL = window.URL.createObjectURL(blob);
        console.log('audioURL: ', audioURL);
        player.src = audioURL;
      };
    },
    () => {
      console.error('授权失败！');
    }
  );
} else {
  console.error('浏览器不支持 getUserMedia');
}
