/**
 * Created by Rocky on 5/4/2016.
 */

var renderer = null;
var stage = null;
//show map data
var map_layer = new PIXI.Graphics();
//show real-time laser data
var laser_layer = new PIXI.Graphics();
var tempGraphics = null;
var polygon = null;
var a = new Array(8);
var robotHeight,robotWidth;
var robotData;
var mapData;
var laserData;

var testRotation = 0;

//switch perspective to robot
document.getElementById('rp').addEventListener('click',function() {
  if(robotData != null && stage != null) {
    stage.pivot = new PIXI.Point(robotData.x,robotData.mapInfo.gridHeight - robotData.y);
    //stage.position = new PIXI.Point(robotData.x+200,robotData.mapInfo.gridHeight - robotData.y+200);
    stage.position = new PIXI.Point(window.innerWidth/2,window.innerHeight/2);
    stage.rotation = -robotData.angle-0.1;
    console.log(stage.scale);
    robotData.angle += 0.2;
    //robotData.y += 10;
    drawRobot(robotData, "laser");
    draw(mapData,0x000000,'map');
    draw(laserData,0xFF0000,'laser');
  }
});

//switch perspective to the third person perspective
document.getElementById('tpp').addEventListener('click',function(){
  if(robotData != null && stage != null) {
    stage.pivot = new PIXI.Point(robotData.x,robotData.mapInfo.gridHeight - robotData.y);
    stage.position = new PIXI.Point(robotData.x,robotData.mapInfo.gridHeight - robotData.y);
    stage.rotation = 0;
  }
});


document.getElementById('zoomIn').addEventListener('click', function () {
  console.log("zoomIn");
  console.log(stage.scale.x);
  if(stage.scale.x < 4) {
    stage.scale.x += 0.1;
    stage.scale.y += 0.1;
  }
  drawRobot(robotData, "laser");
  draw(mapData,0x000000,'map');
  draw(laserData,0xFF0000,'laser');
});

document.getElementById('zoomOut').addEventListener('click', function () {
  console.log("zoomOut");
  console.log(stage.scale.x);
  if(stage.scale.x > 0.1) {
    stage.scale.x -= 0.1;
    stage.scale.y -= 0.1;
  }
  drawRobot(robotData, "laser");
  draw(mapData,0x000000,'map');
  draw(laserData,0xFF0000,'laser');
});

function drawRobot(data,whichLayer) {
  robotData = data;
  polygon = [];
  console.log(data);
  //console.log(sessionStorage.getItem("laser_data"));
  //var laser_data = JSON.parse(sessionStorage.getItem("laser_data"));
  if(renderer === null) {
    //renderer = new PIXI.autoDetectRenderer(data.mapInfo.gridWidth, data.mapInfo.gridHeight, {
    //  backgroundColor: 0xFFFFFF,
    //  antialias: true
    //});
    renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
      backgroundColor: 0xFFFFFF,
      antialias: true
    });
    //append here is more efficient
    document.body.appendChild(renderer.view);
  }

  //document.body.appendChild(renderer.view);

  if(stage === null) {
    stage = new PIXI.Container();
    stage.pivot = new PIXI.Point(robotData.x,robotData.mapInfo.gridHeight - robotData.y);
    //stage.position = new PIXI.Point(robotData.x+200,robotData.mapInfo.gridHeight - robotData.y+200);
    stage.position = new PIXI.Point(window.innerWidth/2,window.innerHeight/2);
    stage.rotation = -robotData.angle;
    //console.log(stage.pivot);
    stage.interactive = true;
    //stage.pivot = new PIXI.Point(0, 0);
  }

  if(whichLayer === "map") {
    map_layer.clear();
  }
  if(whichLayer === "laser") {
    laser_layer.clear();
  }

  robotHeight = 18;
  robotWidth = 10;

  var angle = data.angle;

  /*UL  =  x + ( Width / 2 ) * cos A - ( Height / 2 ) * sin A ,  y + ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
  UR  =  x - ( Width / 2 ) * cos A - ( Height / 2 ) * sin A ,  y + ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A
  BL =   x + ( Width / 2 ) * cos A + ( Height / 2 ) * sin A ,  y - ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
  BR  =  x - ( Width / 2 ) * cos A + ( Height / 2 ) * sin A ,  y - ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A*/

  //ul
  a[0] = data.x + robotWidth / 2 * Math.cos(angle) - ( robotHeight / 2 ) * Math.sin(angle);
  a[1] = data.mapInfo.gridHeight - data.y + robotHeight / 2 * Math.cos(angle) + (robotWidth / 2) * Math.sin(angle);
  //ur
  a[2] = data.x - robotWidth / 2 * Math.cos(angle) - ( robotHeight / 2 ) * Math.sin(angle);
  a[3] = data.mapInfo.gridHeight - data.y + robotHeight / 2 * Math.cos(angle) - (robotWidth / 2) * Math.sin(angle);
  //br
  a[4] = data.x - robotWidth / 2 * Math.cos(angle) + ( robotHeight / 2 ) * Math.sin(angle);
  a[5] = data.mapInfo.gridHeight - data.y - robotHeight / 2 * Math.cos(angle) - (robotWidth / 2) * Math.sin(angle);
  //bl
  a[6] = data.x + robotWidth / 2 * Math.cos(angle) + ( robotHeight / 2 ) * Math.sin(angle);
  a[7] = data.mapInfo.gridHeight - data.y - robotHeight / 2 * Math.cos(angle) + (robotWidth / 2) * Math.sin(angle);

  console.log(a);

    laser_layer.lineStyle(2, 0x0000FF, 1);
    laser_layer.beginFill(0xFF700B, 1);
    laser_layer.drawPolygon(a);
    //laser_layer.drawRect(data.x, data.mapInfo.gridHeight-data.y,18,10);


  //graphics.moveTo(50,50);
  //graphics.lineTo(250, 50);
  //graphics.lineTo(100, 100);
  //graphics.lineTo(50, 50);
  //graphics.endFill();
  //  laser_layer.moveTo(data.x-5,data.mapInfo.gridHeight-data.y-5);
  //laser_layer.lineTo(data.x-5,);
  //laser_layer.lineTo();
  //laser_layer.lineTo();
  //  laser_layer.drawRect(data.x, data.mapInfo.gridHeight-data.y,18,10);

  stage.addChild(laser_layer);
}

function draw(data,color,whichLayer) {
    //console.log(sessionStorage.getItem("laser_data"));
    //var laser_data = JSON.parse(sessionStorage.getItem("laser_data"));
    if(renderer === null) {
      //renderer = new PIXI.autoDetectRenderer(data.mapInfo.gridWidth, data.mapInfo.gridHeight, {
      //  backgroundColor: 0xFFFFFF,
      //  antialias: true
      //});
      renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
        backgroundColor: 0xFFFFFF,
        antialias: true
      });
      //append here is more efficient
      document.body.appendChild(renderer.view);
    }

    //document.body.appendChild(renderer.view);

    if(stage === null) {
      stage = new PIXI.Container();
      stage.interactive = true;
    }

  if(whichLayer === "map") {
    mapData = data;
  }
  if(whichLayer === "laser") {
    laserData = data;
  }


  //if(whichLayer === "map") {
  //  map_layer.clear();
  //}
  //if(whichLayer === "laser") {
  //  laser_layer.clear();
  //}

    console.log(data);
    //var data_set = transDataIndex(data);
    data_set = data.data;
    if(whichLayer === 'map') {
      tempGraphics = map_layer;
    }
    if(whichLayer === 'laser') {
      tempGraphics = laser_layer;
    }

    for(i=0;i<data_set.length;i++) {
      tempGraphics.lineStyle(0);
      tempGraphics.beginFill(color, 1);
      //tempGraphics.drawCircle(data_xy_array[i].x, data.mapInfo.gridHeight-data_xy_array[i].y, 10);
      tempGraphics.drawCircle(data_set[i].x, data.mapInfo.gridHeight-data_set[i].y, 1);
      tempGraphics.endFill();
    }
  stage.addChild(tempGraphics);
}

var data_xy_array = [];
var x_index,y_index;
var row_num,col_num;
var data_set,i;
//function transDataIndex(data) {
//  row_num = data.mapInfo.gridHeight;
//  col_num = data.mapInfo.gridWidth;
//  data_set = data.data;
//
//  for(i=0;i<data_set.length;i++) {
//    //x_index = data_set[i]%col_num;
//    //y_index = parseInt(data_set[i]/col_num);
//    //y_index = data_set[i]/col_num;
//
//    //test
//    x_index = data_set[i]*Math.random();
//    y_index = data_set[i]*Math.random();
//
//    data_xy_array[i].x = x_index;
//    data_xy_array[i].y = y_index;
//    //var index = {x:x_index,y:y_index};
//    //data_xy_array.push(index);
//  }
//}

//test
function transDataIndex(data) {
  row_num = data.mapInfo.gridHeight;
  col_num = data.mapInfo.gridWidth;
  data_set = data.data;

  for(i=0;i<data_set.length;i++) {
    x_index = data_set[i]%col_num;
    //y_index = parseInt(data_set[i]/col_num);
    y_index = data_set[i]/col_num;
    var index = {x:x_index,y:y_index};
    data_xy_array.push(index);
  }
  return data_xy_array;
}

function animate() {
  renderer.render(stage);
  requestAnimationFrame( animate );
}

function getData() {
  //for(i=0;i<50000;i++) {
  //  var index = {x:0,y:0};
  //  data_xy_array.push(index);
  //}

  $.getJSON('./asset/robot_data.json',function(data,status,err){
    console.log(data);
    drawRobot(data, 'map');
    //animate();
  });
  $.getJSON('./asset/laser_data.json',function(data,status,err){
    //sessionStorage.setItem("laser_data", JSON.stringify(data));
    laserData = data;
    draw(data,0xFF0000,'laser');
    //animate();
  });
  $.getJSON('./asset/scan_map_data.json', function (data, status, err) {
    //sessionStorage.setItem("laser_data", JSON.stringify(data));
    data.data = transDataIndex(data);
    mapData = data;
    draw(data, 0x000000);
    //console.log();
    animate();
  });

  //setInterval(function () {
  //  $.getJSON('http://localhost:8888/laserData', function (data, status, err) {
  //    console.log(data);
  //    //sessionStorage.setItem("laser_data", JSON.stringify(data));
  //    transDataIndex(data);
  //    draw(data, 0x000000,"laser");
  //    //console.log();
  //    renderer.render(stage);
  //  });
  //}, 633);
  //// this interval time is special, this interval time of map layer
  //// can't be  divided with this time value.
  //
  //setInterval(function () {
  //  $.getJSON('http://localhost:8888/mapLaserData', function (data, status, err) {
  //  console.log(data);
  //    //sessionStorage.setItem("laser_data", JSON.stringify(data));
  //  transDataIndex(data);
  //  draw(data, 0xff0000,"map");
  //  //renderer.render(stage);
  //  //console.log();
  //    renderer.render(stage);
  //  });
  //}, 2000);
}

getData();
