async function getWeatherData() {
  const response = await fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=835500ad3429a2468aae2adf3df00704'
  );
  console.log(response);
  const weatherData = await response.json();
  console.log(weatherData);
}

getWeatherData();
