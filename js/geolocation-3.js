function getLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(function(pos) {
            resolve(pos);
        }, error, options);
    });
}
function error(error) {
    console.error(error);
}
const options = {
    maxAge: 0,
    timeout: Infinity,
    enableHighAccuracy: true
}


function makeFetch(query) {
    return new Promise((resolve) => {
       fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query))
           .then(response => resolve(response.json()))
           .catch(error => console.error(error));
    });
}

let dataStruct = {
    startLat: 0,
    startLon: 0,
    closest: {
        latitude: 0,
        latVal: 100,
        longitude: 0,
        lonVal: 100
    },
    currentLat: 0,
    currentLon: 0,
    targetLat: 0,
    targetLon: 0,
}

async function findNodeValue(id, nodes) {
    // returns about 1-5 lat/lon for each node.
    return await makeFetch(`[out:json]; node(id: ${id}, ${nodes}); out body;`);
}

async function findStreets(lat, lon) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    // returns nearest streets node id and nodes
    return await makeFetch(`[out:json]; way(around:50, ${lat}, ${lon})["highway"]; out body;`);
}



let map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const addMarker = (lat, lon, label) => {
    L.marker([lat, lon]).addTo(map)
        .bindPopup(label)
        .openPopup();
}

// add app.

// add setTimeout to run this (from start())? it will use the modulated functions in the most efficient way for route searching.
// as start is simply to get location and makle the map show you where you're at and where you're going.
// and then however fast the route is calculated it will appear!
async function run() {

}

async function start() {



    let userLocation = await getLocation();
    dataStruct.startLat = userLocation.coords.latitude;
    dataStruct.startLon = userLocation.coords.longitude;
    addMarker(dataStruct.startLat, dataStruct.startLon, 'Your Location');

    // figure out quadrant that target is located in (in) relation to the start location.
    // might help in determining if we are going the right direction.
    /*
    target(-, +)  |     target(+, +)
                  |
    ------------start-------------
                  |
    target(-, -)  |     target(+, -)
     */

    dataStruct.targetLat = dataStruct.startLat + 0.0009;
    dataStruct.targetLon = dataStruct.startLon + 0.0009;
    addMarker(dataStruct.targetLat, dataStruct.targetLon, 'Target Location');

    let polyline = L.polyline([[dataStruct.startLat, dataStruct.startLon], [dataStruct.targetLat, dataStruct.targetLon]], {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());

    if (userLocation) {
        console.log(userLocation, dataStruct);
        let l = await findStreets(dataStruct.startLat, dataStruct.startLon);
        let q = await findStreets(l.lon, l.lat);
        console.log(q);
    }

    // when lowest returned check if it is within 50 metres of target. if so, stop it.
}

start();