const alert = document.getElementById('alert');
let userLocation = {};
let marker = undefined;


let route = [];


let running = false;
let id = undefined;

const options = {
    maximumAge: 0,
    timeout: Infinity,
    enableHighAccuracy: true
};

/*

    Upon success the longitude/latitude position of the user is passed
    through callback to the success callback (with has one parameter, the
    users returned position)

*/
let map = L.map('map', { maxWidth: '500px', minWidth: '300px', maxHeight: '500px', minHeight: '300px', width: '500px', height: '500px'});

// Add a labeled marker to the map at any given latitude/longitude
function addMarker(lat, lon, label) {
    return L.marker([lat, lon]).addTo(map).bindPopup(label).openPopup();
}


let polyline = undefined;

// Used by getCurrentPosition as the success callback function
function initialSuccess(pos) {

    // Store user location
    userLocation.latitude = pos.coords.latitude;
    userLocation.longitude = pos.coords.longitude;

    // Set variable (id) to hold id of watchPosition(...) for clearWatch(id).
    id = navigator.geolocation.watchPosition(success, error, options);

    // Set up the map
    map.setView([userLocation.latitude, userLocation.longitude], 18);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add initial markers (location, target location)
    marker = addMarker(userLocation.latitude, userLocation.longitude, 'Start Location');

    // Display a line (polyline) from the users start location to the target location
    route.push([userLocation.latitude, userLocation.longitude]);
    polyline = L.polyline(route, {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());

}

// Used by watchPosition as the success callback function
function success(pos) {

    if (pos.coords.latitude !== userLocation.latitude && pos.coords.longitude !== userLocation.longitude) {

        // Set the updated user position
        route.push([pos.coords.latitude, pos.coords.longitude]);
        userLocation.latitude = pos.coords.latitude;
        userLocation.longitude = pos.coords.longitude;

        // Set new map view
        map.setView([userLocation.latitude, userLocation.longitude], 18);

        // Remove last polyline
        map.removeLayer(polyline);

        // Add new polyline
        polyline = L.polyline(route, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());

    }
}


document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);

function start() {
    navigator.geolocation.getCurrentPosition(initialSuccess, error, options);
}

function stop() {
    // Use the saved id of the watchPosition() call in the clearWatch() function to stop watching the user's location.
    navigator.geolocation.clearWatch(id);

    // Add marker at stop point
    addMarker(userLocation.latitude, userLocation.longitude, 'Stop Location');
}

function error(error) {
    console.error(`(${error.code}): ${error.message}`); // ERROR
}
