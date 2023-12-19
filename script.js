function DOM () {
    const container = document.getElementById("container")
    const content = document.createElement("section");
    drawWeather();

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

async function drawWeather () {
    try {
        const data = await getWeather();
        if (data) {
            const { current, forecast } = data;
            console.log("curr:");
            console.log(current);
            console.log("forecast:");
            console.log(forecast);
            const temp_c = current.current.temp_c;
            const temp_f = current.current.temp_f;

        }
    } catch (error) {
        console.log(error);
    }
}


DOM();
