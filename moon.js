var canvas = document.getElementById("Moon");

var padding = 8;
var center = canvas.width / 2;
var diameter = canvas.width - (padding * 2);
//var radius = diameter / 2;
var radiusMoon = diameter / 2;
var radiusShadow = radiusMoon + 1;

var colorMoon = 'White';
var colorShadow = 'Black';

var phase = 1.01;

function drawMoon(ctx) {
  ctx.arc(center, center, radiusMoon, 0, 360);
}

function drawArc(ctx, start, end, offset, rCoef) {
  if (rCoef <= 1.0e-15) {
    //ctx.moveTo(center, padding);
    ctx.arc(center, center, radiusShadow, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(center, padding);
    return;
  }
  var r = radiusShadow / rCoef;
  var c = Math.pow(r, 2.0) - Math.pow(radiusShadow, 2.0);
  c = Math.sqrt(c);
  var x = center + (offset * c);
  ctx.arc(x, center, r, start, end);
}

function drawShadow(ctx) {
  var coef = phase;
  if (coef > 1.0) coef = 1.0;
  else if (coef < 0.0) coef = 0.0;
  
  var rCoef;
  
  var start;
  var end;
  
  var offset;
  
  if (coef > 0.5) {
    start = -Math.PI / 2;
    end = -start;
    rCoef = (coef - 0.5) * 2;
    //ctx.moveTo(center, padding);
    drawArc(ctx, start, end, -1, rCoef);
    ctx.arc(center, center, radiusShadow, -start, start, true);
  }
  else if (coef <= 0.5) {
    start = Math.PI / 2;
    end = 360;
    rCoef = 1 - (coef * 2);
    drawArc(ctx, start, end, 1, rCoef);
  }
}

function draw() {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath();
  drawMoon(ctx);
  ctx.fillStyle = colorMoon;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'Black';
  ctx.stroke();
  ctx.closePath();
  
  ctx.globalCompositeOperation = 'source-atop';
  ctx.beginPath();
  drawShadow(ctx);
  ctx.fillStyle = colorShadow;
  ctx.fill();
  ctx.closePath();
  
  var phaseOffset;
  if (phase <= 1.0 && phase >= 0.0) {
    //-.039 * (x - 0.5)^2 + 0.01
    var phaseOffset = -0.039 * Math.pow(phase - 0.5, 2) + 0.01;
  }
  else { 
    phaseOffset = 0.01;
  }
  phase -= phaseOffset;
  if (phase < -0.25) {
    phase = 1.25;
    var color = colorMoon;
    colorMoon = colorShadow;
    colorShadow = color;
    //colorMoon = [colorShadow, colorShadow = colorMoon][0];
  }
}

setInterval(draw, 40);
