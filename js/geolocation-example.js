/*

    Using Leaflet.js

 */

// DOM gets
const geoLocation = document.getElementById("geolocation");
const alert = document.getElementById('alert');

/*

    Options
    The api intakes these options to determine how it should act.

    enableHighAccuracy: true;
    Causes more power consumption and slower response time, but
    only if the device is able to find a more accurate position.

    maximumAge:
        The maximum age of a cached location allowed is the value set to maximumAge.
        If unset (default: 0) the app will always require a new location.
        If set to Infinity then the device must find a cached location.


*/
const options = {

    // Maximum age of cached position (time from unix), default: 0.
    maximumAge: 0,

    // Maximum amount of time the browser has to return a position, default: Infinity.
    timeout: Infinity,

    // More processing of where you are, generally better output.
    enableHighAccuracy: true

};

/*

    Initialize variable (id) to hold id of watchPosition() for clearWatch().

 */
const id = navigator.geolocation.watchPosition(success, error, options);

let lastLocation;

function success(pos) {

    /*

        Upon success the longitude/latitude position of the user is passed
        through callback to the success callback (with has one parameter, the
        users returned position)

     */
    const userLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
    }
    const targetLocation = {
        latitude: pos.coords.latitude + 0.01,
        longitude: pos.coords.longitude + 0.01
    }

    document.getElementById('user-latitude').value = userLocation.latitude;
    document.getElementById('user-longitude').value = userLocation.longitude;
    document.getElementById('target-latitude').value = targetLocation.latitude;
    document.getElementById('target-longitude').value = targetLocation.longitude;

    let map = L.map('map').setView([userLocation.latitude, userLocation.longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([userLocation.latitude, userLocation.longitude]).addTo(map)
        .bindPopup('your location')
        .openPopup();

    L.marker([targetLocation.latitude, targetLocation.longitude]).addTo(map)
        .bindPopup('target')
        .openPopup();


    googleMaps(userLocation, lastLocation, targetLocation);
    lastLocation = userLocation;

    // Determine if you reached the target location!
    if (targetLocation.latitude >= userLocation.latitude - 0.001 && targetLocation.latitude <= userLocation.latitude + 0.001 && targetLocation.longitude >= userLocation.longitude - 0.001 && targetLocation.longitude <= userLocation.longitude + 0.001) {
        navigator.geolocation.clearWatch(id);
        alert.innerText = 'You have reached the target location!';
    } else {
        alert.innerText = 'You are NOT at the target location.'
    }
}

function error(err) {
    console.warn(`Error (${err.code}): ${err.message}`);
}

function googleMaps(userLocation, lastLocation, targetLocation) {
    console.log(userLocation, lastLocation, targetLocation);

    // User direction
    if (lastLocation != undefined) {
        if (userLocation.latitude < lastLocation.latitude) {
            console.log('moving south');
        } else {
            console.log('moving north');
        }
        if (userLocation.longitude < lastLocation.longitude) {
            console.log('moving west');
        } else {
            console.log('moving east');
        }
    }
    // IF latitude GOES DOWN they are moving SOUTH
    // IF latitude GOES UP they are moving NORTH

    // IF longitude GOES UP they are MOVING EAST
    // IF longitude GOES DOWN they are MOVING WEST

}


/*

    Get the position of the user and stop.

 */
// navigator.geolocation.getCurrentPosition(success, error, options);
