async function getWeatherData() {
  const response = await fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=835500ad3429a2468aae2adf3df00704'
  );
  const weatherData = await response.json();
  return weatherData;
}

const parseData = async () => {
  const weatherData = await getWeatherData();
  const parsed = {
    city: weatherData.name,
    temp: weatherData.main.temp,
    feelsLike: weatherData.main.feels_like,
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    weather: weatherData.weather.main,
  };
  return parsed;
};

parseData();
