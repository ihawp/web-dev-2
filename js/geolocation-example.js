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
    maximumAge: 0,
    timeout: Infinity,
    enableHighAccuracy: true
};

/*

    Initialize variable (id) to hold id of watchPosition() for clearWatch().

 */
const id = navigator.geolocation.watchPosition(success, error, options);

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
    }

    // Add map to 'src' of iframe on DOM
    const openStreetMapURL = `https://www.openstreetmap.org/export/embed.html?bbox=${ userLocation.longitude },${ userLocation.latitude },${ userLocation.longitude },${ userLocation.latitude }&layer=mapnik&marker=${ userLocation.latitude },${ userLocation.longitude }`;

    if (geoLocation.src !== openStreetMapURL) {
        geoLocation.src = openStreetMapURL;
    }

    // Determine if you reached the target location!
    if (targetLocation.latitude >= userLocation.latitude - 0.001 && targetLocation.latitude <= userLocation.latitude + 0.001 && targetLocation.longitude >= userLocation.longitude - 0.001 && targetLocation.longitude <= userLocation.longitude + 0.001) {
        navigator.clearWatch(id);
        alert.innerText = 'You have reached the target location!';
    } else {
        alert.innerText = 'You are NOT at the target location.'
    }
}

function error(err) {
    console.warn(`Error (${err.code}): ${err.message}`);
}


/*

    Get the position of the user and stop.

 */
// navigator.geolocation.getCurrentPosition(success, error, options);
