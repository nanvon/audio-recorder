navigator.mediaDevices.getUserMedia({ audio: true }).then(initRecorder)
function recorderProcess() { console.log() }
function initRecorder(stream) {
  const AudioContext = window.AudioContext
  const audioContext = new AudioContext()
  // 创建MediaStreamAudioSourceNode对象，给定媒体流（例如，来自navigator.getUserMedia实例），然后可以播放和操作音频。
  const audioInput = audioContext.createMediaStreamSource(stream)
  // 缓冲区大小为4096，控制着多长时间需触发一次audioprocess事件
  const bufferSize = 4096
  // 创建一个javascriptNode,用于使用js直接操作音频数据
  // 第一个参数表示每一帧缓存的数据大小，可以是256, 512, 1024, 2048, 4096, 8192, 16384,值越小一帧的数据就越小，声音就越短，onaudioprocess 触发就越频繁。
  // 4096的数据大小大概是0.085s，就是说每过0.085s就触发一次onaudioprocess，第二，三个参数表示输入帧，和输出帧的通道数。这里表示2通道的输入和输出，当然我也可以采集1，4,5等通道
  const recorder = audioContext.createScriptProcessor(bufferSize, 1, 1)
  // 每个满足一个分片的buffer大小就会触发这个回调函数
  recorder.onaudioprocess = recorderProcess
  const monitorGainNode = audioContext.createGain()
  // 延迟0.01秒输出到扬声器
  monitorGainNode.gain.setTargetAtTime(音量, audioContext.currentTime, 0.01)
  monitorGainNode.connect(audioContext.destination)
  audioInput.connect(monitorGainNode)
  // const recordingGainNode = audioContext.createGain()
  // recordingGainNode.gain.setTargetAtTime(音量, audioContext.currentTime, 0.01)
  // recordingGainNode.connect(audioContext.scriptProcessorNode)
  // 将音频的数据流输出到这个jsNode对象中
  audioInput.connect(recorder)
  // 最后先音频流输出到扬声器。（将录音流原本的输出位置再定回原来的目标地）
  recorder.connect(audioContext.destination)
}
