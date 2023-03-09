// function FindPosition(oElement){
//   if(typeof( oElement.offsetParent ) != "undefined")
//   {
//     for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
//     {
//       posX += oElement.offsetLeft;
//       posY += oElement.offsetTop;
//     }
//       return [ posX, posY ];
//     }
//     else
//     {
//       return [ oElement.x, oElement.y ];
//     }
// }

// function GetCoordinates(e){
//   var PosX = 0;
//   var PosY = 0;
//   var ImgPos;
//   ImgPos = FindPosition(myImg);
//   if (!e) var e = window.event;
//   if (e.pageX || e.pageY)
//   {
//     PosX = e.pageX;
//     PosY = e.pageY;
//   }
//   else if (e.clientX || e.clientY)
//     {
//       PosX = e.clientX + document.body.scrollLeft
//         + document.documentElement.scrollLeft;
//       PosY = e.clientY + document.body.scrollTop
//         + document.documentElement.scrollTop;
//     }
//   PosX = PosX - ImgPos[0];
//   PosY = PosY - ImgPos[1];
//   document.getElementById("t_x").innerHTML = PosX;
//   document.getElementById("t_y").innerHTML = PosY;
// }

// async function printJSON() {
//   const response = await fetch("../json_files/json_MRI_CT.json");
//   const json = await response.json();
//   console.log(json);
// }
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};



git_raw_url = 'https://raw.githubusercontent.com/a769104646/json_f/main/'
var myImg  = $('#canvas').get(0);
var myImg2 = $('#canvas2').get(0);
const img1 = new Image();
const img2 = new Image();
var arr_vel_x = null;
var arr_vel_y = null;
// img1.src = './imgs/cropped-oct106.png';
// img2.src = './imgs/oct_t.jpg';
// def_url = git_raw_url + '/json_files/json_oct.json'


var source = 'img0012_tcia_MRslice_126';
var target = 'pre_img0012_tcia_CTslice_155';
var d = 'Chest';
init_img_vel(source, target, d, tag='pre_')

var ctx  = $('#canvas').get(0).getContext('2d');
var ctx2 = $('#canvas2').get(0).getContext('2d');

const h = 256
const w = 256

img1.onload = function () {
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
// ctx.imageSmoothingQuality = "high";
ctx.drawImage(img1,0, 0, h , w);
};
img2.onload = function () {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx2.imageSmoothingEnabled = false;
        ctx2.drawImage(img2, 0, 0, h, w);
        draw_grid()
};


function readJsonFile(jsonFile) { 
  var reader = new FileReader(); 
  reader.addEventListener('load', (loadEvent) => { 
    try { 
      json = JSON.parse(loadEvent.target.result); 
      console.log(json); 
    } catch (error) { 
      console.error(error); 
    } 
  }); 
  reader.readAsText(jsonFile); 
} 


$('#dataset').change(function() {
  var tag = ''
  if ($(this).val() == 'OCT'){
      var source = 'cropped-oct66';
      var target = 'Group1_Volume1-9';
      var d = 'OCT';
  }
  if ($(this).val() == 'MRI-CT'){
      var source = 'img0012_tcia_MRslice_126';
      var target = 'pre_img0012_tcia_CTslice_155';
      var d = 'Chest';
      tag = 'pre_'
  }
  if ($(this).val() == 'cardiac'){
      var source = 'patient027sa_ED_cropslice_5';
      var target = '1005001sa_ED_cropslice_5';
      var d = 'Cardiac';
  }
  init_img_vel(source, target,d,tag);
});

function jsonArrayTo2D(arrayOfObjects){
  let header = [],
      AoA = [];
  arrayOfObjects.forEach(obj => {
    Object.keys(obj).forEach(key => header.includes(key) || header.push(key))
    let thisRow = new Array(header.length);
    header.forEach((col, i) => thisRow[i] = obj[col] || '')
    AoA.push(thisRow);
  })
  // AoA.unshift(header);
  return AoA;
}


function get_vel(url){
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: url,
    async: false,
    success:  function(jsonData) {
        arr_vel_x = jsonArrayTo2D(jsonData.D_V_x); 
        arr_vel_y = jsonArrayTo2D(jsonData.D_V_y); 
      }, 
    });
  // $.getJSON(url, function(data) {
  //   // tst = JSON.parse(data)
  //   arr = data.array
  //   obj_vel =  jsonArrayTo2D(arr)
  // });  
};

$("#canvas").click(function(e){ 
    getPosition(e); 
   
  });

var pointSize = 3;

function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = Math.ceil(event.clientX - rect.left);
    var y = Math.ceil(event.clientY - rect.top );

    x = Math.max(0, Math.min(x, 255))
    y = Math.max(0, Math.min(y, 255))
    document.getElementById("x").innerHTML = x;
    document.getElementById("y").innerHTML = y;

    var ctx =  $('#canvas').get(0).getContext("2d");
    drawCoordinates(x, y, ctx, img1);

    var ctx2 =  $('#canvas2').get(0).getContext("2d");
    var new_x = null;
    var new_y = null;
    dis_x = arr_vel_x[y][x];
    dis_y = arr_vel_y[y][x];
    new_x = dis_x;
    new_y = dis_y;

    drawCoordinates2(x, y, ctx2, img2, new_x, new_y);
    drawArrow(ctx2, x, y, new_x,new_y, 1, 'black');

    $('#t_x').text(String(new_x.toFixed(2))) ;
    $('#t_y').text(String(new_y.toFixed(2))) ;

    $('#d_x').text(String(dis_y.toFixed(2))) ;
    $('#d_y').text(String(dis_x.toFixed(2))) ;
}

function init_img_vel(s, t, d, tag){
    img2.src = './imgs/{0}/source/{1}.png'.formatUnicorn(d, s);
    img1.src = './imgs/{0}/target/{1}.png'.formatUnicorn(d, t);
    url = git_raw_url + 'json_{0}/{1}_{2}.json'.formatUnicorn(d, tag + s, t);
    get_vel(url);
}

function drawCoordinates(x,y, ctx, img, style="#ff2626"){	
    // const img1 = new Image()
    // img1.src = './imgs/cropped-oct106.png';
    // var ctx =  $('#canvas').get(0).getContext("2d");
    ctx.drawImage(img,0 ,0 ,h, w);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = style; // Red color
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}


function drawCoordinates2(x,y, ctx, img, x2,y2){	
  ctx.drawImage(img,0 ,0 ,h, w);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#ff2626"; // Red color
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.fillStyle = "#00ff00"; // green color
  ctx.beginPath();
  ctx.arc(x2, y2, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}


function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
  //variables to be used when creating the arrow
  var headlen = 10;
  var angle = Math.atan2(toy-fromy,tox-fromx);

  ctx.save();
  ctx.strokeStyle = color;

  //starting path of the arrow from the start square to the end square
  //and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  //starting a new path from the head of the arrow to one of the sides of
  //the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
             toy-headlen*Math.sin(angle-Math.PI/7));

  //path from the side point of the arrow, to the other side point
  ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
             toy-headlen*Math.sin(angle+Math.PI/7));

  //path from the side point back to the tip of the arrow, and then
  //again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
             toy-headlen*Math.sin(angle-Math.PI/7));

  //draws the paths created above
  ctx.stroke();
  ctx.restore();
}

function draw_grid(){
    var canvas = document.getElementById("canvas3");
    var ctx = canvas.getContext("2d");

    var particles = [];
    canvas.width  = 256;
    canvas.height = 256;
    function Particle() {
      this.position = {
          actual : {
              x : 0,
              y : 0
          },
          affected : {
              x : 0,
              y : 0
          },
      };
    }
    var gridSize = 1;

    var columns  = canvas.width / gridSize;
    var rows     = canvas.height / gridSize;

    // create grid using particles
    for (var i = 0; i < rows+1; i++) {
        for (var j = 0; j < canvas.width; j += 1) {
            var p = new Particle();
            p.position.actual.x = j;
            p.position.actual.y = i * gridSize;
            p.position.affected = Object.create(p.position.actual);
            particles.push(p);
        }
    }
    for (var i = 0; i < columns+1; i++) {
        for (var j = 0; j < canvas.height; j += 1) {
            var p = new Particle();
            p.position.actual.x = i * gridSize;
            p.position.actual.y = j;
            p.position.affected = Object.create(p.position.actual);
            particles.push(p);
        }
    }

    function d(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scale = 1
        particles.forEach(function (particle) {
            // move the particle to its original position
            particle.position.affected = Object.create(particle.position.actual);
  
            particle.position.affected.x = scale*arr_vel_x[particle.position.actual.y][particle.position.actual.x];
            particle.position.affected.y = scale*arr_vel_y[particle.position.actual.y][particle.position.actual.x];

            ctx.beginPath();
            ctx.rect(particle.position.affected.x , particle.position.affected.y, 0.5, 0.5);
            // ctx.rect(particle.position.affected.y , particle.position.affected.x, 1, 1);
            ctx.fillStyle = "black";
            ctx.fill();
        });
    }
    
    d();
}


