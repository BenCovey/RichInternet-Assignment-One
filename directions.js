var g_html;
var origin;
var destination;
var time = 0;
var hours = 0;
var minutes = 0;
var spinner = document.getElementById("loader");
function displaydirections() {
    origin = document.getElementById("origin");
    destination = document.getElementById("destination");
    
    // Validation
    if (!origin.checkValidity()) {
       alert("ERROR: Origin Field");
        return;
    }
    if (!destination.checkValidity()) {
        alert("ERROR: Destination Field");
        return;
    }
    origin = origin.value;
    destination = destination.value;
    var xhttp = new XMLHttpRequest();
    xhttp.onloadstart = function() {
         var block = "block";
    }
    xhttp.onload = function() {
        if (this.status == 200) {
            loadData(this);
        }
    };
    xhttp.onerror = function(err) {
        alert("Error loading direction data" + err);
    }
    xhttp.onloadend = function() {
    }
    
    
    // Could display progress bar as data is loading.
    var yql = "https://maps.googleapis.com/maps/api/directions/xml?origin=" + origin +
        "&destination=" + destination + "&key=AIzaSyAQLrqyOK42M1juBuy9SY4DUVPdqnlVeEA";
    xhttp.open("GET", yql, true);
    xhttp.send();
}

function loadData(response) {
    var xmlDoc = response.responseXML;
    if (xmlDoc == null) {
        alert('Invalid response from server.');
        return;
    }
    
    var directions = xmlDoc.getElementsByTagName("step");
    
    if (directions.length === 0) {
        alert("No Direction Data.");
    }
    for (var i = 0; i < directions.length; i++) {
        var direc = directions[i];
       
        if (direc != null) {
            displayDirections(direc, i, directions.length);
        }
    }
    try{
        var realtime = Math.ceil(time/60);
        console.log(parseInt(realtime));
        minutes = Math.ceil(realtime);
        if(minutes > 59){
            hours = parseInt(minutes%60);
            minutes = parseInt(minutes/hours);
            
        }
    }catch(err) {
        console.log("Error:" + err);
        var porigin = document.getElementById('origindiv');
        var pdestination = document.getElementById('destinationdiv');
        porigin.innerHTML = "<div class= 'well well-sm'>" + "Leave " + origin + "</div>";
        pdestination.innerHTML = "<div class= 'well well-sm'>" + "Arrive at " +  destination + "</div>";
        }
    
    var porigin = document.getElementById('origindiv');
    var pdestination = document.getElementById('destinationdiv');
    if(hours > 0){
        porigin.innerHTML = "<div class= 'well well-sm'>" + "Leave " + origin + " arrive in " + hours + " hours and " + minutes + " minutes</div>";
    }else{
        porigin.innerHTML = "<div class= 'well well-sm'>" + "Leave " + origin + " arrive in " + minutes + " minutes</div>";
    }
    pdestination.innerHTML = "<div class= 'well well-sm'>" + "Arrive at " +  destination + "</div>";

}

function displayDirections(direc, num, maxnum) {
    var panel = document.getElementById("directions");
    //Directions
    var directions = direc.getElementsByTagName("html_instructions")[0];
    var nodeD = directions.childNodes[0];
    //Distance
    var distance = direc.getElementsByTagName("distance")[0];
    var distsub = distance.getElementsByTagName("text")[0];
    var nodeDist = distsub.childNodes[0];
    //Time
    var duration = direc.getElementsByTagName("duration")[0];
    var timesub = duration.getElementsByTagName("value")[0]
    var nodeTime = timesub.childNodes[0];
    time += parseInt(nodeTime.nodeValue);
    //Duration
    var dursub = duration.getElementsByTagName("text")[0];
    var nodeDur = dursub.childNodes[0];
    //Mode
    var travelmde = direc.getElementsByTagName("travel_mode")[0];
    var nodeMode = travelmde.childNodes[0];
    text = (nodeMode.nodeValue);
    text = getModeImage(text);
    if(g_html == null){
        g_html = "<div class='well' id='step"+num+"'>" + text  + " " + nodeD.nodeValue +" "  +
    nodeDist.nodeValue  + " or " + nodeDur.nodeValue +  "</div>";
    }else{
        g_html += "<div class='well' id='step"+num+"'>" + text  + " " + nodeD.nodeValue +" "  +
    nodeDist.nodeValue  + " or " + nodeDur.nodeValue +  "</div>";
    }
    
    panel.innerHTML = g_html;
}

function getModeImage(text) {
    if (text.match(/DRIVING/i)) {
        return "<i class='fa fa-car' aria-hidden='true'></i>";
    } else if (text.match(/WALKING/i)) {
        return "<i class='fa fa-male' aria-hidden='true'></i>";
    } else if (text.match(/TRANSIT/i)) {
        return "<i class='fa fa-bus' aria-hidden='true'></i>";
    }
}