const data = (() => {
  async function getWeatherData(city) {
    const APIkey = '835500ad3429a2468aae2adf3df00704';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`
    );
    const weatherData = await response.json();
    return weatherData;
  }

  const parseData = async (city) => {
    const weatherData = await getWeatherData(city);
    const parsed = {
      city: weatherData.name,
      temp: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      weather: weatherData.weather[0].main,
      date: new Date(weatherData.dt * 1000),
    };
    console.log(parsed);
    return parsed;
  };
  return { getWeatherData, parseData };
})();

const form = (() => {
  const input = document.querySelector('input');
  const submit = document.querySelector('button');
  const addHandler = () => {
    submit.addEventListener('click', async () => {
      event.preventDefault();
      const city = input.value;
      await data.parseData(city);
    });
  };
  return { addHandler };
})();

form.addHandler();
