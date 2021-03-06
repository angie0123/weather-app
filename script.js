const data = (() => {
  let units = 'metric';
  const toggleUnits = () => {
    units = units === 'metric' ? 'imperial' : 'metric';
  };

  const getUnits = () => {
    return units;
  };

  async function getWeatherData(city, units) {
    const APIkey = '835500ad3429a2468aae2adf3df00704';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${APIkey}`
    );
    const weatherData = await response.json();
    return weatherData;
  }

  const parseData = async (city, units) => {
    const weatherData = await getWeatherData(city, units);
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

  return { getWeatherData, parseData, getUnits, toggleUnits };
})();

const inputs = (() => {
  const input = document.querySelector('input');
  const submit = document.querySelector('button');
  const addFormHandler = async () => {
    submit.addEventListener('click', async () => {
      event.preventDefault();
      const city = input.value;
      const units = data.getUnits();
      const result = await data.parseData(city, units);
      view.populateTodaySection(result);
    });
  };
  const addSwitchUnitHandler = async () => {
    const switchBtn = document.querySelector('.switch-btn');
    switchBtn.addEventListener('click', async () => {
      data.toggleUnits();
      const newUnit = data.getUnits();
      const city = document.querySelector('.city').textContent;
      const result = await data.parseData(city, newUnit);
      view.populateTodaySection(result);
    });
  };
  return { addFormHandler, addSwitchUnitHandler };
})();

const view = (() => {
  const initialRender = async (city, units) => {
    const result = await data.parseData(city, units);
    view.populateTodaySection(result);
  };
  const getImg = (description) => {
    switch (description) {
      case 'Clouds':
        return './images/cloudy.svg';
      case 'Clear':
        return './images/clear.svg';
      case 'Snow':
        return './images/snow.svg';
      case 'Rain':
        return './images/rain.svg';
      case 'Drizzle':
        return './images/rain.svg';
      case 'Thunderstorm':
        return './images/thunder.svg';
    }
  };

  const changeImgSrc = (element, url) => {
    document.querySelector(`.${element}`).setAttribute('src', url);
  };

  const populateTodaySection = (weatherData) => {
    const switchButton = document.querySelector('.switch-btn');
    switchButton.textContent = data.getUnits() === 'metric' ? '°F' : '°C';
    changeImgSrc('main-img', getImg(weatherData.description));

    for (property in weatherData) {
      if (property === 'tempLow') {
        changeTextContent('temp-low', weatherData[property]);
        continue;
      }
      if (property === 'tempHigh') {
        changeTextContent('temp-high', weatherData[property]);
        continue;
      }
      if (property === 'feelsLike') {
        changeTextContent('feels-like', weatherData[property]);
        continue;
      }
      changeTextContent(property, weatherData[property]);
    }
  };

  const changeTextContent = (element, content) => {
    document.querySelector(`.${element}`).textContent = content;
  };

  return {
    populateTodaySection,
    initialRender,
  };
})();

inputs.addFormHandler();
inputs.addSwitchUnitHandler();
view.initialRender('Toronto', data.getUnits());
