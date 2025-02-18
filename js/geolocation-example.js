/* Using Leaflet.js */

// DOM gets
const alert = document.getElementById('alert');

/*

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

    // When set to true, enableHigh... does more processing in finding where you are, generally finds the best available output which is the most accurate location.
    enableHighAccuracy: true

};

/*

    Get the position of the user and stop.

 */
let unusedUserLocation = navigator.geolocation.getCurrentPosition(success, error, options);


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
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
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


    let route = [[userLocation.latitude, userLocation.longitude]];

    // find route

    let fetcher = async (current) => {

        // find roads around the user

        let query = `[out:json]; way(around:50, ${current[0]}, ${current[1]})["highway"]; out body; `;

        let queryString = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        return await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.elements.length > 0) {
                    alert.innerText += "\nThere is a road";
                    console.log(data);

                    // for all the roads found check for the closest

                    data.elements.forEach((item) => {
                        query = `[out:json]; node(${item.nodes.join(',')}); out body; `;
                        return fetch(query);
                    });
                    query = `[out:json]; node(${data.elements.node.join(',')}); out body; `;
                    return fetch(query);
                } else {
                    alert.innerText += "\nThere is no road";
                }
            })
            .then(response => response.json())
            .then(data => {

                // check the direction of the road and allow to repeat

                const coordinates = data.elements.map(node => ({

                    id: node.id,

                    lat: node.lat,

                    lon: node.lon

                }));


                console.log("Coordinates of the street:", coordinates);
            })
            .catch(error => console.error('Error fetching road data:', error));
    }

    let wrapper = async () => {
        let foundRoute = false;

        while (!foundRoute) {
            let currentRoute = [targetLocation.latitude, targetLocation.longitude];
            let l = await fetcher(currentRoute);
            if (l !== 0) {
                route.push(currentRoute);
            }
            foundRoute = true;
        }
    }
    wrapper()
        .then(response => console.log(response));


    route.push([targetLocation.latitude, targetLocation.longitude]);

    let polyline = L.polyline(route, {color: 'red'}).addTo(map);

    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());


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

    // IF latitude GOES DOWN they are moving SOUTH
    // IF latitude GOES UP they are moving NORTH

    // IF longitude GOES UP they are MOVING EAST
    // IF longitude GOES DOWN they are MOVING WEST

}
