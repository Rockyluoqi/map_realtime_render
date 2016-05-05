/**
 * Created by Luoqi on 5/4/2016.
 */

var renderer = null;
var stage = null;
var map_layer = new PIXI.Graphics();
var laser_layer = new PIXI.Graphics();

function draw(data,color,needClear) {
  if (sessionStorage.getItem('laser_data') != "") {
    //console.log(sessionStorage.getItem("laser_data"));
    //var laser_data = JSON.parse(sessionStorage.getItem("laser_data"));
    if(renderer === null) {
      renderer = new PIXI.autoDetectRenderer(data.mapInfo.gridWidth, data.mapInfo.gridHeight, {
        backgroundColor: 0xFFFFFF,
        antialias: true
      });
    }

    document.body.appendChild(renderer.view);

    if(stage === null) {
      stage = new PIXI.Container();
      stage.interactive = true;
    }

    if(needClear) {
      graphics.clear();
    }

// set a fill and line style
// graphics.beginFill(0xFF0000);
// graphics.lineStyle(4, 0xffd900, 1);

//// draw a shape
//graphics.moveTo(50,50);
//graphics.lineTo(250, 50);
//graphics.lineTo(100, 100);
//graphics.lineTo(50, 50);
//graphics.endFill();
//
//// set a fill and a line style again and draw a rectangle
//graphics.lineStyle(2, 0x0000FF, 1);
//graphics.beginFill(0xFF700B, 1);
//graphics.drawRect(50, 250, 120, 120);
//
//// draw a rounded rectangle
//graphics.lineStyle(2, 0xFF00FF, 1);
//graphics.beginFill(0xFF00BB, 0.25);
//graphics.drawRoundedRect(150, 450, 300, 100, 15);
//graphics.endFill();

// draw a circle, set the lineStyle to zero so the circle doesn't have an outline

    console.log(data);
    //var data_set = transDataIndex(data);
    data_set = data.data;
    for(i=0;i<data_set.length;i++) {
      graphics.lineStyle(0);
      graphics.beginFill(color, 1);
      graphics.drawCircle(data_xy_array[i].x, data.mapInfo.gridHeight-data_xy_array[i].y, 3);
      graphics.endFill();
    }

    stage.addChild(graphics);
  }
}

var data_xy_array = [];
var x_index,y_index;
var row_num,col_num;
var data_set,i;
function transDataIndex(data) {
  row_num = data.mapInfo.gridHeight;
  col_num = data.mapInfo.gridWidth;
  data_set = data.data;

  for(i=0;i<data_set.length;i++) {
    //x_index = data_set[i]%col_num;
    //y_index = parseInt(data_set[i]/col_num);
    //y_index = data_set[i]/col_num;

    //test
    x_index = data_set[i]*Math.random();
    y_index = data_set[i]*Math.random();

    data_xy_array[i].x = x_index;
    data_xy_array[i].y = y_index;
    //var index = {x:x_index,y:y_index};
    //data_xy_array.push(index);
  }
}

function animate() {
  renderer.render(stage);
  requestAnimationFrame( animate );
}

function getData() {
  for(i=0;i<50000;i++) {
    var index = {x:0,y:0};
    data_xy_array.push(index);
  }
  //$.getJSON('./asset/laser_data.json',function(data,status,err){
  //  //sessionStorage.setItem("laser_data", JSON.stringify(data));
  //  draw(data,0xFF0000);
  //  animate();
  //});
  //$.getJSON('./asset/scan_map_data.json',function(data,status,err){
  //  //sessionStorage.setItem("laser_data", JSON.stringify(data));
  //  data.data = transDataIndex(data);
  //  draw(data,0x000000);
  //  //console.log();
  //  animate();
  //});
  setInterval(function () {
    $.getJSON('http://localhost:8888/laserData', function (data, status, err) {
      console.log(data);
      //sessionStorage.setItem("laser_data", JSON.stringify(data));
      transDataIndex(data);
      draw(data, 0x000000,1);
      $.getJSON('http://localhost:8888/mapLaserData', function (data, status, err) {
        console.log(data);
        //sessionStorage.setItem("laser_data", JSON.stringify(data));
        transDataIndex(data);
        draw(data, 0xff0000,0);
        //renderer.render(stage);
        //console.log();
      });
      //console.log();
    });
    renderer.render(stage);
  }, 5000);
  requestAnimationFrame( animate );
}

getData();
