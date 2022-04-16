import "./style.css";
function initMap() {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const pyrmont = { lat: lat, lng: lon };
        const searchBtn = document.getElementById("searchBtn");
        const placelist = document.getElementById("places");
        searchBtn.onclick = function (e) {
            e.preventDefault();
            while (placelist.firstChild) {
                placelist.removeChild(placelist.firstChild);
            }
        };
        const map = new google.maps.Map(document.getElementById("map"), {
            center: pyrmont,
            zoom: 15,
            mapId: "8d193001f940fde3",
            backgroundColor: "white",
        });
        const curLocation = new google.maps.Marker({
            map,
            title: "აქ ვარ",
            label: "აქ ვარ",
            position: pyrmont,
            animation: google.maps.Animation.BOUNCE,
        });
        let rdus = 1500;
        const inpt = document.getElementById("inpt");
        inpt?.addEventListener("change", (e) => {
            rdus = parseFloat(e.target.value);
            // Create the map.
            const map = new google.maps.Map(document.getElementById("map"), {
                center: pyrmont,
                zoom: 15,
                mapId: "8d193001f940fde3",
                backgroundColor: "white"
            });
            const curLocation = new google.maps.Marker({
                map,
                // icon: image,
                title: "აქ ვარ",
                label: "აქ ვარ",
                position: pyrmont,
                animation: google.maps.Animation.BOUNCE,
            });
            // Create the places service.
            const service = new google.maps.places.PlacesService(map);
            let getNextPage;
            const moreButton = document.getElementById("more");
            moreButton.onclick = function () {
                moreButton.disabled = true;
                if (getNextPage) {
                    getNextPage();
                }
            };
            // Perform a nearby search.
            service.nearbySearch({ location: pyrmont, radius: rdus, type: "school", keyword: "საჯარო სკოლა", openNow: false }, (results, status, pagination) => {
                console.log('res: ' + rdus);
                if (status !== "OK" || !results)
                    return;
                // results= []
                addPlaces(results, map);
                moreButton.disabled = !pagination || !pagination.hasNextPage;
                if (pagination && pagination.hasNextPage) {
                    getNextPage = () => {
                        // Note: nextPage will call the same handler function as the initial call
                        pagination.nextPage();
                    };
                }
            });
        });
    });
}
function addPlaces(places, map) {
    const placesList = document.getElementById("places");
    for (const place of places) {
        if (place.geometry && place.geometry.location) {
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            const contentString = `${place.name}`;
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 250,
            });
            const service = new google.maps.places.PlacesService(map);
            const marker = new google.maps.Marker({
                map,
                icon: image,
                // title: place.name,
                position: place.geometry.location,
                animation: google.maps.Animation.BOUNCE,
            });
            // marker.addListener("click", () => {
            //   infowindow.close();
            //   infowindow.open({
            //     anchor: marker,
            //     map,
            //     shouldFocus: true,
            //   });
            // });
            marker.addListener("mouseover", function () {
                const request = {
                    placeId: `${place.place_id}`,
                    language: 'ge',
                    fields: [
                        "name",
                        "formatted_address",
                        "place_id",
                        "geometry",
                        "photo",
                        "rating",
                        "user_ratings_total",
                    ],
                };
                service.getDetails(request, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK &&
                        place &&
                        place.geometry &&
                        place.geometry.location) {
                        // const marker = new google.maps.Marker({
                        //   map,
                        //   position: place.geometry.location,
                        // });
                        infowindow.open({
                            map,
                            anchor: marker,
                            shouldFocus: true,
                        });
                        let imgCont = "";
                        if (place.photos && place.photos.length > 0) {
                            imgCont =
                                "<img src='" +
                                    `${place.photos[0].getUrl({
                                        maxWidth: 200,
                                        maxHeight: 150,
                                    })}` +
                                    "'></img>";
                        }
                        infowindow.setContent("<div class='infowindow-container'>" +
                            imgCont +
                            "<div class='inner'><h4>" +
                            place.name +
                            "</h4><h5>" +
                            place.formatted_address +
                            "</h5>" +
                            place.international_phone_number +
                            "<p>Rating: " +
                            place.rating +
                            "</p><p>Total reviews: " +
                            place.user_ratings_total +
                            "</p></div></div>");
                    }
                });
            }); //end mouse over
            // infowindow.addListener("cli",function () {
            // })
            marker.addListener("mouseout", function () {
                infowindow.close();
            });
            map.addListener("click", function () {
                infowindow.close();
            });
            // google.maps.event.addListener(marker, "click", () => {
            //   const content = document.createElement("div");
            //   const nameElement = document.createElement("h2");
            //   nameElement.textContent = place.name!;
            //   content.appendChild(nameElement);
            //   const placeIdElement = document.createElement("p");
            //   placeIdElement.textContent = place.place_id!;
            //   content.appendChild(placeIdElement);
            //   const placeAddressElement = document.createElement("p");
            //   placeAddressElement.textContent = place.formatted_address!;
            //   content.appendChild(placeAddressElement);
            //   infowindow.setContent(content);
            //   infowindow.open(map, marker);
            // });
            const li = document.createElement("li");
            li.textContent = place.name;
            setTimeout(() => {
                placesList.appendChild(li);
            }, 300);
            li.addEventListener("click", () => {
                map.setCenter(place.geometry.location);
                const request = {
                    placeId: `${place.place_id}`,
                    fields: [
                        "name",
                        "formatted_address",
                        "place_id",
                        "geometry",
                        "photo",
                        "rating",
                        "user_ratings_total",
                        "formatted_phone_number",
                        "adr_address",
                        "address_components",
                        "types",
                        "url",
                        "website"
                    ],
                };
                service.getDetails(request, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK &&
                        place &&
                        place.geometry &&
                        place.geometry.location) {
                        // const marker = new google.maps.Marker({
                        //   map,
                        //   position: place.geometry.location,
                        // });
                        infowindow.open({
                            map,
                            anchor: marker,
                            // shouldFocus: true,
                        });
                        let imgCont = "";
                        if (place.photos && place.photos.length > 0) {
                            imgCont =
                                "<img src='" +
                                    `${place.photos[0].getUrl({
                                        maxWidth: 200,
                                        maxHeight: 150,
                                    })}` +
                                    "'></img>";
                        }
                        infowindow.setContent("<div class='infowindow-container'>" +
                            imgCont +
                            "<div class='inner'><h4>" +
                            place.name +
                            "</h4><hr/><h5>" +
                            place.adr_address +
                            "</h5><hr/><h5><i class='bi bi-telephone'></i> " +
                            place.formatted_phone_number +
                            "</h5><a href='" + place.url + "' target='blank'><p>" +
                            place.url +
                            "</p></a><p>Total reviews: " +
                            place.user_ratings_total +
                            "</p></div></div>");
                    }
                });
            });
            li.addEventListener("mouseout", function () {
                infowindow.close();
            });
        }
    }
}
export { initMap };
