window.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ Renderer loaded");
if (window.electronAPI) {
  console.log("window.electronAPI IS WORKINGGGGGGGGG!");
} else {
  console.error("window.electronAPI is doomed!");
}

  const videoElement = document.querySelector('video');
  const videoSelectBtn = document.getElementById('videoSelectBtn');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  let mediaRecorder;
  let recordedChunks = [];

  // popup menu
videoSelectBtn.addEventListener('click', async () => {
  const inputSources = await window.electronAPI.getSources();

  const template = inputSources.map(source => ({
    label: source.name
  }));

  window.electronAPI.showMenu(template);

  // for clicked item
  window.electronAPI.onMenuItemClicked((label) => {
    const source = inputSources.find(s => s.name === label);
    if (source) selectSource(source);
  });
});
  async function selectSource(source) {
    // stream for choosen
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 640,
          maxWidth: 1920,
          minHeight: 480,
          maxHeight: 1080
        }
      }
    });

    videoElement.srcObject = stream;
    videoElement.play();

    // prepare MEDIARECORDER
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

    mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
    mediaRecorder.onstop = saveVideo;
  }

  startBtn.addEventListener('click', () => {
    if (mediaRecorder) {
      recordedChunks = [];
      mediaRecorder.start();
      console.log('Recording started');
    }
  });

  stopBtn.addEventListener('click', () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log('Recording stopped');
    }
  });

  function saveVideo() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
  }
});
//test