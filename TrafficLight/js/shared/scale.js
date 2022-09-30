let scale = 1
const factor = 0.1
const max_scale =1
const min_scale =.01

function setup(){
    var scaler = document.getElementById('canvasContainer');
    scaler.addEventListener('wheel', onMouseWheel)
}


function onMouseWheel(e){
  e.preventDefault();

  var delta = e.delta || e.wheelDelta;
  if (delta === undefined) {  //we are on firefox
      delta = e.originalEvent.detail;
  }
  delta = Math.max(-1,Math.min(1,delta)); // cap the delta to [-1,1] for cross browser consistency
  
  scale += delta * factor * scale;
  scale = Math.max(min_scale, Math.min(max_scale, scale));

  var scaler = document.getElementById('canvasScaler');
  scaler.style.transform = "scale(" + scale + "," + scale + ")";
}

export {setup, scale};