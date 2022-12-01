/*
Global variables for the map, all of the cuurrent people loaded into the system, and all markers.
*/
var map;
var markers = [];
var people;

/*
Initializes the map into the html and centers it around New York City
*/
function InitMap()
{
    var mapProp = {
        center:new google.maps.LatLng(40.7541,-73.9735),
        zoom:10,
    };
    map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

/*
Gets Certificates from Database and populates the certficiate select with all options 
*/
function PopulateCertificates()
{
    //CALL API TO GET CERTIFICATES, EXPECTS [string]
    fetch('http://localhost:3000/api/certificates').then(response => response.json())
    .then((certificates) => {
        certificates.forEach(certificate => {
            const certificateSelect = document.getElementById("certificates");
            let option = document.createElement('option');
            option.value = `${certificate["cof_type"]}`;
            option.innerText = `${certificate["cof_type"]}`;
            certificateSelect.appendChild(option);
        })
    })
    .catch(error => {
        console.log(error);
    })
}

/* Gets information about a specific holder and populates the holder information fields*/
function GetHolderInfo(person_name)
{
    //CALL API TO GET PERSON INFORMATION
    fetch('http://localhost:3000/api/person/holder/' + person_name).then(response => response.json())
    .then((holders) => {
        let holder = holders[0];
        let person = {
            latitude: `${holder["latitude"]}`,
            longitude: `${holder["longitude"]}`,
            holder_name: `${holder["holder_name"]}`,
            expires_on: `${holder["expires_on"]}`,
            prem_addr: `${holder["prem_addr"]}`,
        };

        let holder_name = document.getElementById("holder_name");
        let expires_on = document.getElementById("expires_on");
        let address = document.getElementById("address");
        let latitude = document.getElementById("latitude");
        let longitude = document.getElementById("longitude");

        holder_name.innerText = person.holder_name;
        expires_on.innerText = person.expires_on;
        address.innerText = person.prem_addr;
        latitude.innerText = person.latitude;
        longitude.innerText = person.longitude;

        map.panTo({
            lat: person.latitude,
            lng: person.longitude
        });
    })
    .catch(error => {
        console.log(error);
    })
}

/*
Adds all markers and marker event handlers into the map. 
*/
function PopulateMap()
{
    let certificate = document.getElementById("certificates").selectedOptions[0].value;
    
    //CALL API TO GET LIST OF PEOPLE BASED ON CERTIFICATION
    fetch('http://localhost:3000/api/person/' + certificate).then(response => response.json())
    .then((persons) => {
        persons.forEach(person => {
        //Add people to the list based on certification
        const peopleSelect = document.getElementById("people");
        let option = document.createElement('option');
        option.value = `${person["holder_name"]}`;
        option.innerText = `${person["holder_name"]}`;
        peopleSelect.appendChild(option);
        
        //set the marker on the map
        let lat = `${person["latitude"]}`;
        let lon = `${person["longitude"]}`;
        let marker = new google.maps.Circle({
            center: new google.maps.LatLng(lat, lon),
            radius:100,
            strokeColor:"#0000FF",
            strokeOpacity:0.8,
            strokeWeight:2,
            fillColor:"#0000FF",
            fillOpacity:0.4
        });

        marker.setMap(map);

        google.maps.event.addListener(marker,"click",() => {GetHolderInfo(`${person["holder_name"]}`)});

        markers.push(marker);
        })
    })
    .catch(error => {
        console.log(error);
    })
}


//Startup function calls
InitMap();
PopulateCertificates();
document.getElementById("certificates").onchange = function() {
    document.querySelectorAll("#people > option").forEach(option => option.remove());
    markers.forEach((marker) =>{
        marker.setMap(null);
    });
    markers = [];
    PopulateMap();
}
document.getElementById("people").onchange = function() {
    let person_name = this.selectedOptions[0].value;
    GetHolderInfo(person_name);
}