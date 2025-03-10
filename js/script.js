const apiKey = "70a39956c98f4e70a16140915250303";  
const input = document.getElementById("cityInput");  
const searchIcon = document.querySelector(".search .search-icon");  
const suggestionsBox = document.getElementById("suggestions");  
let unit = 'imperial';    
let searchValue;
let lastSearchValue = ''; // New variable to store the last search value 
let geoLocationResult; // Global variable to store the geolocation result  
let lastApiCall; // Declare lastApiCall to hold the function reference  

// Listen for "keypress" on input  
input.addEventListener("keypress", function (event) {  
    if (event.key === "Enter") {  
        event.preventDefault();  // Prevent default form submission (if in a form)  
        triggerSearch("Enter key pressed");  
        suggestionsBox.innerHTML = '';  // Clear suggestions  
        suggestionsBox.style.display = 'none';  // Hide suggestions  
    }  
});  
input.addEventListener("click", function (event) {  
    input.value = '';
});  
// Handle search icon click  
searchIcon.addEventListener("click", function () {  
    triggerSearch("Search icon clicked");  
    suggestionsBox.innerHTML = '';  // Clear suggestions  
    suggestionsBox.style.display = 'none';  // Hide suggestions  
});  

// Handle suggestion click  
suggestionsBox.addEventListener('click', function (event) {  
    // Check if the clicked element is a suggestion  
    if (event.target.classList.contains('suggestion')) {  
        input.value = event.target.textContent.trim(); 
        input.focus();  // Call the method to focus on the input  
		
    }  
   searchValue= input.value;
   lastSearchValue = searchValue; // Store the last search value 
   getWeatherByCoordinates(searchValue);
  
});

input.addEventListener("input", function () {
    fetchSuggestions(input.value.trim());
});

function triggerSearch(action) {  
     searchValue = input.value.trim();  
    if (!searchValue) {  
        document.getElementById('error').innerHTML = `${action} - Please enter a value before searching.`;  
        document.getElementById('error').style.display = 'block';  
        return;  
    } else {  
        document.getElementById('error').style.display = 'none';  
    }  

    lastSearchValue = searchValue; // Store the last search value  
    getWeatherByCoordinates(searchValue); // Pass search value to the API call  
}  

async function getWeatherByCoordinates(searchValue) {  
    // Fetch weather data using city name  
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?q=${searchValue}&days=5&key=${apiKey}&units=${unit}`;  
  
    try {  
        const weatherResponse = await fetch(weatherUrl);  
        if (!weatherResponse.ok) {  
            throw new Error('Network response was not ok');  
        }  

        const data = await weatherResponse.json();  
        console.log(data);  
        lastApiCall = weatherUrl; // Store the last API call  
        lastLat = data.location.lat; // Store last latitude  
        lastLon = data.location.lon; // Store last longitude  
        displayWeatherData(data); // Function to display weather data on the UI  
		
    } catch (error) {  
        console.error("Error fetching weather data:", error);  
        document.getElementById('error').innerHTML = "Error fetching weather data. Please try again.";  
        document.getElementById('error').style.display = 'block';  
    }  
}  

// Function to fetch suggestions from the WeatherAPI  
async function fetchSuggestions(searchValue) {  
    const url = `https://api.weatherapi.com/v1/search.json?q=${searchValue}&key=${apiKey}`;  
    
    try {  
        const response = await fetch(url);  
        if (!response.ok) {  
            throw new Error(`HTTP error! status: ${response.status}`);  
        }  

        const data = await response.json();  
        displaySuggestions(data); // Call the function to display suggestions  
    } catch (error) {  
        console.error("Fetch error:", error);  
    }  
}  

// Function to display the suggestions  
function displaySuggestions(data) {  
    suggestionsBox.innerHTML = ''; // Clear existing suggestions  
    suggestionsBox.style.display = 'block'; // Show suggestions box  

    data.forEach(item => {  
        const suggestionDiv = document.createElement('div');  
        suggestionDiv.classList.add('suggestion'); // Add 'suggestion' class  
        suggestionDiv.textContent = `${item.name}, ${item.region}, ${item.country}`; 
        // Add click event to each suggestion  
        suggestionDiv.addEventListener('click', function () {  
            input.value = item.name; // Set input value to suggestion  
            suggestionsBox.innerHTML = ''; // Clear suggestions  
            suggestionsBox.style.display = 'none'; // Hide suggestions  
        });  

        suggestionsBox.appendChild(suggestionDiv); // Append the suggestion div to the suggestions box  
    });  
}   
// Function to switch units
function switchUnits(newUnit) {
    
	if (newUnit !== unit) {
        unit = newUnit; // Update the unit
		
		// Remove 'active' class from both buttons  
        document.getElementById("metric").classList.remove("active");  
        document.getElementById("imperial").classList.remove("active");  

        // Add 'active' class to the selected button  
        document.getElementById(newUnit).classList.add("active");  
		
        if (lastSearchValue) {
            getWeatherByCoordinates(lastSearchValue); // Call the last API with the new unit
        } else   {
           console.log('testing');
		   lastApiCall();
        }
    }
}

// Example event listeners for unit switches  
document.getElementById("metric").addEventListener("click", () => switchUnits('metric'));  
document.getElementById("imperial").addEventListener("click", () => switchUnits('imperial'));  

function displayWeatherData(data) {  
     document.querySelector('.city').textContent = data.location.name;  
	 document.querySelector('.state').textContent = data.location.region;  
	 document.querySelector('.condition').textContent = data.current.condition.text;  
     document.querySelector('.weather-icon').src = `https:${data.current.condition.icon}`;  
     
	 const localtimeString = data.location.localtime;
	 const isoFormatString = localtimeString.replace(" ", "T");  // Converts the localtimeString to a format (ISO 8601) 
	 const date = new Date(isoFormatString);
	 console.log(date);
	 

/* if (day.hour) {https://cdn.weatherapi.com/weather/64x64/night/113.png
        day.hour.forEach(hourData => {
            console.log(`Time: ${hourData.time}, Temp: ${hourData.temp_c}°C / ${hourData.temp_f}°F`);
        });*/
  
	/* data.forecast.forecastday.hour.forEach(temp_c => {
      console.log(`Date: ${day.date}, Condition: ${day.day.condition.text}`);
     });*/
	 // Loop through each hour
    
	   
	  const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	  const monthNames = [  
		"Jan", "Feb", "March", "Apr", "May", "Jun",  
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"  
	  ];  
	  const dayOfTheWeek = weekDay[date.getDay()];
	  const month = monthNames[date.getMonth()];  
	  const day = date.getDate();  
	  let hour = date.getHours();  
	  const minute = date.getMinutes();  
	  const ampm = hour >= 12 ? 'PM' : 'AM';  
	  hour = hour % 12;  
	  hour = hour ? hour : 12;  
	  const formattedTime = dayOfTheWeek + ",  " + month + " " + day;  
	  const time = + hour + ":" + (minute < 10 ? '0' + minute : minute) + " " + ampm;
	  document.querySelector('.localtime').textContent = formattedTime;
	  document.querySelector('.time').textContent = time;
	
	 displayForecastData(data)
	  
    // Display temperature based on the current unit  
    if (unit === 'imperial') {  
        document.querySelector('.temp').textContent = Math.round(data.current.temp_f); // Display Fahrenheit  
		document.querySelector('.feelslike').textContent = 'Feels Like: ' + Math.round(data.current.feelslike_f) + ' °F';
		document.querySelector('.wind').textContent = 'Wind Speed: ' + Math.round(data.current.wind_mph) + ' mph'; // Round wind speed and add unit  
    } else {  
        document.querySelector('.temp').textContent = Math.round(data.current.temp_c); // Display Celsius  
		document.querySelector('.wind').textContent = 'Wind Speed: ' + Math.round(data.current.wind_kph) + ' kph'; // Round wind speed and add unit  
		document.querySelector('.feelslike').textContent = 'Feels Like: ' + Math.round(data.current.feelslike_c) + ' °C';;
    }   
     
    document.querySelector('.humidity').textContent = 'Humidity: ' + data.current.humidity + '%';    
    document.querySelector(".weather").style.display = "block";  
    document.querySelector(".error").style.display = "none";  
}  

function hideWeatherData() {  
    document.querySelector(".weather").style.display = "none";  
    document.querySelector(".error").style.display = "block";  
}


function displayForecastData(data) {  
    const forecastContainer = document.getElementById('forecastContainer');  
    forecastContainer.innerHTML = '';  

    data.forecast.forecastday.forEach((day, index) => {  
        const forecastDay = document.createElement('div');  
        forecastDay.classList.add('forecastDay');  
        forecastDay.dataset.index = index; // Store index for reference

        const dateString = day.date;
        const [year, month, dayOfMonth] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, dayOfMonth);

        const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfTheWeek = weekDay[date.getDay()];

        // Choose temperature unit
        const maxTemp = unit === 'imperial' ? day.day.maxtemp_f : day.day.maxtemp_c;
        const minTemp = unit === 'imperial' ? day.day.mintemp_f : day.day.mintemp_c;
        const tempUnit = unit === 'imperial' ? '°F' : '°C';

        const htmlString = `  
            <p>${dayOfTheWeek}</p>  
            <img src='https:${day.day.condition.icon}'/>  
            <p>  
                <span>${maxTemp}${tempUnit}</span>  
                <span>${minTemp}${tempUnit}</span>  
            </p>`;  

        forecastDay.innerHTML = htmlString;  
        forecastContainer.appendChild(forecastDay);  

        // Add click event to update current weather on click
        forecastDay.addEventListener('click', () => updateCurrentWeather(day));
    });  
}


function updateCurrentWeather(selectedDay) {
    document.querySelector('.condition').textContent = selectedDay.day.condition.text;  
    document.querySelector('.weather-icon').src = `https:${selectedDay.day.condition.icon}`;

    const dateString = selectedDay.date;
    const [year, month, dayOfMonth] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, dayOfMonth);

    const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formattedDate = `${weekDay[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
    document.querySelector('.localtime').textContent = formattedDate;

    if (unit === 'imperial') {  
        document.querySelector('.temp').textContent = Math.round(selectedDay.day.avgtemp_f);  
        document.querySelector('.feelslike').textContent = 'Feels Like: ' + Math.round(selectedDay.day.avgtemp_f) + ' °F';
        document.querySelector('.wind').textContent = 'Wind Speed: ' + Math.round(selectedDay.day.maxwind_mph) + ' mph';  
    } else {  
        document.querySelector('.temp').textContent = Math.round(selectedDay.day.avgtemp_c);  
        document.querySelector('.wind').textContent = 'Wind Speed: ' + Math.round(selectedDay.day.maxwind_kph) + ' kph';  
        document.querySelector('.feelslike').textContent = 'Feels Like: ' + Math.round(selectedDay.day.avgtemp_c) + ' °C';
    }   

    document.querySelector('.humidity').textContent = 'Humidity: ' + selectedDay.day.avghumidity + '%';    
}



// Function to fetch weather data  
async function fetchWeatherData(lat, lon) {  
    try {  
        let url;  
        if (lat && lon) {  
            url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no`;  
        } else {  
            url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=5&aqi=no`;  
        }  

        const response = await fetch(url);  

        if (!response.ok) {  
            throw new Error(`HTTP error! Status: ${response.status}`);  
        }  

        const data = await response.json();  
        displayWeatherData(data);  
        return data;  

    } catch (error) {  
        console.error('Error fetching weather data:', error);  
        return null;  
    }  
}  

async function getWeatherByGeoLocationOrIP() {  
    let lat, lon;  

    // Try to get the current position  
    try {  
        geoLocationResult = await new Promise((resolve, reject) => {  
            navigator.geolocation.getCurrentPosition(resolve, reject);  
        });  

        lat = geoLocationResult.coords.latitude;  
        lon = geoLocationResult.coords.longitude;  
        console.log(lat + ' ' + lon);  

        // Store the fetchWeatherData function in lastApiCall  
        lastApiCall = () => fetchWeatherData(lat, lon); // Store a function to call later  

    } catch (error) {  
        console.error('Error getting geo location:', error);  
        
        // If geolocation fails, we can store a fallback call for auto:ip  
        lastApiCall = () => fetchWeatherData(null, null); // Call without lat/lon (using auto:ip)  
    }  

    // Fetch weather data (whether from geo location or IP)  
    return await fetchWeatherData(lat, lon);  
}

getWeatherByGeoLocationOrIP();

