
const apiURL = 'http://api.openweathermap.org/data/2.5/weather';
// To make the unsecurity (http instead of https) OpenWeather API URL work
// via GitHub Pages we use the CORS API link to "trick" GitHub into thinking
// we're using a secure API.  So the API URL we'll really use is:
const apiURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather';

/*
&appid=b64c4de3217bb9707c37288cfcfb6f69
● API Docs are here: http://openweathermap.org/current
*/

function handleClick () {
  event.preventDefault();

  // construct the request URL using the base API URL and input from the user
  let button = event.srcElement;
  //console.log(button.name);
  let values = {
    lat: button.name === 'london' ? 51.5074 : 47.6762,
    lon: button.name === 'london' ? 0.1278 : -122.3182,
    appid: 'b64c4de3217bb9707c37288cfcfb6f69'
  };
  let queryString = queryBuilder(values);

  getWeather(queryString);
}

function getWeather (queryString) {
  // create a new request object
  let request = new XMLHttpRequest();

  // open the connection:
  //   request method, url, (optional) asych flag, asych by default
  request.open('GET', apiURL + queryString, true);

  // callback for when the request completes
  request.onload = function () {
    let response = JSON.parse(request.response);
    let weatherDiv = document.querySelector('#weather');

    //console.log(response);
    weatherDiv.innerHTML = response.weather[0].main;
  };

  // callback for when there's an error
  request.error = function (err) {
  	console.log(err);
  };

  // send the request to the API server
  request.send();
}

// Convert (key,value) pairs to a query string.
function queryBuilder (queryObj) {
  // assume queryObj is (key,value) pairs
  // concatenate the pairs "key=value" using '&' to join
  // return the string (prepend '?')
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
