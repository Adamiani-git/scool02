import "./style.css";



function initMap(): void {

  // navigator.geolocation.getCurrentPosition(function (position) {
  //   const lat = position.coords.latitude
  //   const long = position.coords.longitude
  // })
  
  
  navigator.geolocation.getCurrentPosition((position) => { 
    console.log("Got position", position.coords);
    const lat = position.coords.latitude; 
    const lon = position.coords.longitude;
 
  const pyrmont = { lat: lat, lng: lon };
  
  // Create the map.
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: pyrmont,
      zoom: 15,
      mapId: "8d193001f940fde3",
    } as google.maps.MapOptions
  );

  // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  let getNextPage: () => void | false;
  const moreButton = document.getElementById("more") as HTMLButtonElement;

  moreButton.onclick = function () {
    moreButton.disabled = true;

    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.
  service.nearbySearch(
    { location: pyrmont, radius: 1500, type: "school" },
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus,
      pagination: google.maps.places.PlaceSearchPagination | null
    ) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map);
      moreButton.disabled = !pagination || !pagination.hasNextPage;

      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    }
  );
});
}

function addPlaces(
  places: google.maps.places.PlaceResult[],
  map: google.maps.Map
) {
  const placesList = document.getElementById("places") as HTMLElement;

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon!,
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

      // console.log(place);
      console.log(place);

      const service = new google.maps.places.PlacesService(map);

      const marker = new google.maps.Marker({
        map,
        // icon: image,
        // title: place.name,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
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
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
            // const marker = new google.maps.Marker({
            //   map,
            //   position: place.geometry.location,
            // });
            
            infowindow.open({
              map, 
              anchor:marker,
              shouldFocus: true,
              });

            let imgCont='';

            if (place.photos && place.photos.length > 0) {
              imgCont =
                "<img src='" +
                `${place.photos[0].getUrl({
                  maxWidth: 200,
                  maxHeight: 150,
                })}` +
                "'></img>";
            }
            infowindow.setContent(
              "<div class='infowindow-container'>" +
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
                "</p></div></div>"
            );
          }
        });
      }); //end mouse over

      // infowindow.addListener("cli",function () {
        // })
        
        marker.addListener("mouseout", function () {
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

      li.textContent = place.name!;
      placesList.appendChild(li);

      li.addEventListener("click", () => {
        map.setCenter(place.geometry!.location!);
      });
    }
  }
}
export { initMap };
