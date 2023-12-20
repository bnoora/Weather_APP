class DOMDrawer {
    constructor() {
        this.weather_data = null;
    }

    DOM() {
        const container = document.getElementById("container")
        const content = document.createElement("section");
        container.appendChild(content);
        let temp_selected = "f";
        content.id = "content";
        content.classList.add("hidden");
        this.drawWeather(temp_selected).then(() => {
            container.appendChild(content);
            this.addFunctionality(temp_selected);
        }).catch(error => {
            console.error("Error in drawing weather:", error);
        });
    }
    
    getLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
    
    async getWeather () {
        try {
            console.log("Getting weather...");
            const position = await this.getLocation();
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
    
    async drawWeather (temp_selected) {
        try {
            // Check if weather data already exists and is less than 30 minutes old
            if (this.weather_data && this.weather_data.current.last_updated_epoch + 1800 !== Math.floor(Date.now() / 1000)) {
                console.log("Weather data already exists");
                const { current, forecast } = this.weather_data;
                this.drawHeader();
                this.drawCurrentWeather(current, temp_selected);
                this.drawForecast(forecast, temp_selected);
            }
            else {
                this.drawLoader();
                const data = await this.getWeather();
                if (data) {
                    this.weather_data = data;
                    const { current, forecast } = data;
                    const loader = document.querySelector(".loader");
                    loader.remove();
                    this.drawHeader();
                    this.drawCurrentWeather(current, temp_selected);
                    this.drawForecast(forecast, temp_selected);
                }
            }
        } catch (error) {
            console.error("Error drawing weather:", error);
        }
    }

    redrawWeather (temp_selected) {
        const currentWeather = document.querySelector(".current-weather");
        currentWeather.remove();
        const forecastElements = document.querySelector(".forecast-elements");
        forecastElements.remove();
        this.drawCurrentWeather(this.weather_data.current, temp_selected);
        this.drawForecast(this.weather_data.forecast, temp_selected);
    }
    
    drawCurrentWeather (current, temp_selected) {
        const location = current.location.name;
        const region = current.location.region;
        const condition = current.current.condition.text;
        const baseIconUrl = "http:"
        const iconPath = current.current.condition.icon;
        const icon = baseIconUrl + iconPath;
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

        if (content.classList.contains("hidden")) {
            content.classList.remove("hidden");
            content.classList.add("visible");
        }
    }
    
    drawForecast (forecast, temp_selected) {
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
            forecastElement.appendChild(tempsSection);

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
        if (content.classList.contains("hidden")) {
            content.classList.remove("hidden");
            content.classList.add("visible");
        }
    }
    
    drawLoader () {
        const container = document.getElementById("container");
        const loader = document.createElement("div");
        loader.classList.add("loader");
    
        const loadingCircle = document.createElement("img");
        loadingCircle.classList.add("loading-circle");
        loadingCircle.src = "rolling-1s-200px.gif";
        loadingCircle.alt = "Loading...";
        loader.appendChild(loadingCircle);
    
        container.appendChild(loader);
    }

    drawHeader () {
        const content = document.getElementById("content");
        const header = document.createElement("header");
        header.classList.add("header");

        const currentClickableSection = document.createElement("section");
        currentClickableSection.classList.add("current-clickable-section");
        const current = document.createElement("h2");
        current.textContent = "Current";
        currentClickableSection.appendChild(current);
        header.appendChild(currentClickableSection);

        const tempSection = document.createElement("section");
        tempSection.classList.add("temp-section");
        const celsius = document.createElement("h2");
        celsius.classList.add("celsius");
        celsius.textContent = "°C";
        const fahrenheit = document.createElement("h2");
        fahrenheit.classList.add("fahrenheit");
        fahrenheit.textContent = "°F";
        const tempLabel = document.createElement("label");
        tempLabel.classList.add("switch");
        const temp_switch = document.createElement("input");
        temp_switch.type = "checkbox";
        temp_switch.id = "temp-switch";
        temp_switch.classList.add("temp-switch");
        temp_switch.checked = true;
        const temp_slider = document.createElement("span");
        temp_slider.classList.add("slider");
        temp_slider.classList.add("round");
        tempLabel.appendChild(temp_switch);
        tempLabel.appendChild(temp_slider);
        tempSection.appendChild(celsius);
        tempSection.appendChild(tempLabel);
        tempSection.appendChild(fahrenheit);
        header.appendChild(tempSection);

        const forecastClickableSection = document.createElement("section");
        forecastClickableSection.classList.add("forecast-clickable-section");
        const forecast = document.createElement("h2");
        forecast.textContent = "Forecast";
        forecastClickableSection.appendChild(forecast);
        header.appendChild(forecastClickableSection);

        content.appendChild(header);
    }

    addFunctionality (temp_selected) {
        const temp_switch = document.getElementById("temp-switch");
        temp_switch.addEventListener("change", () => {
            if (temp_switch.checked) {
                temp_selected = "f";
            }
            else {
                temp_selected = "c";
            }
            this.redrawWeather(temp_selected);
        });

        const currentClickableSection = document.querySelector(".current-clickable-section");
        const forecastClickableSection = document.querySelector(".forecast-clickable-section");

        currentClickableSection.addEventListener("click", () => {
            const forecastElements = document.querySelector(".forecast-elements");
            forecastElements.classList.add("hidden");
            const currentWeather = document.querySelector(".current-weather");
            currentWeather.classList.remove("hidden");
        });

        forecastClickableSection.addEventListener("click", () => {
            const currentWeather = document.querySelector(".current-weather");
            currentWeather.classList.add("hidden");
            const forecastElements = document.querySelector(".forecast-elements");
            forecastElements.classList.remove("hidden");
        });

    }

}

drawer = new DOMDrawer();
drawer.DOM();
