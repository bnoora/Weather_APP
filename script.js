function DOM () {
    const container = document.getElementById("container")
    const content = document.createElement("section");
    let temp_selected = "c";
    content.classList.add("content");
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
        const data = await getWeather();
        if (data) {
            const { current, forecast } = data;
            console.log("curr:");
            console.log(current);
            console.log("forecast:");
            console.log(forecast);
            drawCurrentWeather(current, temp_selected);
        }
    } catch (error) {
        console.log(error);
    }
}

function drawCurrentWeather (current, temp_selected) {
    const location = current.location.name;
    const region = current.location.region;
    const condition = current.current.condition.text;
    const icon = current.current.condition.icon;
    const humidity = current.current.humidity;
    const wind_kph = current.current.wind_kph;

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
    const windSection = document.createElement("section");
    windSection.classList.add("wind");
    const windElement = document.createElement("h2");
    windElement.textContent = `Wind: ${wind_kph} kph`;

    content.appendChild(currentWeather);
}

function drawForecast (forecast, temp_selected) {
    const location = current.location.name;
    const region = current.location.region;
    const forecastDay = forecast.forecast.forecastday;
    const content = document.getElementById("content");
    const forecastElements = document.createElement("section");
    forecastElements.classList.add("forecast-elements");
    for (let day of forecastDay) {
        const forecasteDate = day.date;
        const forecastCondition = day.day.condition.text;
        const forecastIcon = day.day.condition.icon;
        if (temp_selected === "c") {
            const forecastMaxTemp = day.day.maxtemp_c;
            const forecastMinTemp = day.day.mintemp_c;
            const forecastAvgTemp = day.day.avgtemp_c;

        }
        else {
            const forecastMaxTemp = day.day.maxtemp_f;
            const forecastMinTemp = day.day.mintemp_f;
            const forecastAvgTemp = day.day.avgtemp_f;
        }
    }


}


DOM();
