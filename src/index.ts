import "./style.css";
const { DataS } = require("./Data.json");

function initMap(): void {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const pyrmont = { lat: lat, lng: lon };

    // const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
    const searchForm = document.getElementById("searchForm") as HTMLElement;
    const placelist = document.getElementById("places") as HTMLElement;

    searchForm.onsubmit = function (e) {
      e.preventDefault();

      while (placelist.firstChild) {
        placelist.removeChild(placelist.firstChild);
      }
    };
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: pyrmont,
        zoom: 15,
        mapId: "8d193001f940fde3",
        backgroundColor: "white",
      } as google.maps.MapOptions
    );
    const curLocation = new google.maps.Marker({
      map,
      title: "აქ ვარ",
      label: "მე",
      position: pyrmont,
      animation: google.maps.Animation.DROP,
    });

    let rdus = 1500;
    const inpt = document.getElementById("inpt");
    inpt?.addEventListener("change", (e: any) => {
      rdus = parseFloat(e.target.value);

      // Create the map.

      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: pyrmont,
          zoom: 15,
          mapId: "8d193001f940fde3",
          backgroundColor: "white",
        } as google.maps.MapOptions
      );

      const curLocation = new google.maps.Marker({
        map,
        // icon: image,
        title: "აქ ვარ",
        label: "მე",
        position: pyrmont,
        animation: google.maps.Animation.DROP,
      });

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
        {
          location: pyrmont,
          radius: rdus,
          type: "school",
          keyword: "საჯარო სკოლა",
          openNow: false,
        },
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
          pagination: google.maps.places.PlaceSearchPagination | null
        ) => {
          if (status !== "OK" || !results) return;
          // results= []

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
        maxWidth: 350,
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

      // marker.addListener("mouseover", function () {
      //   const request = {
      //     placeId: `${place.place_id}`,
      //     language: "ge",
      //     fields: [
      //       "name",
      //       "formatted_address",
      //       "place_id",
      //       "geometry",
      //       "photo",
      //       "rating",
      //       "user_ratings_total",
      //     ],
      //   };

      //   service.getDetails(request, (place, status) => {
      //     if (
      //       status === google.maps.places.PlacesServiceStatus.OK &&
      //       place &&
      //       place.geometry &&
      //       place.geometry.location
      //     ) {
      //       // const marker = new google.maps.Marker({
      //       //   map,
      //       //   position: place.geometry.location,
      //       // });

      //       infowindow.open({
      //         map,
      //         anchor: marker,
      //         shouldFocus: true,
      //       });

      //       let imgCont = "";

      //       if (place.photos && place.photos.length > 0) {
      //         imgCont =
      //           "<img src='" +
      //           `${place.photos[0].getUrl({
      //             maxWidth: 200,
      //             maxHeight: 150,
      //           })}` +
      //           "'></img>";
      //       }

      //       infowindow.setContent(
      //         "<div class='infowindow-container'>" +
      //           imgCont +
      //           "<div class='inner'><h4>" +
      //           place.name +
      //           "</h4><h5>" +
      //           place.formatted_address +
      //           "</h5>" +
      //           place.international_phone_number +
      //           "<p>Rating: " +
      //           place.rating +
      //           "</p><p>Total reviews: " +
      //           place.user_ratings_total +
      //           "</p></div></div>"
      //       );
      //     }
      //   });
      // });
      //end mouse over

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

      li.textContent = place.name!;

      setTimeout(() => {
        placesList.appendChild(li);
      }, 300);

      li.addEventListener("click", () => {
        map.setCenter(place.geometry!.location!);
        const request = {
          placeId: `${place.place_id}`,
          fields: [
            "name",
            "formatted_address",
            "place_id",
            "geometry",
            "photos",
            "rating",
            "user_ratings_total",
            "formatted_phone_number",
            "adr_address",
            "address_components",
            "types",
            "url",
            "website",
            "reviews",
            // "relative_time_description",
            // "profile_photo_url",
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
              anchor: marker,
              // shouldFocus: true,
            });

            let imgCont =
              "<div style='max-width:250px; max-height:250px'></div>";

            if (place.photos && place.photos.length > 0) {
              imgCont =
                "<img src='" +
                place.photos[0].getUrl({
                  maxWidth: 250,
                  maxHeight: 250,
                }) +
                "'/>";
            }

            let localName;
            let localAddress;
            let localPhone;
            let localMail;

            const parseData = function () {
              const nameInGoogle = place?.name?.match(/\d+/);

              const localInfo = DataS.filter((d) =>
                d.name.includes("№" + nameInGoogle + " ")
              ).map((d) => d);

              localName = localInfo[0].name;
              localAddress = localInfo[0].address;
              localPhone = localInfo[0].phone;
              localMail = localInfo[0].mail;
            };

            const reviewList = place.reviews
              ?.filter((r) => r.text != "")
              .map(
                (rev, i) =>
                  "<div key='" +
                  i +
                  "' class='border-bottom mb-2 pb-2'>" +
                  `<div class="fs-6 text-secondary fw-bold "><img class="me-2" style="width:32px; height:32px" src="${rev?.profile_photo_url}"/>${rev.author_name}</div>` +
                  `<div class="text-secondary px-1" style="font-size:14px; text-align:justify;">${rev.text}</div>` +
                  "</div>"
                // console.log(rev.profile_photo_url)
              )
              .join("");

            infowindow.setContent(
              parseData() +
                "<div class='infowindow-container'><div style='margin-top:-15px'>" +
                imgCont +
                "</div><div class='mt-3'><i class='bi bi-mortarboard fs-5'><span  class='text-secondary fs-5'> " +
                localName +
                "</span></i></div><hr/><i class='bi bi-signpost-split fs-5'><span class='text-secondary fs-6'>  " +
                localAddress +
                "</span></i><hr/> <a href='tel:" +
                localPhone +
                "'><i class='bi bi-telephone text-dark fs-5'><span class='text-secondary fs-6'> " +
                localPhone +
                "</span></i></a>" +
                "<div class='mt-3'><i class='bi bi-envelope-paper fs-5'><span  class='text-secondary fs-6'> <a href='mailto:" +
                localMail +
                "'> " +
                localMail +
                "</a></span></i><div class='mt-3'><i class='bi bi-link-45deg fs-5'><span  class='text-secondary fs-6'><a href='" +
                place.url +
                "' target='blank'> " +
                place.url?.substring(0, 28) +
                "</a></span></i></div><hr/></div>" +
                reviewList +
                "</div>"
            );
          }
        });
      });

      // li.addEventListener("mouseout", function () {
      //   infowindow.close();
      // });
    }
  }
}
export { initMap };
