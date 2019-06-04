(function() {

  "use strict";

  const btn = document.getElementById("btn");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  }).then(_handleSuccess).catch(_handleError);
  
  function _handleSuccess(stream) {
    btn.addEventListener("click", () => {
      _handleClick(stream);
    }, false);
  }

  function _handleError() {
    alert("Error!");
  }

  function _handleClick(stream) {
    //const LENGTH = 16;
    var LENGTH;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const options  = {
      mediaStream : stream
    };
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser(stream);
    let w = 0;

    btn.classList.add("off");
    analyser.fftSize = 2048;
    src.connect(analyser);

    LENGTH = analyser.frequencyBinCount;
    const data = new Uint8Array(LENGTH);

    setInterval(() => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = "#3e3e3e";

      w = canvas.width / LENGTH,

      analyser.getByteFrequencyData(data);

      var maxIndex = 0;
      var maxVal = 0;
      for (let i = 0; i < LENGTH; ++i) {
        if( data[i] > maxVal ){
          maxVal = data[i];
          maxIndex = i;
        }
        ctx.rect(i * w, canvas.height - data[i] * 2, w, data[i] * 2);        
      }
      if( maxVal > 30 ){
        var maxFreq = maxIndex * 44100 / 2048;
        maxFreq = Math.round( maxFreq * 0.01 ) / 0.01;
        console.log('--->'+maxFreq);
      }
      ctx.fill();
    }, 50);
  }
})();