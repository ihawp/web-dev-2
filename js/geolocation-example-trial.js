/* Using Leaflet.js */

// Keep it simple.

const locationFinder = {
    route: [],
    lowest: {},
    options: {
        maximumAge: 0,
        timeout: Infinity,
        enableHighAccuracy: true
    },
    currentPosition: function() {
        navigator.geolocation.getCurrentPosition(this.success, this.error, this.options)
    },
    success: function(position) {

        console.log('success');
        locationFinder.latitude = position.coords.latitude;
        locationFinder.longitude = position.coords.longitude;

        let map = L.map('map').setView([0, 0], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([locationFinder.latitude, locationFinder.longitude]).addTo(map)
            .bindPopup('your location')
            .openPopup();

        console.log(locationFinder.latitude, locationFinder.longitude);

        locationFinder.latSign = Math.sign(position.coords.latitude);
        locationFinder.lonSign = Math.sign(position.coords.longitude);
        fetcher(`[out:json]; way(around:50, ${locationFinder.latitude}, ${locationFinder.longitude})["highway"]; out body; `)
            .then(data => {

                /*

                    Data is returned as locations of streets in node value, forced to requery.

                 */


                data.elements.forEach((item, key) => {

                    // Query to get the lat/lon values from node

                    fetcher(`[out:json]; node(id: ${item.id}, ${item.nodes}); out body;`)
                        .then(dataa => {

                            // Returned value is multiple lat/lons

                            dataa.elements.forEach((itemm, keyy) => {

                                // compare with current user position (of this run)

                                const lati = locationFinder.latitude - itemm.lat;
                                const longi = locationFinder.longitude - itemm.lon;

                                if (keyy === 0) {
                                    locationFinder.lowest.latVal = lati;
                                    locationFinder.lowest.lonVal = longi;
                                }

                                if (locationFinder.latSign === Math.sign(itemm.lat) && locationFinder.lonSign === Math.sign(itemm.lon)) {
                                    // allowed to go.
                                    if (Math.abs(locationFinder.lowest.latVal) > Math.abs(lati) && Math.abs(locationFinder.lowest.lonVal) > Math.abs(longi)) {
                                        locationFinder.lowest.latVal = lati;
                                        locationFinder.lowest.lonVal = longi;
                                        locationFinder.lowest.latitude = itemm.lat;
                                        locationFinder.lowest.longitude = itemm.lon;
                                        console.log(locationFinder.lowest);
                                        console.log(keyy, dataa.elements);
                                    }
                                }
                            })
                        })
                });
                console.log(locationFinder.lowest);
            })
    },
    error: function(error) {
        console.error(error);
    }
}

locationFinder.currentPosition();


const queryString = `https://overpass-api.de/api/interpreter?data=`;
async function fetcher(query) {
    return await fetch(queryString + encodeURIComponent(query))
        .then(response => response.json())
        .catch(error => console.error(error));
}
