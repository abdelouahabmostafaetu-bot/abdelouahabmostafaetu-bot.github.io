const apiKey = '028c03d45e069148e45a04ffd902d490';

async function currentWeatherData(city){
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try{
        const response = await fetch(currentWeatherUrl);
        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        return await response.json();
    }catch(error){
        console.error('Error fetching current weather data', error);
    }
}


async function forecastWeatherData(city){
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try{
        const response = await fetch(forecastWeatherUrl);
        if(!response.ok){
            throw new Error('Somthing went wrong');
        }
        return await response.json();
    }catch(error){
        console.error('Error fetching forecast weather data', error);
    }
}


function getWindDirection(degree){
    const directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
    let index = Math.round((degree / 45) % 8);
    if(index === 8)
        index = 0;
    return directions[index];
}


function setCurrentInfo(currentData){
    const cityName = document.getElementById('city-name');
    const temp = document.getElementById('temp');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const feelsLike = document.getElementById('feels-like');
    const pressure = document.getElementById('pressure');
    const windSpeed = document.getElementById('wind-speed');
    const windDegree = document.getElementById('wind-degree');
    cityName.innerHTML = currentData.name;
    temp.innerHTML = Math.round(currentData.main.temp) + '°';
    description.innerHTML = currentData.weather[0].description; 
    humidity.innerHTML = 'Humidity:  ' + currentData.main.humidity + ' %';
    feelsLike.innerHTML = 'Feels like:  ' + Math.round(currentData.main.feels_like) + '°';
    pressure.innerHTML = 'Pressure:  ' + (currentData.main.pressure) + ' mbar';
    windSpeed.innerHTML = 'Wind speed:  ' + ((currentData.wind.speed) * 3.6).toFixed(2) + ' Km/h';
    windDegree.innerHTML = 'Wind direction:  ' + getWindDirection(currentData.wind.deg) + ' (' + currentData.wind.deg + '°' + ')';
}


function setWeatherIcon(currentData){
    const icon = currentData.weather[0].icon;
    const img = document.getElementById('icon');
    const img_src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    img.src = img_src;
    img.style.display = 'block';
}



function formatTwoDigits(time){
    if(time <= 9){
        return '0' + time; 
    }
    return time;
}


function setTimeZone(currentData){
    const sunrise = document.getElementById('sunrise-time');
    const sunset = document.getElementById('sunset-time');
    let sunriseTime = currentData.sys.sunrise;
    let sunsetTime = currentData.sys.sunset;
    const timezoneOffset = currentData.timezone;
    sunriseTime += timezoneOffset;
    sunsetTime += timezoneOffset;
    sunriseTime = new Date(sunriseTime * 1000);
    sunsetTime = new Date(sunsetTime * 1000);
    const sunriseHour = sunriseTime.getUTCHours();
    const sunriseMinutes = sunriseTime.getUTCMinutes();
    const sunsetHour = sunsetTime.getUTCHours();
    const sunsetMinutes = sunsetTime.getUTCMinutes();
    sunrise.innerHTML = 'Sunrise: ' + `${formatTwoDigits(sunriseHour)}:${formatTwoDigits(sunriseMinutes)}`;
    sunset.innerHTML = 'Sunset: ' + `${formatTwoDigits(sunsetHour)}:${formatTwoDigits(sunsetMinutes)}`;
}


function formatForecastData(forecastData){
    let days = [[], [], [], [], [], []];
    let currday = new Date(forecastData.list[0].dt * 1000);
    let index = 0; 
    for(i = 1; i < forecastData.list.length; i++){
        let date = new Date(forecastData.list[i].dt * 1000);
        if(date.getUTCDate() === currday.getUTCDate()){
            days[index].push(forecastData.list[i]);
        }else{
            index++;
            days[index].push(forecastData.list[i]);
            currday = date;
        }
    }
    console.log(forecastData);
    console.log(days);
    return days;
}



function formatDay(date){
    let day;
    switch(date){
        case 0: day = 'Sunday'; break;
        case 1: day = 'Monday'; break;
        case 2: day = 'Tuesday'; break;
        case 3: day = 'Wednesday'; break;
        case 4: day = 'Thursday'; break;
        case 5: day = 'Friday'; break;
        case 6: day = 'Saturday'; break;
    }
    return day;
}   



function setForecastInfo(daysData){
    let days = [];
    days[0] = document.getElementById('day1');
    days[1] = document.getElementById('day2');
    days[2] = document.getElementById('day3');
    days[3] = document.getElementById('day4');
    days[4] = document.getElementById('day5');
    days[5] = document.getElementById('day6');
    for(i = 0; i < days.length; i++){
        if(!daysData[i][0]){
            continue;
        }
        const icon = daysData[i][0].weather[0].icon;
        const temp_data = daysData[i][0].main.temp;
        const date = new Date(daysData[i][0].dt * 1000).getUTCDay();
        const day_name = formatDay(date);

        const week_day = document.getElementById(`day${i + 1}`).querySelector('h2');
        const img = document.getElementById(`day${i + 1}`).querySelector('img');
        const temp = document.getElementById(`day${i + 1}`).querySelector('p');
        week_day.innerHTML = day_name;
        img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        temp.innerHTML = temp_data + '°';
    }
}



document.addEventListener('DOMContentLoaded', () =>{
    const btn = document.getElementById('sub-btn');
    btn.addEventListener('click', async () =>{
        city = document.getElementById('input-box').value;
        if(city){
            let currentData, forecastData;
            try{
                [currentData, forecastData] = await Promise.all([
                    currentWeatherData(city),
                    forecastWeatherData(city)
                ]);
            }catch(error){
                console.error('error fetching weather data', error);
            }
            setCurrentInfo(currentData);
            setTimeZone(currentData);
            setWeatherIcon(currentData);
            setForecastInfo(formatForecastData(forecastData));
            formatForecastData(forecastData);
        }
        else{
            console.error('input field is empty!');
        }
    });
});
    
    
