/* Using Leaflet.js */

// Keep it simple.

let map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const locationFinder = {
    route: [],
    lowest: {},
    looking: false,
    options: {
        maximumAge: 0,
        timeout: Infinity,
        enableHighAccuracy: true
    },
    currentPosition: function() {
        locationFinder.looking = true;
        return navigator.geolocation.getCurrentPosition(this.success, this.error, this.options)
    },
    success: async function(position) {
        locationFinder.latitude = position.coords.latitude;
        locationFinder.longitude = position.coords.longitude;

        console.log(locationFinder.route);

        L.marker([locationFinder.latitude, locationFinder.longitude]).addTo(map)
            .bindPopup('your location')
            .openPopup();

        locationFinder.latSign = Math.sign(position.coords.latitude);
        locationFinder.lonSign = Math.sign(position.coords.longitude);
        return await fetcher(`[out:json]; way(around:50, ${locationFinder.latitude}, ${locationFinder.longitude})["highway"]; out body; `)
            .then(data => {

                /*

                    Data is returned as locations of streets in node value, forced to requery.

                 */

                let l = data.elements;

                for (let i = 0; i < l.length; i++) {
                    // Query to get the lat/lon values from node

                    fetcher(`[out:json]; node(id: ${l[i].id}, ${l[i].nodes}); out body;`)
                        .then(data => {

                            // Returned value is multiple lat/lons

                            let q = data.elements;

                            for (let g = 0; g < q.length; g++) {

                                // compare with current user position (of this run)

                                const lati = locationFinder.latitude - q[g].lat;
                                const longi = locationFinder.longitude - q[g].lon;

                                if (g === 0) {
                                    locationFinder.lowest.latVal = lati;
                                    locationFinder.lowest.lonVal = longi;
                                }


                                if (locationFinder.latSign === Math.sign(q[g].lat) && locationFinder.lonSign === Math.sign(q[g].lon)) {
                                    // allowed to go.
                                    if (Math.abs(locationFinder.lowest.latVal) > Math.abs(lati) && Math.abs(locationFinder.lowest.lonVal) > Math.abs(longi)) {
                                        locationFinder.lowest.latVal = lati;
                                        locationFinder.lowest.lonVal = longi;
                                        locationFinder.lowest.latitude = q[g].lat;
                                        locationFinder.lowest.longitude = q[g].lon;
                                        console.log(locationFinder.lowest);
                                    }
                                    if (i === l.length - 1 && g === q.length - 1) {
                                        L.marker([locationFinder.lowest.latitude, locationFinder.lowest.longitude]).addTo(map)
                                            .bindPopup('route 1')
                                            .openPopup();
                                        locationFinder.latitude = locationFinder.lowest.latitude;
                                        locationFinder.longitude = locationFinder.lowest.longitude;
                                        locationFinder.looking = false;
                                    }
                                }
                            }
                        });
                }
            })
    },
    error: function(error) {
        console.error(error);
    }
}

const queryString = `https://overpass-api.de/api/interpreter?data=`;
async function fetcher(query) {
    return await fetch(queryString + encodeURIComponent(query))
        .then(response => response.json())
        .catch(error => console.error(error));
}


const main = async () => {

    // The reason for not using watchPosition here is because it's too quick! for the overpass API.
    // Couldn't find a way to guarantee it happening every couple of seconds through options.
    // So below is a working system, that might be overcomplicated at this point, but will be simplified once I realize.

    let run = 0;


    console.log('started');

    let routeFound = false;
    while (!routeFound) {
        if (!locationFinder.looking) {
            locationFinder.currentPosition();
        }

        if (run === 2) {
            console.log('ended');
            routeFound = true;
            return 1;
        }
        console.log('ran');
        run++;



    }
}
main()
    .then(response => console.log('main:', response))
    .catch(error => console.error(error));


// get user location.

// wait for that to be returned.

// use the location on the set query stuff above.

// wait for the 'lowest' return value.

// print that point (or path to that point)
