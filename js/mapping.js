
// Google Maps Geocoding API
const GoogleGeocodeAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GoogleAPIKey = 'AIzaSyB0ADHm3UtA2mFbKnsYruIA-AlzHkfPAQI'; // This should not be visible in a public GitHub repo.

function updateLocation (loc) {
  let request = new XMLHttpRequest();

  // Construct a formatted location (i.e., latitude/longitude) string.
  let formattedLoc = '';
  if (loc.hasOwnProperty('lat') && loc.hasOwnProperty('lon')) {
    formattedLoc = formattedLatLong(loc.lat, loc.lon);
  } else {
    formattedLoc = 'Badly formed location struct.';
  }

  // Construct the query string.
  let values = {
    latlng: `${loc.lat}, ${loc.lon}`,
    key: GoogleAPIKey
  };
  let queryString = queryBuilder(values);

  // Open the connection:
  //   request method, url, (optional) asych flag, asych by default
  request.open('GET', GoogleGeocodeAPIURL + queryString, true);

  // Callback for successfull request completion.
  request.onload = function () {
    let response = JSON.parse(request.response); // this.response
    let locationDiv = document.querySelector('#location');

    //console.log(response);
    switch (response.status) {
      case 'OK':
        if (response.results.length > 0) {
           locationDiv.innerHTML = `${formattedLoc} -> ${response.results[0].formatted_address}`;
        }
        else {
          locationDiv.innerHTML = `${formattedLoc} -> Status is OK but there are no results!`;
        }
        break;
      case 'ZERO_RESULTS':
        locationDiv.innerHTML = `${formattedLoc} -> No results for that location.`;
        break;
      case 'INVALID_REQUEST':
        locationDiv.innerHTML = `${formattedLoc} -> Invalid API request!`;
        break;
    }
  };

  // Callback for errors.
  request.onerror = function (error) {
    alert(`ERROR(${error.code}): ${error.message}`);
  };

  // Send the request to the API server.
  request.send();
}

function formattedLatLong(latitude, longitude) {
  let northSouth = latitude  > 0 ? 'N' : 'S';
  let eastWest   = longitude > 0 ? 'W' : 'E';

  return `(${Math.abs(latitude.toFixed(4))}° ${northSouth}, ${Math.abs(longitude.toFixed(4))}° ${eastWest})`;
}
