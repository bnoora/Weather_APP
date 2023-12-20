function DOM () {
    const container = document.getElementById("container")
    const content = document.createElement("section");
    let temp_selected = "c";
    content.id = "content";
    drawWeather(temp_selected);

    container.appendChild(content);
}

function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function getWeather () {
    try {
        console.log("Getting weather...");
        const position = await getLocation();
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        const currentResponse = await fetch(`https://api.weatherapi.com/v1/current.json?key=0608ec0a9e0f4d4c81c214951231912&q=${lat},${long}`);
        const forecastResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=0608ec0a9e0f4d4c81c214951231912&q=${lat},${long}&days=3`);

        const current = await currentResponse.json();
        const forecast = await forecastResponse.json();
        return { current, forecast };
    } catch (error) {
        console.error("Error getting weather:", error);
    }
}

async function drawWeather (temp_selected) {
    try {
        drawLoader();
        const data = await getWeather();
        if (data) {
            const { current, forecast } = data;
            const loader = document.querySelector(".loader");
            loader.remove();
            drawCurrentWeather(current, temp_selected);
            drawForecast(forecast, temp_selected);
        }
    } catch (error) {
        console.log(error);
    }
}

function drawCurrentWeather (current, temp_selected) {
    console.log("Drawing current weather...");
    const location = current.location.name;
    const region = current.location.region;
    const condition = current.current.condition.text;
    const baseIconUrl = "http:"
    const iconPath = current.current.condition.icon;
    const icon = baseIconUrl + iconPath;
    const humidity = current.current.humidity;
    const wind_kph = current.current.wind_kph;

    console.log(wind_kph);

    const content = document.getElementById("content");
    const currentWeather = document.createElement("section");
    currentWeather.classList.add("current-weather");
    const locationElement = document.createElement("h1");
    locationElement.classList.add("location");
    locationElement.textContent = `${location}, ${region}`;
    const tempElement = document.createElement("h2");
    if (temp_selected === "c") {
        const temp = current.current.temp_c;
        tempElement.textContent = `${temp}°C`;
    }
    else {
        const temp = current.current.temp_f;
        tempElement.textContent = `${temp}°F`;
    }
    const conditionSection = document.createElement("section");
    conditionSection.classList.add("condition");
    const conditionElement = document.createElement("h2");
    conditionElement.textContent = condition;
    const iconElement = document.createElement("img");
    iconElement.src = icon;
    iconElement.alt = condition;
    const humiditySection = document.createElement("section");
    humiditySection.classList.add("humidity");
    const humidityElement = document.createElement("h2");
    humidityElement.textContent = `Humidity: ${humidity}%`;
    humiditySection.appendChild(humidityElement);
    const windSection = document.createElement("section");
    windSection.classList.add("wind");
    const windElement = document.createElement("h2");
    windElement.textContent = `Wind: ${wind_kph} kph`;
    windSection.appendChild(windElement);

    currentWeather.appendChild(locationElement);
    currentWeather.appendChild(tempElement);
    conditionSection.appendChild(conditionElement);
    conditionSection.appendChild(iconElement);
    currentWeather.appendChild(conditionSection);
    currentWeather.appendChild(humiditySection);
    currentWeather.appendChild(windSection);

    content.appendChild(currentWeather);
}

function drawForecast (forecast, temp_selected) {
    console.log("Drawing forecast...");
    const location = forecast.location.name;
    const forecastDay = forecast.forecast.forecastday;
    const content = document.getElementById("content");
    const forecastElements = document.createElement("section");
    forecastElements.classList.add("forecast-elements");
    for (let day of forecastDay) {
        const forecastElement = document.createElement("section");
        forecastElement.classList.add("forecast-element");
        const forecasteDate = day.date;
        const locationDateElement = document.createElement("h1");
        locationDateElement.classList.add("location");
        locationDateElement.textContent = `${location}, ${forecasteDate}`;
        forecastElement.appendChild(locationDateElement);
        const forecastCondition = day.day.condition.text;
        const baseIconUrl = "http:"
        const forecastIconPath = day.day.condition.icon;
        const forecastIcon = baseIconUrl + forecastIconPath;
        const wind_kph = day.day.maxwind_kph;
        const humidity = day.day.avghumidity;

        const tempsSection = document.createElement("section");
        tempsSection.classList.add("temps");
        if (temp_selected === "c") {
            const forecastMaxTemp = day.day.maxtemp_c;
            const forecastMinTemp = day.day.mintemp_c;
            const forecastAvgTemp = day.day.avgtemp_c;

            const minMaxTempElement = document.createElement("div");
            minMaxTempElement.classList.add("min-max-temp");
            const minTempElement = document.createElement("h2");
            minTempElement.textContent = `Min: ${forecastMinTemp}°C`;
            const maxTempElement = document.createElement("h2");
            maxTempElement.textContent = `Max: ${forecastMaxTemp}°C`;
            minMaxTempElement.appendChild(minTempElement);
            minMaxTempElement.appendChild(maxTempElement);
            const avgTempElement = document.createElement("h2");
            avgTempElement.textContent = `Avg: ${forecastAvgTemp}°C`;
            tempsSection.appendChild(minMaxTempElement);
            tempsSection.appendChild(avgTempElement);
        }
        else {
            const forecastMaxTemp = day.day.maxtemp_f;
            const forecastMinTemp = day.day.mintemp_f;
            const forecastAvgTemp = day.day.avgtemp_f;

            const minMaxTempElement = document.createElement("div");
            minMaxTempElement.classList.add("min-max-temp");
            const minTempElement = document.createElement("h2");
            minTempElement.textContent = `Min: ${forecastMinTemp}°F`;
            const maxTempElement = document.createElement("h2");
            maxTempElement.textContent = `Max: ${forecastMaxTemp}°F`;
            minMaxTempElement.appendChild(minTempElement);
            minMaxTempElement.appendChild(maxTempElement);
            const avgTempElement = document.createElement("h2");
            avgTempElement.textContent = `Avg: ${forecastAvgTemp}°F`;
            tempsSection.appendChild(minMaxTempElement);
            tempsSection.appendChild(avgTempElement);
        }
        const conditionSection = document.createElement("section");
        conditionSection.classList.add("condition");
        const conditionElement = document.createElement("h2");
        conditionElement.textContent = forecastCondition;
        const iconElement = document.createElement("img");
        iconElement.src = forecastIcon;
        iconElement.alt = forecastCondition;
        conditionSection.appendChild(conditionElement);
        conditionSection.appendChild(iconElement);
        const humiditySection = document.createElement("section");
        humiditySection.classList.add("humidity");
        const humidityElement = document.createElement("h2");
        humidityElement.textContent = `Humidity: ${humidity}%`;
        humiditySection.appendChild(humidityElement);
        const windSection = document.createElement("section");
        windSection.classList.add("wind");
        const windElement = document.createElement("h2");
        windElement.textContent = `Wind: ${wind_kph} kph`;
        windSection.appendChild(windElement);

        forecastElement.appendChild(conditionSection);
        forecastElement.appendChild(humiditySection);
        forecastElement.appendChild(windSection);

        forecastElements.appendChild(forecastElement);
    }
    content.appendChild(forecastElements);
}

function drawLoader () {
    const container = document.getElementById("container");
    const loader = document.createElement("div");
    loader.classList.add("loader");

    const loadingCircle = document.createElement("img");
    loadingCircle.classList.add("loading-circle");
    loadingCircle.src = "images/loading-circle.svg";
    loadingCircle.alt = "Loading...";
    loader.appendChild(loadingCircle);

    container.appendChild(loader);
}


DOM();
