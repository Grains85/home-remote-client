var configFile = "config/pages.json";

var pages = new Map();

document.addEventListener('DOMContentLoaded', function() {
  readConfig();
  draw();
  navigate('main');
});

/**
  Send IR code
*/
function sendIR(unit, btn) {
  //alert(unit+", "+btn);
  // cfg[0][unit].buttons[btn];
  var u = pages.get(unit);
  var code = u.buttons[btn];
  alert("IR signal " + code + " sent!");

  var http = new XMLHttpRequest();
  var url = "http://" + u.ip; //+"?code="+code;
  var params = 'code=' + code;
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      alert(http.responseText);
    }
  }
  http.send(params);
}

function readConfig() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", configFile, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        var json = JSON.parse(allText);

        for (var i = 0; i < json.length; i++) {
          pages.set(json[i].id, json[i]);
        }
      }
    }
  }
  rawFile.send(null);
}

function navigate(page) {
  hideAll();
  //alert(page);
  document.getElementById(page).style.display = "block";
}

function hideAll() {
  for (var pageId of pages.keys()) {
    document.getElementById(pageId).style.display = "none";
  }
}

function draw() {
  for (var [key, page] of pages.entries()) {
    const pageId = key;

    // MAIN
    var mainDiv = document.createElement('div');
    mainDiv.id = pageId;
    document.getElementsByTagName('body')[0].appendChild(mainDiv);

    // HEADER
    var headerDiv = document.createElement('div');
    headerDiv.className = "header";
    mainDiv.appendChild(headerDiv);
    if (page.id != "main") {
      var backDiv = document.createElement('div');
      backDiv.className = "back";
      backDiv.addEventListener('click', function() {
        navigate("main");
      });
      backDiv.innerHTML = "Startsida";
      headerDiv.appendChild(backDiv);
    }
    var titleDiv = document.createElement('div');
    titleDiv.className = "titel";
    titleDiv.innerHTML = page.titel;
    headerDiv.appendChild(titleDiv);

    var marginDiv = document.createElement('div');
    marginDiv.style = "margin-top:80px;";
    mainDiv.appendChild(marginDiv);

    // MENU PAGE
    if (page.units) {
      var units = page.units;
      for (var j = 0; j < units.length; j++) {
        var unit = units[j];
        const unitId = unit.id;

        //  MENU-ICON
        var iconDiv = document.createElement('div');
        iconDiv.className = "menu-icon";
        iconDiv.addEventListener('click', function() {
          navigate(unitId);
        });
        mainDiv.appendChild(iconDiv);

        // IMG
        var iconImg = document.createElement('img');
        iconImg.className = "menu-img";
        iconImg.src = "img/" + unit.id + ".png";
        iconDiv.appendChild(iconImg);

        // TEXT
        var textDiv = document.createElement('div');
        textDiv.className = "text";
        textDiv.innerHTML = unit.display;
        iconDiv.appendChild(textDiv);
      }
    } else {

      // NO MENU PAGE
      var titel = page.titel;
      var btn = page.buttons;

      // POWER
      if (btn.power) {
        var powerImg = document.createElement('img');
        powerImg.className = "button";
        powerImg.src = "img/controll/power.png";
        powerImg.style = "float:left;width:100px;";
        //powerImg.width = "100px";
        powerImg.addEventListener('click', function() {
          sendIR(pageId, "power");
        });
        mainDiv.appendChild(powerImg);
      }

      // SOURCE
      if (btn.source) {
        var sourceDiv = document.createElement('div');
        sourceDiv.className = "button";
        //sourceDiv.image = "img/controll/power.png";
        sourceDiv.style = "float:right;";
        sourceDiv.width = "100px";
        sourceDiv.addEventListener('click', function() {
          sendIR(pageId, "source");
        });
        sourceDiv.innerHTML = "SOURCE";
        mainDiv.appendChild(sourceDiv);
      }

      // NAVIGATION
      if (btn.navigate_ok) {
        var navigationDiv = document.createElement('div');
        navigationDiv.className = "center";
        mainDiv.appendChild(navigationDiv);

        var navs = ["OK", "UP", "DOWN", "RIGHT", "LEFT"];
        for (var a = 0; a < navs.length; a++) {
          const nav = navs[a];
          var navDiv = document.createElement('div');
          navDiv.className = "button";
          //sourceDiv.image = "img/controll/power.png";
          //navDiv.style = "float:right;";
          navDiv.width = "100px";
          navDiv.addEventListener('click', function() {
            sendIR(pageId, "navigate_" + nav.toLowerCase());
          });
          navDiv.innerHTML = nav;
          navigationDiv.appendChild(navDiv);
        }
        var degreeDiv = document.createElement('div');
        degreeDiv.id = "degreeDiv";
        degreeDiv.width = "100px";
        degreeDiv.innerHTML = "?";
        navigationDiv.appendChild(degreeDiv);
      }

      // VOLUME
      if (btn.volume_down) {

        // DOWN
        var volumeDownDiv = document.createElement('div');
        volumeDownDiv.className = "button";
        //sourceDiv.image = "img/controll/power.png";
        volumeDownDiv.style = "position:absolute;bottom:0;";
        volumeDownDiv.width = "100px";
        volumeDownDiv.addEventListener('click', function() {
          sendIR(pageId, "volume_down");
        });
        volumeDownDiv.innerHTML = "VOLUME_DOWN";
        mainDiv.appendChild(volumeDownDiv);

        // UP
        var volumeUpDiv = document.createElement('div');
        volumeUpDiv.className = "button";
        //sourceDiv.image = "img/controll/power.png";
        volumeUpDiv.style = "position:absolute;bottom:0;right:0;";
        volumeUpDiv.width = "100px";
        volumeUpDiv.addEventListener('click', function() {
          sendIR(pageId, "volume_up");
        });
        volumeUpDiv.innerHTML = "VOLUME_UP";
        mainDiv.appendChild(volumeUpDiv);
      }
    }
  }
}
