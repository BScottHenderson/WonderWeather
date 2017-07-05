
// OpenWeather API
//const OpenWeatherAPIURL = 'http://api.openweathermap.org/data/2.5/weather';
// To make the unsecure (http instead of https) OpenWeather API URL work
// via GitHub Pages we use the CORS API link to "trick" GitHub into thinking
// we're using a secure API.  So the API URL we'll really use is:
const OpenWeatherAPIURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather';
const OpenWeatherAPIKey = 'b64c4de3217bb9707c37288cfcfb6f69'; // This should not be visible in a public GitHub repo.

/*
API Docs are here: http://openweathermap.org/current

use snow animation
create a version for rain
what about wind? clouds w/wind?
sunshine?
partly/mostly cloudy?

display mini-map of lat/long -> google maps api?

*/

// Call the weather API to update the current weather at
// the specified location.
function getWeatherLoc (latitude, longitude) {
  event.preventDefault();

  // Construct location object.
  let loc = {
    lat: latitude || 0.0,
    lon: longitude || 90.0,
  }

  // Call the weather API.
  updateWeather(loc);
}

// Call the weather API to update the current weather at
// the current location as reported by the browser.
function getWeatherCurrentLoc() {
  event.preventDefault();

  if (!('geolocation' in navigator)) {
    alert('Your browser does not support geolocation.');
    return;
  }

  let geo_success = function(position) {
    // Construct location object.
    let loc = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }

    // Call the weather API.
    updateWeather(loc);
  };
  let geo_error = function(error) {
    alert(`ERROR(${error.code}): ${error.message}`);
  };

  navigator.geolocation.getCurrentPosition(geo_success, geo_error);
}

// Update the weather using data in the specified query string.
function updateWeather (loc) {
  let request = new XMLHttpRequest();

  // Build the query string.
  let values = loc;
  values.appid = OpenWeatherAPIKey;
  let queryString = queryBuilder(values);

  // Open the connection:
  //   request method, url, (optional) asych flag, asych by default
  request.open('GET', OpenWeatherAPIURL + queryString, true);

  // Callback for successfull request completion.
  request.onload = function () {
    let response = JSON.parse(request.response);
    let weatherSection   = document.querySelector('section.weather');
    let weatherInfo      = document.querySelector('#weather-info');
    let weatherIcon      = document.querySelector('#weather-icon');
    let weatherAnimation = document.querySelector('.weather-animation');

    console.log(response);

    // Make the weather section visible.
    weatherSection.style.visibility = 'visible';

    // Set weather info and icon.
    weatherInfo.innerHTML =
      `Temperature: ${Math.round(KelvinToFahrenheit(response.main.temp))}°F<br />` +
      `Humidity: ${response.main.humidity}%`;
    weatherIcon.src = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`

    // Set weather animation.
    let condition = response.weather[0].main;
    weatherAnimation.innerHTML = condition;
    let weatherAnimationClassNames = ['weather-animation'];
    weatherAnimationClassNames.push('snow');

    // if (condition.match(/rain/i)) {
    //   weatherAnimationClassNames.push('rain');
    // } else if (condition.match(/snow/i)) {
    //   weatherAnimationClassNames.push('snow');
    // } else if (condition.match(/cloud/i)) {
    //     weatherAnimationClassNames.push('clouds');
    // } // else clear -> display sunny weather? blue sky
    weatherAnimation.className = weatherAnimationClassNames.join(' ');

    // Also display the location.
    updateLocation(loc);
  };

  // Callback for errors.
  request.onerror = function (error) {
    alert(`ERROR(${error.code}): ${error.message}`);
  };

  // Send the request to the API server
  request.send();
}

// Convert (key,value) pairs to a URL query string.
function queryBuilder (queryObj) {
  // Assume queryObj is (key,value) pairs and is enumerable.
  // concatenate the pairs "key=value" using '&' to join
  // Return the string with '?' prepended.
  let keyValueStrings = [];

  for (let key in queryObj) {
    if (queryObj.hasOwnProperty(key)) {
      //console.log("Key is " + key + ", value is " + queryObj[key]);
      keyValueStrings.push(`${encodeURI(key)}=${encodeURI(queryObj[key])}`);
    }
  }

  let queryString = '?' + keyValueStrings.join('&');

  return queryString;
}

// Is the given 'data' in JSON format?
function isJSON(data) {
  data = typeof data !== "string"
    ? JSON.stringify(data)
    : data;

  try {
    data = JSON.parse(data);
  } catch (e) {
    return false;
  }

  if (typeof data === "object" && data !== null) {
    return true;
  }

  return false;
}

// Convert temperature from Kelvin to Fahrenheit
function KelvinToFahrenheit (degreesK) {
  return CelsiusToFahrenheit(KelvinToCelsius(degreesK));
}

// Convert temperature from Kelvin to Celsius
function KelvinToCelsius (degreesK) {
  return degreesK - 273.15;
}

// Convert temperature from Celsius to Fahrenheit
function CelsiusToFahrenheit (degreesC) {
  return (degreesC * 5.0/9.0) + 32.0;
}
