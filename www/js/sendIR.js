var configFile = "config/ir.json"; // path to config file

var cfg; // content of configFile

/**
  Read in configuration file
*/
document.addEventListener('DOMContentLoaded', function() {
    readConfig();
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

function readConfig() {
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
