const alert = document.getElementById('alert');
let userLocation = {};
let targetLocation = {};
let marker = undefined;

// Hold the id of the watchPosition call so that it can be used to clear
// the watch later, using clearWatch().
let id = undefined;

/*

    Options:

        The API intakes these options to determine the constraints it should follow when
        determining the user location.

        enableHighAccuracy:

            When set to true your device will consume more power and provide a slower response
            time, but this will only happen if your device knows it can find a more accurate
            location. Meaning that your device will not try to find a better or more accurate
            position if it knows that it is not able to find an accurate position, making the
            setting of true rather false. Reasons of cases like this include a lack of GPS
            satellites/cell towers/Wi-Fi signals, weak GPS signal, battery saving mode.

        maximumAge:

            The maximum age of a cached location allowed is the value set to maximumAge.
            If unset (default: 0) the app will always require a new location.
            If set to Infinity then the device must find a cached location.

        timeout:

            Maximum length of time that the device is allowed to take to return a position.
            Will cause function to return an error if it does not succeed in finding your
            location in a specified amount of time. For example, if your timeout option was
            set to 5000 (ms) and your device cannot return a location within that time there
            will be an error. When set to Infinity it will wait until a position is found
            before returning.

*/
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

    // Create a target location
    targetLocation.latitude = userLocation.latitude + 0.00010910000000308173;
    targetLocation.longitude = userLocation.longitude + 0.0005107999999912636;


    // Set variable (id) to hold id of watchPosition(...) for clearWatch(id).
    id = navigator.geolocation.watchPosition(success, error, options);

    // Set up the map
    map.setView([userLocation.latitude, userLocation.longitude], 18);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add initial markers (location, target location)
    marker = addMarker(userLocation.latitude, userLocation.longitude, 'Your Location');
    addMarker(targetLocation.latitude, targetLocation.longitude, 'Target Location');

    // Display a line (polyline) from the users start location to the target location
    polyline = L.polyline([[userLocation.latitude, userLocation.longitude], [targetLocation.latitude, targetLocation.longitude]], {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());

}

// Used by watchPosition as the success callback function
function success(pos) {

    if (pos.coords.latitude === userLocation.latitude && pos.coords.longitude === userLocation.longitude) {

       // Set the updated user position
        userLocation.latitude = pos.coords.latitude;
        userLocation.longitude = pos.coords.longitude;

        // Set new map view
        map.setView([userLocation.latitude, userLocation.longitude], 18);

        // Remove last polyline
        map.removeLayer(polyline);

        // Remove last position marker
        map.removeLayer(marker);

        // Add new polyline
        polyline = L.polyline([[userLocation.latitude, userLocation.longitude], [targetLocation.latitude, targetLocation.longitude]], {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());

        // Add new position marker
        marker = addMarker(userLocation.latitude, userLocation.longitude, 'Your Location');

    }

    // Determine if you reached the target location are within X metres!
    let within = 0.0005;
    if (targetLocation.latitude >= userLocation.latitude - within && targetLocation.latitude <= userLocation.latitude + within && targetLocation.longitude >= userLocation.longitude - within && targetLocation.longitude <= userLocation.longitude + within) {

        // Use the saved id of the watchPosition() call in the clearWatch() function to stop watching the user's location.
        navigator.geolocation.clearWatch(id);

        // Alert the user that they have reached their target location
        alert.firstElementChild.firstElementChild.innerText = 'You have reached the target location!';
        alert.style.backgroundColor = 'green';

    }
}

function error(error) {
    console.error(`(${error.code}): ${error.message}`); // ERROR
}

navigator.geolocation.getCurrentPosition(initialSuccess, error, options);
