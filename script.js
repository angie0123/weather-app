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
      description: weatherData.weather[0].main,
      tempHigh: weatherData.main.temp_max,
      tempLow: weatherData.main.temp_min,
      sunset: parseHour(new Date(weatherData.sys.sunset * 1000)),
      sunrise: parseHour(new Date(weatherData.sys.sunrise * 1000)),
      date: new Date(weatherData.dt * 1000),
    };
    console.log(parsed);
    return parsed;
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
