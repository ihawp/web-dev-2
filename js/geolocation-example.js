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
// let userLocation = navigator.geolocation.getCurrentPosition(success, error, options);


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
    const startLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latSign: Math.sign(pos.coords.latitude),
        lonSign: Math.sign(pos.coords.longitude)
    }
    const targetLocation = {
        latitude: pos.coords.latitude - 0.003,
        longitude: pos.coords.longitude - 0.009
    }

    document.getElementById('user-latitude').value = startLocation.latitude;
    document.getElementById('user-longitude').value = startLocation.longitude;
    document.getElementById('target-latitude').value = targetLocation.latitude;
    document.getElementById('target-longitude').value = targetLocation.longitude;


    let route = [[startLocation.latitude, startLocation.longitude]];

    let fetcher = async (current) => {

        // find roads around the user

        let queryString = `https://overpass-api.de/api/interpreter?data=`;
        let query = `[out:json]; way(around:50, ${current.latitude}, ${current.longitude})["highway"]; out body; `;

        return await fetch(queryString + encodeURIComponent(query))
            .then(response => response.json())
            .then(data => {
                if (data.elements.length > 0) {
                    alert.innerText += "\nThere is a road";


                    let lastOne;
                    data.elements.forEach(async (item) => {

                        query = `[out:json]; node(id: ${item.id}, ${item.nodes}); out body;`;
                        await fetch(queryString + encodeURIComponent(query))
                            .then(response => response.json())
                            .then(data => {

                                data.elements.forEach((item, key) => {
                                    if (key === 0) {
                                        console.log(item, key);
                                        lastOne = item;
                                        return;
                                    }
                                    if (startLocation.latSign === Math.sign(item.lat) && startLocation.lonSign === Math.sign(item.lon)) {
                                        console.log(item, key);
                                        item.latVal = startLocation.latitude - item.lat;
                                        item.lonVal = startLocation.longitude - item.lon;
                                        if (item.latVal < lastOne.latVal && item.lonVal < lastOne.lonVal) {
                                            lastOne = item;
                                        }
                                    }
                                });
                                alert.innerText += `${lastOne.lat}, ${lastOne.lon}`;

                                return lastOne;
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    });
                } else {
                    alert.innerText += "\nThere is no road";
                }
            })
            .catch(error => console.error('Error fetching road data:', error));
    }

    let wrapper = async () => {
        let foundRoute = false;

        while (!foundRoute) {

            console.log('FOUND ROUTE: ' + foundRoute);

            foundRoute = true;

            console.log('FOUND ROUTE: ' + foundRoute);

            let l = await fetcher(targetLocation);



            console.log(l);

            return l;
        }

        return 'Route Found!';
    }
    wrapper()
        .then(response => {


            console.log(response);

            L.marker([startLocation.latitude, startLocation.longitude]).addTo(map)
                .bindPopup('your location')
                .openPopup();

            L.marker([targetLocation.latitude, targetLocation.longitude]).addTo(map)
                .bindPopup('target')
                .openPopup();

            route.push([targetLocation.latitude, targetLocation.longitude]);
            let polyline = L.polyline(route, {color: 'red'}).addTo(map);
            map.fitBounds(polyline.getBounds());
        })
        .catch(error => console.error(error));

    lastLocation = startLocation;
    navigator.geolocation.clearWatch(id);

    // Determine if you reached the target location!
    if (targetLocation.latitude >= startLocation.latitude - 0.001 && targetLocation.latitude <= startLocation.latitude + 0.001 && targetLocation.longitude >= startLocation.longitude - 0.001 && targetLocation.longitude <= startLocation.longitude + 0.001) {
        navigator.geolocation.clearWatch(id);
        alert.innerText = 'You have reached the target location!';
    } else {
        alert.innerText = 'You are NOT at the target location.'
    }
}

function error(err) {
    console.warn(`Error (${err.code}): ${err.message}`);
}

    // IF latitude GOES DOWN they are moving SOUTH
    // IF latitude GOES UP they are moving NORTH

    // IF longitude GOES UP they are MOVING EAST
    // IF longitude GOES DOWN they are MOVING WEST
let map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


