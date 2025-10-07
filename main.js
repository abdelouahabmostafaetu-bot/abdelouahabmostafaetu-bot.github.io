const apiKey = '028c03d45e069148e45a04ffd902d490';

const selectors = {
    updatedTime: document.getElementById('updated-time'),
    currentTemp: document.getElementById('current-temp'),
    currentDescription: document.getElementById('current-description'),
    currentFeels: document.getElementById('current-feels'),
    currentRange: document.getElementById('current-range'),
    currentCity: document.getElementById('current-city'),
    currentCountry: document.getElementById('current-country'),
    currentIcon: document.getElementById('current-icon'),
    currentHumidity: document.getElementById('current-humidity'),
    currentPressure: document.getElementById('current-pressure'),
    currentWind: document.getElementById('current-wind'),
    currentWindDirection: document.getElementById('current-wind-direction'),
    currentVisibility: document.getElementById('current-visibility'),
    currentClouds: document.getElementById('current-clouds'),
    windDirectionLabel: document.getElementById('wind-direction-label'),
    windArrow: document.getElementById('wind-arrow'),
    sunrise: document.getElementById('sunrise-time'),
    sunset: document.getElementById('sunset-time'),
    suggestionButtons: document.querySelectorAll('.suggestion-btn'),
    inputBox: document.getElementById('input-box'),
    searchForm: document.getElementById('search-form'),
    forecastCards: Array.from(document.querySelectorAll('.forecast-card'))
};

const FALLBACK_ICON = 'https://openweathermap.org/img/wn/01d@2x.png';

function getWindDirection(degree) {
    if (typeof degree !== 'number') {
        return '--';
    }
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((degree % 360) / 45)) % 8;
    return directions[index];
}

function formatTimeWithOffset(unixSeconds, timezoneOffsetSeconds, options = {}) {
    if (!unixSeconds || typeof timezoneOffsetSeconds !== 'number') {
        return '--:--';
    }
    const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        ...options
    });
}

function formatUpdatedMessage(timezoneOffsetSeconds, dataTimestamp) {
    if (typeof timezoneOffsetSeconds !== 'number') {
        return 'Search for any city to begin.';
    }
    const nowUTC = Date.now() + new Date().getTimezoneOffset() * 60000;
    const reference = dataTimestamp ? dataTimestamp * 1000 : nowUTC;
    const localTime = new Date(reference + timezoneOffsetSeconds * 1000);
    const time = localTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const date = localTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    return `Updated • ${date} ${time}`;
}

function updateCurrentWeather(currentData) {
    const { main, weather, wind, sys, name, visibility, clouds, timezone, dt } = currentData;
    const weatherDescription = weather?.[0]?.description ?? 'Weather data';

    selectors.currentCity.textContent = name ?? 'Unknown location';
    selectors.currentCountry.textContent = sys?.country ?? '';
    selectors.currentTemp.textContent = main?.temp != null ? `${Math.round(main.temp)}°` : '--°';
    selectors.currentDescription.textContent = weatherDescription;
    selectors.currentFeels.textContent = main?.feels_like != null ? `${Math.round(main.feels_like)}°` : '--°';
    selectors.currentRange.textContent = main?.temp_min != null && main?.temp_max != null
        ? `High ${Math.round(main.temp_max)}° • Low ${Math.round(main.temp_min)}°`
        : 'High --° • Low --°';

    selectors.currentHumidity.textContent = main?.humidity != null ? `${main.humidity}%` : '--%';
    selectors.currentPressure.textContent = main?.pressure != null ? `${main.pressure} hPa` : '-- hPa';

    if (wind?.speed != null) {
        const kmh = (wind.speed * 3.6).toFixed(1);
        selectors.currentWind.textContent = `${kmh} km/h`;
    } else {
        selectors.currentWind.textContent = '-- km/h';
    }

    if (wind?.deg != null) {
        const direction = getWindDirection(wind.deg);
        selectors.currentWindDirection.textContent = `${direction} (${Math.round(wind.deg)}°)`;
        selectors.windDirectionLabel.textContent = direction;
        selectors.windArrow.style.transform = `rotate(${wind.deg}deg)`;
    } else {
        selectors.currentWindDirection.textContent = '--';
        selectors.windDirectionLabel.textContent = '--';
        selectors.windArrow.style.transform = 'rotate(0deg)';
    }

    selectors.currentVisibility.textContent = visibility != null ? `${(visibility / 1000).toFixed(1)} km` : '-- km';
    selectors.currentClouds.textContent = clouds?.all != null ? `${clouds.all}%` : '--%';

    const iconCode = weather?.[0]?.icon;
    if (iconCode) {
        selectors.currentIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        selectors.currentIcon.alt = weatherDescription;
    } else {
        selectors.currentIcon.src = FALLBACK_ICON;
        selectors.currentIcon.alt = 'Weather icon';
    }

    selectors.updatedTime.textContent = formatUpdatedMessage(timezone, dt);
}

function updateAstronomy(currentData) {
    const { sys, timezone } = currentData;
    selectors.sunrise.textContent = formatTimeWithOffset(sys?.sunrise, timezone);
    selectors.sunset.textContent = formatTimeWithOffset(sys?.sunset, timezone);
}

function summariseForecast(forecastData) {
    if (!forecastData?.list?.length) {
        return [];
    }
    const timezone = forecastData.city?.timezone ?? 0;
    const dayBuckets = new Map();

    forecastData.list.forEach(entry => {
        const localDate = new Date((entry.dt + timezone) * 1000);
        const key = localDate.toISOString().split('T')[0];
        if (!dayBuckets.has(key)) {
            dayBuckets.set(key, []);
        }
        dayBuckets.get(key).push({ entry, localDate });
    });

    const summaries = [];
    dayBuckets.forEach((entries, key) => {
        const representative = entries.reduce((closest, candidate) => {
            const candidateDistance = Math.abs(candidate.localDate.getUTCHours() - 12);
            const closestDistance = Math.abs(closest.localDate.getUTCHours() - 12);
            return candidateDistance < closestDistance ? candidate : closest;
        });

        const temps = entries.map(item => item.entry.main);
        const high = Math.max(...temps.map(t => t.temp_max));
        const low = Math.min(...temps.map(t => t.temp_min));

        summaries.push({
            key,
            localDate: representative.localDate,
            icon: representative.entry.weather?.[0]?.icon,
            description: representative.entry.weather?.[0]?.description ?? '',
            tempHigh: high,
            tempLow: low
        });
    });

    const todayKey = new Date((forecastData.list[0].dt + timezone) * 1000).toISOString().split('T')[0];
    const futureDays = summaries
        .filter(summary => summary.key !== todayKey)
        .sort((a, b) => new Date(a.key) - new Date(b.key));

    return futureDays.slice(0, 5);
}

function updateForecast(forecastData) {
    const timezone = forecastData?.city?.timezone ?? 0;
    const dailySummaries = summariseForecast(forecastData);

    selectors.forecastCards.forEach((card, index) => {
        const dayEl = card.querySelector('.day');
        const iconEl = card.querySelector('.icon');
        const tempEl = card.querySelector('.temp');
        const detailEl = card.querySelector('.detail');
        const summary = dailySummaries[index];

        if (!summary) {
            dayEl.textContent = '--';
            iconEl.src = '';
            iconEl.alt = '';
            tempEl.textContent = '--°';
            detailEl.textContent = '---';
            return;
        }

        dayEl.textContent = summary.localDate.toLocaleDateString(undefined, { weekday: 'short' });
        iconEl.src = summary.icon
            ? `https://openweathermap.org/img/wn/${summary.icon}@2x.png`
            : FALLBACK_ICON;
        iconEl.alt = summary.description;
        tempEl.textContent = `${Math.round(summary.tempHigh)}° / ${Math.round(summary.tempLow)}°`;
        detailEl.textContent = summary.description;
    });
}

async function fetchCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch current weather');
    }
    return response.json();
}

async function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch forecast');
    }
    return response.json();
}

function clearForecastPlaceholders() {
    selectors.forecastCards.forEach(card => {
        card.querySelector('.day').textContent = '--';
        card.querySelector('.icon').src = '';
        card.querySelector('.icon').alt = '';
        card.querySelector('.temp').textContent = '--°';
        card.querySelector('.detail').textContent = '---';
    });
}

async function handleWeatherLookup(city) {
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    selectors.updatedTime.textContent = 'Fetching latest conditions…';

    try {
        const [currentData, forecastData] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)
        ]);

        updateCurrentWeather(currentData);
        updateAstronomy(currentData);
        updateForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather', error);
        selectors.updatedTime.textContent = 'Unable to find that city. Try another search.';
        alert('City not found! Please enter a valid city name.');
        clearForecastPlaceholders();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    selectors.searchForm.addEventListener('submit', event => {
        event.preventDefault();
        handleWeatherLookup(selectors.inputBox.value.trim());
    });

    selectors.suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectors.inputBox.value = button.dataset.city;
            handleWeatherLookup(button.dataset.city);
        });
    });

    selectors.inputBox.focus();
});
