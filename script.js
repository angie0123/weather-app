const data = (() => {
  async function getWeatherData(city, units = 'metric') {
    const APIkey = '835500ad3429a2468aae2adf3df00704';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${APIkey}`
    );
    const weatherData = await response.json();
    return weatherData;
  }

  const parseData = async (city, units = 'metric') => {
    const weatherData = await getWeatherData(city);
    const parsed = {
      city: weatherData.name,
      temp: `${Math.round(weatherData.main.temp)}  ${
        units === 'metric' ? '°C' : '°F'
      }`,
      feelsLike: `Feels like ${Math.round(weatherData.main.feels_like)} ${
        units === 'metric' ? '°C' : '°F'
      }`,
      humidity: `${weatherData.main.humidity} %`,
      pressure: `${weatherData.main.pressure} mb`,
      description: weatherData.weather[0].main,
      tempHigh: `${Math.round(weatherData.main.temp_max)}  ${
        units === 'metric' ? '°C' : '°F'
      }`,
      tempLow: `${Math.round(weatherData.main.temp_min)}  ${
        units === 'metric' ? '°C' : '°F'
      }`,
      sunset: parseHour(new Date(weatherData.sys.sunset * 1000)),
      sunrise: parseHour(new Date(weatherData.sys.sunrise * 1000)),
      date: parseDate(new Date(weatherData.dt * 1000)),
    };
    console.log(parsed);
    return parsed;
  };

  const parseDate = (date) => {
    return date.toString().split(' ').slice(0, 3).join(' ');
  };

  const parseHour = (date) => {
    const time = date.toLocaleTimeString('en-US');
    const hour = time.split(' ')[0].slice(0, -3);
    const rest = time.split(' ')[1];
    const newTime = hour + ' ' + rest;
    return newTime;
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
      const result = await data.parseData(city);
      view.populateTodaySection(result);
    });
  };
  return { addHandler };
})();

const view = (() => {
  const populateTodaySection = (data) => {
    for (property in data) {
      if (property === 'tempLow') {
        changeTextContent('temp-low', data[property]);
        continue;
      }
      if (property === 'tempHigh') {
        changeTextContent('temp-high', data[property]);
        continue;
      }
      if (property === 'feelsLike') {
        changeTextContent('feels-like', data[property]);
        continue;
      }
      changeTextContent(property, data[property]);
    }
  };

  const changeTextContent = (element, content) => {
    document.querySelector(`.${element}`).textContent = content;
  };

  return { populateTodaySection };
})();

form.addHandler();
