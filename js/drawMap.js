/**
 * Created by rocky on 5/17/2016.
 */
/**
 * Created by Rocky on 5/4/2016.
 * Because the page need render many times and the data will be achieved many times,
 * so you need many global variables to reduce the resource consume.
 */
var renderer = null;
var stage = null;
//show map data
var map_layer = new PIXI.Graphics();
//show real-time laser data
var laser_layer = new PIXI.Graphics();
var robot_layer = new PIXI.Graphics();
var position_layer = new PIXI.Graphics();

var tempGraphics = null;
//robot shape
var polygon = null;
//shape's point
var a = new Array(8);
var robotHeight, robotWidth;
var _robotData;
var mapData;
var laserData;
var isRp;
var isTp;

var testRotation = 0;
var host = "http://192.168.1.88:8080";
var mapDataUrl = "/gs-robot/real_time_data/scan_map_data";
var positionDataUrl = "/gs-robot/real_time_data/scan_init_point_data";
var robotPositionUrl = "/gs-robot/real_time_data/position";
var laserDataUrl = "/gs-robot/real_time_data/laser_phit";
var _backgroundColor = "0xC7EDCC";
var startScanURL = "";
var terminateScanURL = "";

//switch perspective to robot
document.getElementById('rp').addEventListener('click', function () {
  if (_robotData != null && stage != null) {
    isRp = true;
    //rotate around the pivot
    stage.pivot = new PIXI.Point(_robotData.gridPosition.x, _robotData.mapInfo.gridHeight - _robotData.gridPosition.y);
    //stage.position = new PIXI.Point(robotData.x+200,robotData.mapInfo.gridHeight - robotData.y+200);
    stage.position = new PIXI.Point(_robotData.gridPosition.x, _robotData.mapInfo.gridHeight - _robotData.gridPosition.y);
    stage.rotation = (_robotData.angle - 90)/180 * Math.PI;
    console.log(stage.scale);
    //robotData.y += 10;
    renderer.render(stage);
  }
});

//switch perspective to the third person perspective
document.getElementById('tpp').addEventListener('click', function () {
  if (_robotData != null && stage != null) {
    isRp = false;
    stage.pivot = new PIXI.Point(_robotData.mapInfo.gridWidth, _robotData.mapInfo.gridHeight);
    stage.position = new PIXI.Point(_robotData.mapInfo.gridWidth, _robotData.mapInfo.gridHeight);
    stage.rotation = 0;
  }
});
var isStop = false;
document.getElementById('on').addEventListener('click',function() {
  isStop = false;
  getData();
  $.ajax({
    url: startScanURL,
    type: "GET",
    success: function (data) {
      console.log(data);
    }
  });
});

document.getElementById('off').addEventListener('click',function() {
  isStop = true;
  $.ajax({
    url: terminateScanURL,
    type: "GET",
    success: function (data) {
      console.log(data);
    }
  });
});

document.getElementById('zoomIn').addEventListener('click', function () {
  console.log("zoomIn");
  console.log(stage.scale.x);
  if (stage.scale.x < 4) {
    stage.scale.x += 0.1;
    stage.scale.y += 0.1;
  }
  drawRobot(robotData, "laser");
  draw(mapData, 0x000000, 'map');
  draw(laserData, 0xFF0000, 'laser');
});

document.getElementById('zoomOut').addEventListener('click', function () {
  console.log("zoomOut");
  console.log(stage.scale.x);
  if (stage.scale.x > 0.1) {
    stage.scale.x -= 0.1;
    stage.scale.y -= 0.1;
  }
  drawRobot(robotData, "laser");
  draw(mapData, 0x000000, 'map');
  draw(laserData, 0xFF0000, 'laser');
});

var angle;
var x, y, mapHeight, mapWidth;
var robotTexture = PIXI.Texture.fromImage('./asset/icon/robot-topdown-color-horizontal.png');
var robot = new PIXI.Sprite(robotTexture);

function drawRobotSprite(robotData) {
  _robotData = robotData;
  if (renderer === null) {
    // renderer = new PIXI.autoDetectRenderer(4000, 4000, {
    //  backgroundColor: 0xFFFFFF,
    //  antialias: true
    // });
    renderer = new PIXI.autoDetectRenderer(robotData.mapInfo.gridWidth, robotData.mapInfo.gridHeight, {
      backgroundColor: _backgroundColor,
      antialias: true
    });
    //append here is more efficient
    document.body.appendChild(renderer.view);
  }

  if (stage === null) {
    stage = new PIXI.Container();
    // stage.pivot = new PIXI.Point(robotData.gridPosition.x, robotData.mapInfo.gridHeight - robotData.gridPosition.y);
    // // stage.position = new PIXI.Point(robotData.x+200,robotData.mapInfo.gridHeight - robotData.y+200);
    // stage.position = new PIXI.Point(window.innerWidth / 2, window.innerHeight / 2);
    // stage.rotation = -robotData.angle;
    // console.log(stage.pivot);
    stage.interactive = true;
    // stage.pivot = new PIXI.Point(0, 0);
  }

  if (isRp) {
    //rotate around the pivot
    stage.pivot = new PIXI.Point(robotData.gridPosition.x, robotData.mapInfo.gridHeight - robotData.gridPosition.y);
    //stage.position = new PIXI.Point(robotData.x+200,robotData.mapInfo.gridHeight - robotData.y+200);
    stage.position = new PIXI.Point(robotData.gridPosition.x, robotData.mapInfo.gridHeight - robotData.gridPosition.y);
    stage.rotation = (_robotData.angle - 90)/180 * Math.PI;
  }

  robot.anchor.x = 0.5;
  robot.anchor.y = 0.5;

  robot.position.x = robotData.gridPosition.x;
  // robot.position.x = 500;
  robot.position.y = robotData.mapInfo.gridHeight-robotData.gridPosition.y;
  // robot.position.y = 500;

  robot.rotation = - robotData.angle/180 * Math.PI;

  stage.addChild(robot);
}

function drawRobot(data) {
  robot_layer.clear();
  robotData = data;
  polygon = [];
  if (renderer === null) {
    // renderer = new PIXI.autoDetectRenderer(4000, 4000, {
    //  backgroundColor: 0xFFFFFF,
    //  antialias: true
    // });
    renderer = new PIXI.autoDetectRenderer(data.mapInfo.gridWidth, data.mapInfo.gridHeight, {
      backgroundColor: _backgroundColor,
      antialias: true
    });
    //append here is more efficient
    document.body.appendChild(renderer.view);
  }

  if (stage === null) {
    stage = new PIXI.Container();
    stage.pivot = new PIXI.Point(robotData.gridPosition.x, robotData.mapInfo.gridHeight - robotData.gridPosition.y);
    //stage.position = new PIXI.Point(robotData.x+200,robotData.mapInfo.gridHeight - robotData.y+200);
    stage.position = new PIXI.Point(window.innerWidth / 2, window.innerHeight / 2);
    stage.rotation = -robotData.angle;
    //console.log(stage.pivot);
    stage.interactive = true;
    //stage.pivot = new PIXI.Point(0, 0);
  }

  robotHeight = 18;
  robotWidth = 10;

  var angle = data.angle;
  x = data.gridPosition.x;
  y = data.gridPosition.y;
  mapWidth = data.mapInfo.gridWidth;
  mapHeight = data.mapInfo.gridHeight;

  /*UL  =  x + ( Width / 2 ) * cos A - ( Height / 2 ) * sin A ,  y + ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
   UR  =  x - ( Width / 2 ) * cos A - ( Height / 2 ) * sin A ,  y + ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A
   BL =   x + ( Width / 2 ) * cos A + ( Height / 2 ) * sin A ,  y - ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
   BR  =  x - ( Width / 2 ) * cos A + ( Height / 2 ) * sin A ,  y - ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A*/

  //ul
  a[0] = x + robotWidth / 2 * Math.cos(angle) - ( robotHeight / 2 ) * Math.sin(angle);
  a[1] = mapHeight - y + robotHeight / 2 * Math.cos(angle) + (robotWidth / 2) * Math.sin(angle);
  //ur
  a[2] = x - robotWidth / 2 * Math.cos(angle) - ( robotHeight / 2 ) * Math.sin(angle);
  a[3] = mapHeight - y + robotHeight / 2 * Math.cos(angle) - (robotWidth / 2) * Math.sin(angle);
  //br
  a[4] = x - robotWidth / 2 * Math.cos(angle) + ( robotHeight / 2 ) * Math.sin(angle);
  a[5] = mapHeight - y - robotHeight / 2 * Math.cos(angle) - (robotWidth / 2) * Math.sin(angle);
  //bl
  a[6] = x + robotWidth / 2 * Math.cos(angle) + ( robotHeight / 2 ) * Math.sin(angle);
  a[7] = mapHeight - y - robotHeight / 2 * Math.cos(angle) + (robotWidth / 2) * Math.sin(angle);

  console.log(a);

  robot_layer.lineStyle(2, 0x0000FF, 1);
  robot_layer.beginFill(0xFF700B, 1);
  robot_layer.drawPolygon(a);
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

  stage.addChild(robot_layer);
}

function drawPositionPoint(pointData, color) {
  if (renderer === null) {
    //renderer = new PIXI.autoDetectRenderer(data.mapInfo.gridWidth, data.mapInfo.gridHeight, {
    //  backgroundColor: 0xFFFFFF,
    //  antialias: true
    //});
    renderer = new PIXI.autoDetectRenderer(pointData.mapInfo.gridWidth, pointData.mapInfo.gridHeight, {
      backgroundColor: _backgroundColor,
      antialias: true
    });
    //append here is more efficient
    document.body.appendChild(renderer.view);
  }
  if (stage === null) {
    stage = new PIXI.Container();
    stage.interactive = true;
  }
  position_layer.clear();
  position_layer.lineStyle(2,'0x000000');
  position_layer.beginFill(color, 1);
  position_layer.drawCircle(pointData.data[0].x, pointData.mapInfo.gridHeight-pointData.data[0].y, 8);
  position_layer.endFill();
  stage.addChild(position_layer);
}

function draw(data, color, whichLayer) {
  //console.log(sessionStorage.getItem("laser_data"));
  //var laser_data = JSON.parse(sessionStorage.getItem("laser_data"));
  if (renderer === null) {
    renderer = new PIXI.autoDetectRenderer(data.mapInfo.gridWidth, data.mapInfo.gridHeight, {
     backgroundColor: _backgroundColor,
     antialias: true
    });
    // renderer = new PIXI.autoDetectRenderer(3520, 4000, {
    //   backgroundColor: 0xFFFFFF,
    //   antialias: true
    // });
    //append here is more efficient
    document.body.appendChild(renderer.view);
  }

  //document.body.appendChild(renderer.view);

  if (stage === null) {
    stage = new PIXI.Container();
    stage.interactive = true;
  }

  if (whichLayer === "map") {
    //need resize the map every 10 seconds
    renderer.resize(data.mapInfo.gridWidth,data.mapInfo.gridHeight);
    map_layer.clear();
    mapData = data;
    tempGraphics = map_layer;
    data_set = data.data;
    for (i = 0; i < data_set.length; i++) {
      tempGraphics.lineStyle(0);
      tempGraphics.beginFill(color, 1);
      tempGraphics.drawCircle(data_xy_array[i].x, data.mapInfo.gridHeight - data_xy_array[i].y, 2);
      // tempGraphics.drawCircle(data_set[i].x, data.mapInfo.gridHeight-data_set[i].y, 1);
      tempGraphics.endFill();
    }
  }
  if (whichLayer === "laser") {
    laser_layer.clear();
    laserData = data;
    tempGraphics = laser_layer;
    data_set = data.gridPhits;
    for (i = 0; i < data_set.length; i++) {
      tempGraphics.lineStyle(0);
      tempGraphics.beginFill(color, 1);
      tempGraphics.drawCircle(data_set[i].x, data.mapInfo.gridHeight - data_set[i].y, 2);
      // tempGraphics.drawCirc  le(data_set[i].x, data.mapInfo.gridHeight-data_set[i].y, 1);
      tempGraphics.endFill();
    }
  }
  stage.addChild(tempGraphics);
}


var data_xy_array = [];
var x_index, y_index;
var row_num, col_num;
var data_set, i;

function transDataIndex(data) {
  row_num = data.mapInfo.gridHeight;
  col_num = data.mapInfo.gridWidth;
  data_set = data.data;

  for (i = 0; i < data_set.length; i++) {
    x_index = data_set[i] % col_num;
    // y_index = parseInt(data_set[i]/col_num);
    y_index = data_set[i] / col_num;

    //test
    // x_index = data_set[i] * Math.random();
    // y_index = data_set[i] * Math.random();

    data_xy_array[i].x = x_index;
    data_xy_array[i].y = y_index;
    //var index = {x:x_index,y:y_index};
    //data_xy_array.push(index);
  }
}

function transLaserDataIndex(data) {
  row_num = data.mapInfo.gridHeight;
  col_num = data.mapInfo.gridWidth;
  data_set = data.gridPhits;

  for (i = 0; i < data_set.length; i++) {
    x_index = data_set[i] % col_num;
    // y_index = parseInt(data_set[i]/col_num);
    y_index = data_set[i] / col_num;

    //test
    // x_index = data_set[i] * Math.random();
    // y_index = data_set[i] * Math.random();

    data_xy_array[i].x = x_index;
    data_xy_array[i].y = y_index;
    //var index = {x:x_index,y:y_index};
    //data_xy_array.push(index);
  }
}

//test
// function transDataIndex(data) {
//   row_num = data.mapInfo.gridHeight;
//   col_num = data.mapInfo.gridWidth;
//   data_set = data.data;
//
//   for(i=0;i<data_set.length;i++) {
//     x_index = data_set[i]%col_num;
//     //y_index = parseInt(data_set[i]/col_num);
//     y_index = data_set[i]/col_num;
//     var index = {x:x_index,y:y_index};
//     data_xy_array.push(index);
//   }
//   return data_xy_array;
// }

function animate() {
  // renderer.render(stage);
  requestAnimationFrame(animate);
}

function getData() {
  for (i = 0; i < 50000; i++) {
    var index = {x: 0, y: 0};
    data_xy_array.push(index);
  }

  // $.getJSON('./asset/robot_data.json',function(data,status,err){
  //   console.log(data);
  //   // drawRobot(data, 'map');
  //   drawRobotSprite(data);
  //   // renderer.render(stage);
  //   animate();
  // });
  // $.getJSON('./asset/laser_data.json',function(data,status,err){
  //   //sessionStorage.setItem("laser_data", JSON.stringify(data));
  //   laserData = data;
  //   draw(data,0xFF0000,'laser');
  //   //animate();
  // });
  // $.getJSON('./asset/scan_map_data.json', function (data, status, err) {
  //   //sessionStorage.setItem("laser_data", JSON.stringify(data));
  //   data.data = transDataIndex(data);
  //   mapData = data;
  //   draw(data, 0x000000);
  //   //console.log();
  //   animate();
  // });

  if(isStop) {
    setTimeout(function () {
      setInterval(function () {
        $.getJSON(host + robotPositionUrl, function (data, status, err) {
          // console.log("angle: "+data.angle);
          console.log(data);
          //sessionStorage.setItem("laser_data", JSON.stringify(data));
          drawRobotSprite(data);
          //console.log();
          renderer.render(stage);
        });
      }, 577);

      // setInterval(function () {
      //   $.getJSON(host + positionDataUrl, function (data, status, err) {
      //     console.log('position data');
      //     console.log(data);
      //     //sessionStorage.setItem("laser_data", JSON.stringify(data));
      //     // drawRobot(data);
      //     //console.log();
      //     renderer.render(stage);
      //   });
      // }, 1000);

      setInterval(function () {
        $.getJSON(host + laserDataUrl, function (data, status, err) {
          //sessionStorage.setItem("laser_data", JSON.stringify(data));
          draw(data, 0xff0000, "laser");
          //console.log();
          renderer.render(stage);
        });
      }, 577);

    }, 10000);

    // this interval time is special, this interval time of map layer
    // can't be  divided with this time value.
    setInterval(function () {
      $.getJSON(host + mapDataUrl, function (data, status, err) {
        console.log('map');
        console.log(data);
        //sessionStorage.setItem("laser_data", JSON.stringify(data));
        transDataIndex(data);
        draw(data, 0x000000, "map");
        //renderer.render(stage);
        //console.log();
        renderer.render(stage);
      });
    }, 10000);

    setInterval(function () {
      $.getJSON(host + positionDataUrl, function (data, status, err) {
        console.log('position data');
        console.log(data);
        drawPositionPoint(data, "0x00FF00");
        renderer.render(stage);
      });
    }, 10000);

    requestAnimationFrame(animate);
  }
}
