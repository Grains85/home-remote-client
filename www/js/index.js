var pages = [
  {
    "id": "main",
    "menu": true,
    "icons": [
       {
         "id": "kitchen_tv",
         "display": "Kok TV"
       },
       {
         "id": "kitchen_receiver",
         "display": "Kok receiver"
       },
       {
         "id": "kitchen_appleTV",
         "display": "Kok TV"
       },
       {
         "id": "light",
         "display": "Belysning"
       }
     ]
  },
  {
    "id": "light",
    "menu": true,
    "titel": "Belysning",
    "icons": [
       {
         "id": "a",
         "display": "Belysning KOK"
       },
       {
         "id": "b",
         "display": "Belysning SOVRUM"
       },
       {
         "id": "c",
         "display": "Belysning VARDAGSRUM"
       },
       {
         "id": "d",
         "display": "Belysning KALLARE"
       }
     ]
  },
  {
    "id": "kitchen_tv",
    "titel": "TV Kök",
    "display": {
      "power": true,
      "source": true,
      "navigation": true,
      "volume": true
    }
  },
  {
    "id": "kitchen_receiver",
    "titel": "Receiver kok",
    "display": {
      "power": true,
      "source": true,
      "volume": true
    }
    },
    {
      "id": "kitchen_appleTV",
      "titel": "Apple TV kok",
      "display": {
        "power": true,
        "navigation": true
      }
      }
];

var configFile = "config/ir.json"; // path to config file

var cfg; // content of configFile


document.addEventListener('DOMContentLoaded', function() {
  readIRConfig();
  draw();
  navigate('main');
  //hideAll();
  //document.getElementById('main').style.display = "block";

    //var tv1 = document.getElementById('tv1');
    //tv1.style.display = "none";
});

/**
  Send IR code
*/
function sendIR(unit, btn) {
    //alert(unit+", "+btn);
    // cfg[0][unit].buttons[btn];
    var u = cfg[0][unit];
    var code = u.buttons[btn];
    alert(code);

    var http = new XMLHttpRequest();
    var url = "http://" + u.ip; //+"?code="+code;
    var params = 'code=' + code;
    http.open('POST', url, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);
}

function readIRConfig() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", configFile, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                //initConfig(allText);
                //alert(allText);
                cfg = JSON.parse(allText);
                //alert(t[0].kitchen.buttons.power);
            }
        }
    }
    rawFile.send(null);
}


function navigate(page){
  hideAll();
  //alert(page);
  document.getElementById(page).style.display = "block";
}

function hideAll(){
  for(var i=0; i<pages.length; i++){
    var page = pages[i];
    var id = page.id;
    document.getElementById(id).style.display = "none";
  }
}

function draw(){
  for(var i=0; i<pages.length; i++){
    var page = pages[i];
    var id = page.id;

    // MAIN
    var mainDiv = document.createElement('div');
    mainDiv.id = id;
    document.getElementsByTagName('body')[0].appendChild(mainDiv);

    // HEADER
    if(!page.menu || (page.menu && page.id != "main")){
    var headerDiv = document.createElement('div');
    headerDiv.className = "header";
    mainDiv.appendChild(headerDiv);
    var backDiv = document.createElement('div');
    backDiv.className = "back";
    backDiv.addEventListener('click', function(){
      navigate("main");
    });
    backDiv.innerHTML = "Startsida";
    headerDiv.appendChild(backDiv);
    var titleDiv = document.createElement('div');
    titleDiv.className = "titel";
    titleDiv.innerHTML = page.titel;
    headerDiv.appendChild(titleDiv);

    var marginDiv = document.createElement('div');
    marginDiv.style = "margin-top:80px;";
    mainDiv.appendChild(marginDiv);
  }

    // MENU PAGE
    if(page.menu){
      var icons = page.icons;
      for(var j=0; j<icons.length; j++){
        var icon = icons[j];
        const icon_id = icon.id;
        //  MENU-ICON
        var iconDiv = document.createElement('div');
        iconDiv.className = "menu-icon";
        iconDiv.addEventListener('click', function(){
          navigate(icon_id);
        });
        mainDiv.appendChild(iconDiv);

        // IMG
        var iconImg = document.createElement('img');
        iconImg.className="menu-img";
        iconImg.src = "img/"+icon.id+".png";
        iconDiv.appendChild(iconImg);

        // TEXT
        var textDiv = document.createElement('div');
        textDiv.className = "text";
        textDiv.innerHTML = icon.display;
        iconDiv.appendChild(textDiv);
      }
    }
    else{

    // NO MENU PAGE
    var titel = page.titel;
    var d = page.display;




    // POWER
    if(d.power){
      var powerImg = document.createElement('img');
      powerImg.className="button";
      powerImg.src = "img/controll/power.png";
      powerImg.style = "float:left;width:100px;";
      //powerImg.width = "100px";
      powerImg.addEventListener('click', function(){
        sendIR(id, "power");
      });
      mainDiv.appendChild(powerImg);
    }

    // SOURCE
    if(d.source){
      var sourceDiv = document.createElement('div');
      sourceDiv.className="button";
      //sourceDiv.image = "img/controll/power.png";
      sourceDiv.style = "float:right;";
      sourceDiv.width = "100px";
      sourceDiv.addEventListener('click', function(){
        sendIR(id, "power");
      });
      sourceDiv.innerHTML = "SOURCE";
      mainDiv.appendChild(sourceDiv);
    }

    // NAVIGATION
    if(d.navigation){
      var navigationDiv = document.createElement('div');
      navigationDiv.className="center";
      mainDiv.appendChild(navigationDiv);

      var navs = ["UP","DOWN","RIGHT","LEFT"];
      for(var a=0;a<navs.length;a++){
        var nav = navs[a];
        var navDiv = document.createElement('div');
        navDiv.className="button";
        //sourceDiv.image = "img/controll/power.png";
        //navDiv.style = "float:right;";
        navDiv.width = "100px";
        navDiv.addEventListener('click', function(){
          sendIR(id, "power");
        });
        navDiv.innerHTML = nav;
        navigationDiv.appendChild(navDiv);
      }
      var degreeDiv = document.createElement('div');
      degreeDiv.id="degreeDiv";
      degreeDiv.width = "100px";
      degreeDiv.innerHTML = "?";
      navigationDiv.appendChild(degreeDiv);
    }

    // VOLUME
    if(d.volume){

      // DOWN
      var volumeDownDiv = document.createElement('div');
      volumeDownDiv.className="button";
      //sourceDiv.image = "img/controll/power.png";
      volumeDownDiv.style = "position:absolute;bottom:0;";
      volumeDownDiv.width = "100px";
      volumeDownDiv.addEventListener('click', function(){
        sendIR(id, "power");
      });
      volumeDownDiv.innerHTML = "VOLUME_DOWN";
      mainDiv.appendChild(volumeDownDiv);

      // UP
      var volumeUpDiv = document.createElement('div');
      volumeUpDiv.className="button";
      //sourceDiv.image = "img/controll/power.png";
      volumeUpDiv.style = "position:absolute;bottom:0;right:0;";
      volumeUpDiv.width = "100px";
      volumeUpDiv.addEventListener('click', function(){
        sendIR(id, "power");
      });
      volumeUpDiv.innerHTML = "VOLUME_UP";
      mainDiv.appendChild(volumeUpDiv);
    }
    }
/**
    <div style='margin-top:80px;'></div>
    <img id='kitchen-power' style='float:left;' onclick="sendIR('kitchen','power')" width='100px' class="button" src="img/controll/power.png"/>
    <div style='float:right;' onclick="sendIR('kitchen','power')" width='100px' class="button">SOURCE</div>
    <div class='center'>
      <div onclick="sendIR('kitchen','power')" width='100px' class="button">UP</div>
      <div onclick="sendIR('kitchen','power')" width='100px' class="button">DOWN</div>
      <div onclick="sendIR('kitchen','power')" width='100px' class="button">RIGHT</div>
      <div onclick="sendIR('kitchen','power')" width='100px' class="button">LEFT</div>
      <div onclick="sendIR('kitchen','power')" width='100px' class="button">OK</div>
      <div id='degreeDiv' width='100px'>?</div>
    </div>
    <div style='position: absolute; bottom: 0;' onclick="sendIR('kitchen','power')" width='100px' class="button">VOL_DOWN</div>
    <div style='position:absolute;bottom:0;right:0;' onclick="sendIR('kitchen','power')" width='100px' class="button">VOL_UP</div>
  </div>
  */


  }
}
