/******************************************************************************
 * IMPORTS
 *****************************************************************************/
import { DateTimeUtility } from "./DateTimeUtility";
import DewPointIcon from "./icons/dew-point.png";
import FeelsLikeIcon from "./icons/temperature-feels-like.svg";
import HumidityIcon from "./icons/humidity.png";
import MoonRiseIcon from "./icons/moon-rise.png";
import MoonSetIcon from "./icons/moon-set.png";
import PrecipitationChanceIcon from "./icons/weather-pouring.png";
import SunRiseIcon from "./icons/sun-rise.png";
import SunSetIcon from "./icons/sun-set.png";
import { Weather } from "./Weather";
import WeatherIcon from "./icons/weather-cloudy-custom.png";
import WindIcon from "./icons/weather-windy.png";
import uviIcon from "./icons/UVI.png";
import VisibilityIncon from "./icons/visibility.png";


/**
 * @class Class that is responsible for rendering website components.
 * @author Chad Chapman
 */
export class Page {
    /**
     * Default Constructor
     */
    constructor() {
        this.container = document.querySelector('#content');
        this.dateTimeUtility = new DateTimeUtility();
        this.displayDailyForecast = 1;
        this.localityInfo = '';
        this.weather = new Weather();
    }

    /**
     * Sets and updates weather information in daily forecast section of page.
     * @param {JSON} descriptiveWeatherData JSON string containing descriptive 
     * weather data.
     */
    dailyForecastContent(descriptiveWeatherData) {
        const numberOfDays = 8;
        for (let i = 0; i < numberOfDays; i++) {
            if (i > 0) {
                const date = document.querySelector(`#day-${i}`);
                const dateTime = this.dateTimeUtility.getDateTime(
                    descriptiveWeatherData.daily[i].dt, 
                    descriptiveWeatherData.timezone_offset);
                date.textContent = `${this.dateTimeUtility.getForecastDate(
                    dateTime)}`;

                const highTemperature = document.querySelector(
                    `#high-temp-${i}`);
                highTemperature.textContent = 
                    `High: ${this.weather.getTemperature(
                    descriptiveWeatherData.daily[i].temp.max)} 
                    \xB0${this.setTemperatureUnitText(
                    this.weather.getUnits())}`;
                
                const lowTemperature = document.querySelector(
                    `#low-temp-${i}`);
                lowTemperature.textContent = 
                    `Low: ${this.weather.getTemperature(
                    descriptiveWeatherData.daily[i].temp.min)} 
                    \xB0${this.setTemperatureUnitText(
                    this.weather.getUnits())}`;

                const dailyDescription = document.querySelector(
                    `#daily-description-${i}`);
                dailyDescription.textContent = `${descriptiveWeatherData.
                    daily[i].weather[0].description}`;

                const dailyDescriptionIcon = document.querySelector(
                    `#daily-description-icon-${i}`);
                dailyDescriptionIcon.src = 
                    `https://openweathermap.org/img/wn/${descriptiveWeatherData.
                    daily[i].weather[0].icon}@2x.png`;

                const chanceOfRain = document.querySelector(
                    `#chance-of-rain-${i}`);
                chanceOfRain.textContent = 
                `${(descriptiveWeatherData.daily[i].pop * 100).toFixed(0)}%`;

                const winds = document.querySelector(
                    `#daily-wind-speed-${i}`);
                winds.textContent = 
                    `${this.weather.getWindSpeed(
                        descriptiveWeatherData.daily[i].wind_speed)}, 
                    ${this.weather.getWindDirection(
                        descriptiveWeatherData.daily[i].wind_deg)}`;

                const windGusts = document.querySelector(
                    `#daily-wind-gusts-${i}`);
                if (!isNaN(descriptiveWeatherData.daily[i].wind_gust)) {
                    windGusts.textContent = 
                        `${this.weather.getWindSpeed(
                        descriptiveWeatherData.daily[i].wind_gust)}`;
                } else {
                    windGusts.textContent = 
                        `${this.weather.getWindSpeed(0)}`;
                }

                const humidity = document.querySelector(
                    `#daily-humidity-${i}`);
                humidity.textContent = 
                    `${descriptiveWeatherData.daily[i].humidity}%`;

                const dewPoint = document.querySelector(
                    `#daily-dew-point-${i}`);
                dewPoint.textContent =
                    `${this.weather.getTemperature(
                    descriptiveWeatherData.daily[i].dew_point)} 
                    \xB0${this.setTemperatureUnitText(
                    this.weather.getUnits())}`;

                const uvIndex = document.querySelector(`#daily-uv-index-${i}`);
                uvIndex.textContent = `${(descriptiveWeatherData.daily[i].uvi).
                    toFixed(0)} out of 10`;

                const dailySunRise = document.querySelector(`#daily-sun-rise-${i}`);
                let sunRiseTime = this.dateTimeUtility.getDateTime(
                    descriptiveWeatherData.daily[i].sunrise, 
                    descriptiveWeatherData.timezone_offset);
                this.dateTimeUtility.getTimeInfo(sunRiseTime, dailySunRise);

                const dailySunSet = document.querySelector(`#daily-sun-set-${i}`);
                let sunSetTime = this.dateTimeUtility.getDateTime(
                    descriptiveWeatherData.daily[i].sunset, 
                    descriptiveWeatherData.timezone_offset);
                this.dateTimeUtility.getTimeInfo(sunSetTime, dailySunSet);

                const dailyMoonRise = document.querySelector(`#daily-moon-rise-${i}`);
                let moonRiseTime = this.dateTimeUtility.getDateTime(
                    descriptiveWeatherData.daily[i].moonrise, 
                    descriptiveWeatherData.timezone_offset);
                this.dateTimeUtility.getTimeInfo(moonRiseTime, dailyMoonRise);

                const dailyMoonSet = document.querySelector(`#daily-moon-set-${i}`);
                let moonSetTime = this.dateTimeUtility.getDateTime(
                    descriptiveWeatherData.daily[i].moonset, 
                    descriptiveWeatherData.timezone_offset);
                this.dateTimeUtility.getTimeInfo(moonSetTime, dailyMoonSet);
            }
        }
    }

    /**
     * This fuction contains event listener for button that hides and shows 
     * daily forecast.
     */
    hideShowDailyForecast() {
        const hideShowButton = document.querySelector(
            '#hide-show-daily-forecast');
        hideShowButton.addEventListener('click', () => {
            const dailyForecastContainer = document.querySelector(
                '#daily-forecast-container');

            /* Determine if daily forecast is shown or not and set 
            properties based on current state. */
            if (this.displayDailyForecast == 1) {
                dailyForecastContainer.style.display = 'flex';
                this.displayDailyForecast = 0;
            } else {
                dailyForecastContainer.style.display = 'none';
                this.displayDailyForecast = 1;
            }
        });
    }

    hourlyForecastContent(descriptiveWeatherData) {
        const numberOfHours = 48;
        for (let i = 0; i < numberOfHours; i++) {
            const date = document.querySelector(`#hourly-date-${i}`);
            const dateTime = this.dateTimeUtility.getDateTime(
                descriptiveWeatherData.hourly[i].dt, 
                descriptiveWeatherData.timezone_offset);
            date.textContent = `${this.dateTimeUtility.getForecastDate(
                dateTime)}`;

            const time = document.querySelector(`#hourly-time-${i}`);
            this.dateTimeUtility.getTimeInfo(dateTime, time);

            const temperature = document.querySelector(
                `#hourly-temperature-${i}`);
            temperature.textContent = `${this.weather.getTemperature(
                descriptiveWeatherData.hourly[i].temp)}
                \xB0${this.setTemperatureUnitText(this.weather.getUnits())}`;

            const hourlyDescription = document.querySelector(
                `#hourly-description-${i}`);
            hourlyDescription.textContent = `${descriptiveWeatherData.
                hourly[i].weather[0].description}`;

            const hourlyDescriptionIcon = document.querySelector(
                `#hourly-description-icon-${i}`);
            hourlyDescriptionIcon.src = 
                `https://openweathermap.org/img/wn/${descriptiveWeatherData.
                hourly[i].weather[0].icon}@2x.png`;
        }
    }

    /**
     * Initialize page components when user first visits page.
     */
    initializeComponents() {
        this.renderHeader();
        this.renderMainContent();
        this.hideShowDailyForecast();
        document.addEventListener("DOMContentLoaded", async() => {
            try {
                // Get locality info on page load
                this.localityInfo = await this.weather.getCityInfo();
                console.log(this.localityInfo);

                // Setup content of toggle units button
                let countryName = await this.weather.getInitCountryName();
                this.weather.setUnits(countryName);

                const toggle = document.querySelector('#toggle-button');
                toggle.textContent = `\xB0${this.setTemperatureUnitText(
                    this.weather.getUnits())}`;
                
                // Get weather information.
                let cityData = await this.weather.getCityData(
                    this.localityInfo);
                this.weather.setJSONCityData(cityData);
                console.log(cityData);
                let descriptiveWeatherData = 
                    await this.weather.getWeatherData(
                    this.weather.getLatitude(), 
                    this.weather.getLongitude());
                this.weather.setJSONDescriptiveWeatherData(
                    descriptiveWeatherData);
                console.log(descriptiveWeatherData);
                const mainContent = document.querySelector('#main');
                this.updateContent(cityData, descriptiveWeatherData);
                this.dailyForecastContent(descriptiveWeatherData);
                this.hourlyForecastContent(descriptiveWeatherData);
            } catch (error) {
                console.log(error);
            }
        });
    }

    /**
     * Renders today's barometric pressure readings.
     * @returns HTMLDivElement containing today's barometric pressure readings.
     */
    renderBarometricPressure() {
        const barometricPressureContainer = document.createElement('div');
        barometricPressureContainer.classList.add(
            'additional-information-item');

        const title = document.createElement('h3');
        title.textContent = 'Pressure';
        barometricPressureContainer.appendChild(title);

        const information = document.createElement('div');
        information.setAttribute('id', 'barometric-pressure');
        information.classList.add('additional-information-data');
        barometricPressureContainer.appendChild(information);
        return barometricPressureContainer;
    }

    /**
     * Renders the name of the city whose forecast we are viewing.
     * @returns HTMLHeadingElement that contains name of city. 
     */
    renderCityInfo() {
        const city = document.createElement('h2');
        city.setAttribute('id', 'city');
        city.classList.add('city-name');
        return city;
    }

    /**
     * Renders text and icon that describes the current conditions.
     * @returns HTMLDivElement that contains a text and icon reflecting 
     * current conditions.
     */
    renderCurrentConditionsDescription() {
        // Create parent container
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('description-container');

        const description = document.createElement('div');
        description.setAttribute('id', 'description');
        description.classList.add('current-conditions-description');
        descriptionContainer.appendChild(description);

        const descriptionIcon = new Image();
        descriptionIcon.setAttribute('id', 'description-icon');
        descriptionContainer.appendChild(descriptionIcon);
        return descriptionContainer;
    }

    /**
     * Renders conditions description and associated icon for 7 day forecast.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDiv element containing conditions for each day in the 
     * 7 day forecast.
     */
    renderDailyConditions(index) {
        // Create parent container
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('description-container');

        const description = document.createElement('div');
        description.setAttribute('id', `daily-description-${index}`);
        description.classList.add('current-conditions-description');
        descriptionContainer.appendChild(description);

        const descriptionIcon = new Image();
        descriptionIcon.setAttribute('id', `daily-description-icon-${index}`);
        descriptionContainer.appendChild(descriptionIcon);
        return descriptionContainer;
    }

    /**
     * The parent container for the 7 day forecast.
     * @returns HTMLDivElement The daily forecast section of the webpage.
     */
    renderDailyForecast() {
        const dailyForecastContainer = document.createElement('div');
        dailyForecastContainer.classList.add('daily-forecast-container');
        dailyForecastContainer.style.display = 'none';
        dailyForecastContainer.setAttribute('id', 'daily-forecast-container');

        const numberOfDays = 8
        for (let i = 0; i < numberOfDays; i++) {
            if (i > 0) {
                const dailyForecast = document.createElement('div');
                dailyForecast.classList.add('daily-forecast');

                // Setup date.
                dailyForecast.appendChild(this.renderDailyForecastDate(i));

                // Temperature details.
                const dailyTemperaturesContainer = 
                    document.createElement('div');
                dailyTemperaturesContainer.classList.add(
                    'daily-temperatures-container');
                dailyTemperaturesContainer.appendChild(
                    this.renderDailyForecastHighTemperature(i));
                dailyTemperaturesContainer.appendChild(
                    this.renderDailyForecastLowTemperature(i));
                dailyForecast.appendChild(dailyTemperaturesContainer);

                // Daily conditions.
                dailyForecast.appendChild(this.renderDailyConditions(i));
                dailyForecast.appendChild(this.renderDailyForecastDetails(i));
                dailyForecast.appendChild(
                    this.renderDailySunAndMoonInfo(i));
                dailyForecastContainer.appendChild(dailyForecast);
            }
        }
        return dailyForecastContainer;
    }

    /**
     * Renders day for heading section of each date in daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing date for daily forecast.
     */
    renderDailyForecastDate(index) {
        const date = document.createElement('h3');
        date.setAttribute('id', `day-${index}`);
        date.classList.add('date');
        
        return date;
    }

    /**
     * Renders information about conditions for each day of the 7 day forecast.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing details for each day of the 7 day 
     * forecast.
     */
    renderDailyForecastDetails(index) {
        // Setup parent container
        const dailyForecastDetailsContainer = document.createElement('div');
        dailyForecastDetailsContainer.classList.add('daily-forecast-details');

        // Setup left side content.
        const dailyForecastDetailsLeft = document.createElement('div');
        dailyForecastDetailsLeft.classList.add('daily-forecast-details-left');
        dailyForecastDetailsLeft.appendChild(
            this.renderDailyForecastPrecipitationChance(index));
        dailyForecastDetailsLeft.appendChild(
            this.renderDailyForecastHumidity(index));
        dailyForecastDetailsLeft.appendChild(
            this.renderDailyForecastDewPoint(index));
        dailyForecastDetailsContainer.appendChild(dailyForecastDetailsLeft);

        // Setup right side content
        const dailyForecastDetailsRight = document.createElement('div');
        dailyForecastDetailsRight.classList.add('daily-forecast-details-right');
        dailyForecastDetailsRight.appendChild(
            this.renderDailyForecastWindConditions(index));
        dailyForecastDetailsRight.appendChild(
            this.renderDailyForecastUVIndex(index));
        dailyForecastDetailsContainer.appendChild(dailyForecastDetailsRight);

        return dailyForecastDetailsContainer;
    }

    /** 
     * Renders the dew point for each in the daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing dew point information for the daily 
     * forecast.
     */
    renderDailyForecastDewPoint(index) {
        const dewPointContainer = document.createElement('div');
        dewPointContainer.classList.add('daily-conditions-info');

        const dewPointIcon = new Image();
        dewPointIcon.classList.add('conditions-icon');
        dewPointIcon.src = DewPointIcon;
        dewPointContainer.appendChild(dewPointIcon);

        const dewPointInfo = document.createElement('div');
        dewPointInfo.classList.add('current-conditions-info-description');
        dewPointInfo.textContent = 'Dew Point';

        const dewPoint = document.createElement('div');
        dewPoint.setAttribute('id', `daily-dew-point-${index}`);
        dewPointInfo.appendChild(dewPoint);

        dewPointContainer.appendChild(dewPointInfo);
        return dewPointContainer;
    }

    /**
     * Renders daily low temperatures for each day in daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing low temperature for daily forecast.
     */
    renderDailyForecastLowTemperature(index) {
        const dailyLow = document.createElement('div');
        dailyLow.setAttribute('id', `low-temp-${index}`);
        dailyLow.classList.add('daily-temperatures');
        return dailyLow;
    }

    /**
     * Renders daily high temperatures for each day in daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing high temperature for the daily 
     * forecast.
     */
    renderDailyForecastHighTemperature(index) {
        const dailyHigh = document.createElement('div')
        dailyHigh.setAttribute('id', `high-temp-${index}`);
        dailyHigh.classList.add('daily-temperatures');
        dailyHigh.classList.add('daily-high-temperature');
        return dailyHigh;
    }

    /** 
     * Renders the humidity for each in the daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing humidity information for the daily 
     * forecast.
     */
    renderDailyForecastHumidity(index) {
        const humidityContainer = document.createElement('div');
        humidityContainer.classList.add('daily-conditions-info');

        const humidityIcon = new Image();
        humidityIcon.classList.add('conditions-icon');
        humidityIcon.src = HumidityIcon;
        humidityContainer.appendChild(humidityIcon);

        const humidityInfo = document.createElement('div');
        humidityInfo.classList.add('current-conditions-info-description');
        humidityInfo.textContent = 'Humidity';

        const humidity = document.createElement('div');
        humidity.setAttribute('id', `daily-humidity-${index}`);
        humidityInfo.appendChild(humidity);

        humidityContainer.appendChild(humidityInfo);
        return humidityContainer;
    }

    /** 
     * Renders the chance of precipitation for each in the daily forecast 
     * section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing the chance of precipitation for the 
     * daily forecast.
     */
    renderDailyForecastPrecipitationChance(index) {
        const precipitaionChanceContainer = document.createElement('div');
        precipitaionChanceContainer.classList.add('daily-conditions-info');

        const precipitationChanceIcon = new Image();
        precipitationChanceIcon.classList.add('conditions-icon');
        precipitationChanceIcon.src = PrecipitationChanceIcon;
        precipitaionChanceContainer.appendChild(precipitationChanceIcon);

        const precipitaionChanceInfo = document.createElement('div');
        precipitaionChanceInfo.classList.add(
            'current-conditions-info-description');
        precipitaionChanceInfo.textContent = 'Chance of PPT';

        const precipitationChance = document.createElement('div');
        precipitationChance.setAttribute('id', `chance-of-rain-${index}`);
        precipitaionChanceInfo.appendChild(precipitationChance);

        precipitaionChanceContainer.appendChild(precipitaionChanceInfo);
        return precipitaionChanceContainer;
    }

    /**
     * Renders the wind conditions for each in the daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing the wind conditions for the daily 
     * forecast.
     */
    renderDailyForecastWindConditions(index) {
        const windConditionsContainer = document.createElement('div');
        windConditionsContainer.classList.add('daily-conditions-info');

        const windIcon = new Image();
        windIcon.classList.add('conditions-icon');
        windIcon.src = WindIcon;
        windConditionsContainer.appendChild(windIcon);

        const windInfo = document.createElement('div');
        windInfo.classList.add('current-conditions-info-description');
        windInfo.textContent = 'Winds';

        const currentWinds = document.createElement('div');
        currentWinds.setAttribute('id', `daily-wind-speed-${index}`);
        windInfo.appendChild(currentWinds);

        const windGustInfo = document.createElement('div');
        windGustInfo.textContent = 'Wind Gusts';
        windInfo.appendChild(windGustInfo);
        const windGusts = document.createElement('div');
        windGusts.setAttribute('id', `daily-wind-gusts-${index}`);
        windInfo.appendChild(windGusts);

        windConditionsContainer.appendChild(windInfo);
        return windConditionsContainer;
    }

    /** 
     * Renders the UV Index for each day in the daily forecast section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing UV Index information for the daily 
     * forecast.
     */
    renderDailyForecastUVIndex(index) {
        const uvIndexContainer = document.createElement('div');
        uvIndexContainer.classList.add('daily-conditions-info');

        const uvIndexIcon = new Image();
        uvIndexIcon.classList.add('conditions-icon');
        uvIndexIcon.src = uviIcon;
        uvIndexContainer.appendChild(uvIndexIcon);

        const uvIndexInfo = document.createElement('div');
        uvIndexInfo.classList.add('current-conditions-info-description');
        uvIndexInfo.textContent = 'UV Index';

        const uvIndex = document.createElement('div');
        uvIndex.setAttribute('id', `daily-uv-index-${index}`);
        uvIndexInfo.appendChild(uvIndex);

        uvIndexContainer.appendChild(uvIndexInfo);
        return uvIndexContainer;
    }

    /** 
     * Renders the moon rise information for each day in the daily forecast 
     * section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing moon rise information.
     */
    renderDailyMoonRise(index) {
        const moonRiseInfoContainer = document.createElement('div');
        moonRiseInfoContainer.classList.add('daily-conditions-info');

        const moonRiseIcon = new Image();
        moonRiseIcon.classList.add('conditions-icon');
        moonRiseIcon.src = MoonRiseIcon;
        moonRiseInfoContainer.appendChild(moonRiseIcon);

        const moonRiseInfo = document.createElement('div');
        moonRiseInfo.classList.add('current-conditions-info-description');
        moonRiseInfo.textContent = 'Moon Rise';

        const moonRise = document.createElement('div');
        moonRise.setAttribute('id', `daily-moon-rise-${index}`);
        moonRiseInfo.appendChild(moonRise);

        moonRiseInfoContainer.appendChild(moonRiseInfo);
        return moonRiseInfoContainer;
    }

    /** 
     * Renders the moon set information for each day in the daily forecast 
     * section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing moon set information.
     */
    renderDailyMoonSet(index) {
        const moonSetInfoContainer = document.createElement('div');
        moonSetInfoContainer.classList.add('daily-conditions-info');

        const moonSetIcon = new Image();
        moonSetIcon.classList.add('conditions-icon');
        moonSetIcon.src = MoonSetIcon;
        moonSetInfoContainer.appendChild(moonSetIcon);

        const moonSetInfo = document.createElement('div');
        moonSetInfo.classList.add('current-conditions-info-description');
        moonSetInfo.textContent = 'Moon Set';

        const moonSet = document.createElement('div');
        moonSet.setAttribute('id', `daily-moon-set-${index}`);
        moonSetInfo.appendChild(moonSet);

        moonSetInfoContainer.appendChild(moonSetInfo);
        return moonSetInfoContainer;
    }

    /**
     * Renders information about sun rise, sun set, moon rise, moon set for 
     * each day of the 7 day forecast.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing details for sun rise, sun set, moon 
     * rise, and moon set foreach day of the 7 day forecast.
     */
    renderDailySunAndMoonInfo(index) {
        // Setup parent container
        const sunAndMoonInfoContainer = document.createElement('div');
        sunAndMoonInfoContainer.classList.add('daily-forecast-details');

        // Setup left side content.
        const sunRiseSunSetInfo = document.createElement('div');
        sunRiseSunSetInfo.classList.add('daily-forecast-details-left');
        sunRiseSunSetInfo.appendChild(this.renderDailySunRise(index));
        sunRiseSunSetInfo.appendChild(this.renderDailySunSet(index));
        sunAndMoonInfoContainer.appendChild(sunRiseSunSetInfo);

        // Setup right side content.
        const moonRiseMoonSetInfo = document.createElement('div');
        moonRiseMoonSetInfo.classList.add('daily-forecast-details-right');
        moonRiseMoonSetInfo.appendChild(this.renderDailyMoonRise(index));
        moonRiseMoonSetInfo.appendChild(this.renderDailyMoonSet(index));
        sunAndMoonInfoContainer.appendChild(moonRiseMoonSetInfo);
        return sunAndMoonInfoContainer;
    }

    /** 
     * Renders the sun rise information for each day in the daily forecast 
     * section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing sun rise information.
     */
    renderDailySunRise(index) {
        const sunRiseInfoContainer = document.createElement('div');
        sunRiseInfoContainer.classList.add('daily-conditions-info');

        const sunRiseIcon = new Image();
        sunRiseIcon.classList.add('conditions-icon');
        sunRiseIcon.src = SunRiseIcon;
        sunRiseInfoContainer.appendChild(sunRiseIcon);

        const sunRiseInfo = document.createElement('div');
        sunRiseInfo.classList.add('current-conditions-info-description');
        sunRiseInfo.textContent = 'Sun Rise';

        const sunRise = document.createElement('div');
        sunRise.setAttribute('id', `daily-sun-rise-${index}`);
        sunRiseInfo.appendChild(sunRise);

        sunRiseInfoContainer.appendChild(sunRiseInfo);
        return sunRiseInfoContainer;
    }

    /** 
     * Renders the sun set information for each day in the daily forecast 
     * section.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing sun set information.
     */
    renderDailySunSet(index) {
        const sunSetInfoContainer = document.createElement('div');
        sunSetInfoContainer.classList.add('daily-conditions-info');

        const sunSetIcon = new Image();
        sunSetIcon.classList.add('conditions-icon');
        sunSetIcon.src = SunSetIcon;
        sunSetInfoContainer.appendChild(sunSetIcon);

        const sunSetInfo = document.createElement('div');
        sunSetInfo.classList.add('current-conditions-info-description');
        sunSetInfo.textContent = 'Sun Set';

        const sunSet = document.createElement('div');
        sunSet.setAttribute('id', `daily-sun-set-${index}`);
        sunSetInfo.appendChild(sunSet);

        sunSetInfoContainer.appendChild(sunSetInfo);
        return sunSetInfoContainer;
    }
    /**
     * Creates a HTMLDivElement that renders the current date in <DayOfWeek>, 
     * <Month> <DayOfMonth>, <Year> format.
     * @returns HTMLDivElement containing date.
     */
    renderDate() {
        const dateInfo = document.createElement('div');
        dateInfo.setAttribute('id', 'date-info');
        dateInfo.classList.add('current-date');
        
        return dateInfo;
    }

    /**
     * Renders a feels like icon and the feels like temperature.
     * @returns HTMLDivElement that describes feels like temperature.
     */
    renderFeelsLikeInfo() {
        const feelsLikeContainer = document.createElement('div');
        feelsLikeContainer.classList.add('current-conditions-info');
        
        const feelsLikeIcon = new Image();
        feelsLikeIcon.src = FeelsLikeIcon;
        feelsLikeContainer.appendChild(feelsLikeIcon);

        const feelsLikeInfo = document.createElement('div');
        feelsLikeInfo.classList.add('current-conditions-info-description');
        feelsLikeInfo.textContent = 'Feels Like';

        const feelsLikeTemperature = document.createElement('div');
        feelsLikeTemperature.setAttribute('id', 'feels-like-temperature');
        feelsLikeInfo.appendChild(feelsLikeTemperature);

        feelsLikeContainer.appendChild(feelsLikeInfo);
        return feelsLikeContainer;
    }

    /**
     * Renders header and its components.
     */
    renderHeader() {
        const header = document.createElement('header');
        header.setAttribute('id', 'header');
        header.classList.add('weather');
        
        header.appendChild(this.renderTitleLogoContainer());
        header.appendChild(this.renderSearchBar());
        header.appendChild(this.renderUnitsToggleButton());
        
        this.container.appendChild(header);
        this.submitButtonListener();
        this.toggleButtonListener();
    }

    /**
     * Renders information about today's high temperature.
     * @returns HTMLDivElement that displays today's high.
     */
    renderHighTemperature() {
        const highTemperature = document.createElement('div');
        highTemperature.setAttribute('id', 'today-high-temperature');
        highTemperature.classList.add('today-high-low-temperature');
        return highTemperature;
    }

    /**
     * The parent container for the hourly forecast.
     * @returns HTMLDivElement The hourly forecast section of the webpage.
     */
    renderHourlyForecast() {
        const hourlyContent = document.createElement('div');
        hourlyContent.classList.add('hourly-content');
        const hourlyForecastContainer = document.createElement('div');
        hourlyForecastContainer.classList.add('hourly-forecast-container');
        
        const hourlySectionLabel = document.createElement('h2');
        hourlySectionLabel.textContent = 'Hourly Forecast';
        hourlySectionLabel.classList.add('hourly-section-label');
        hourlyForecastContainer.appendChild(hourlySectionLabel);

        const numberOfHours = 48;
        for (let i = 0; i < numberOfHours; i++) {
            const hourlyForecast = document.createElement('div');
            hourlyForecast.classList.add('hourly-forecast');
            
            // Show date and time.
            hourlyForecast.appendChild(
                this.renderHourlyForecastTimestamp(i));

            // Conditions and temperature.
            hourlyForecast.appendChild(
                this.renderHourlyForecastConditionsAndTemperature(i));
            hourlyForecastContainer.appendChild(hourlyForecast);
        }

        hourlyContent.appendChild(hourlyForecastContainer);
        return hourlyContent;
    }

    renderHourlyForecastConditionsAndTemperature(index) {
        const conditionsAndTemperature = document.createElement('div');
        conditionsAndTemperature.classList.add(
            'hourly-conditions-and-temperature');

        const temperature = document.createElement('div');
        temperature.setAttribute('id', `hourly-temperature-${index}`);
        temperature.classList.add('hourly-temperature');
        conditionsAndTemperature.appendChild(temperature);

        // Create parent container for conditions desciption.
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('hourly-description-container');

        const description = document.createElement('div');
        description.setAttribute('id', `hourly-description-${index}`);
        description.classList.add('current-conditions-description');
        descriptionContainer.appendChild(description);

        const descriptionIcon = new Image();
        descriptionIcon.setAttribute('id', `hourly-description-icon-${index}`);
        descriptionContainer.appendChild(descriptionIcon);
        conditionsAndTemperature.appendChild(descriptionContainer);

        return conditionsAndTemperature;
    }

    /**
     * Renders date and time for hourly section of webpage.
     * @param {Number} index The index in array containing daily forecast 
     * information from descriptive weather data JSON object.
     * @returns HTMLDivElement containing date and time for the forecast.
     */
    renderHourlyForecastTimestamp(index) {
        const hourlyForecastTimestampContainer = document.createElement('div');
        hourlyForecastTimestampContainer.classList.add('hourly-date-time');

        const date = document.createElement('h3');
        date.setAttribute('id', `hourly-date-${index}`);
        hourlyForecastTimestampContainer.appendChild(date);

        const time = document.createElement('h3');
        time.setAttribute('id', `hourly-time-${index}`);
        hourlyForecastTimestampContainer.appendChild(time);

        return hourlyForecastTimestampContainer;
    }

    /**
     * Renders a humidity icon and the current humidity.
     * @returns HTMLDivElement that describes the current humidity.
     */
    renderHumidity() {
        const currentHumidityContainer = document.createElement('div');
        currentHumidityContainer.classList.add('current-conditions-info');

        const humidityIcon = new Image();
        humidityIcon.classList.add('conditions-icon');
        humidityIcon.src = HumidityIcon;
        currentHumidityContainer.appendChild(humidityIcon);

        const humidityInfo = document.createElement('div');
        humidityInfo.classList.add('current-conditions-info-description');
        humidityInfo.textContent = 'Humidity';

        const currentHumidity = document.createElement('div');
        currentHumidity.setAttribute('id', 'current-humidity');
        humidityInfo.appendChild(currentHumidity);

        currentHumidityContainer.appendChild(humidityInfo);
        return currentHumidityContainer;
    }

    /**
     * Renders information about today's low temperature.
     * @returns HTMLDivElement that displays today's low.
     */
    renderLowTemperature() {
        const lowTemperature = document.createElement('div');
        lowTemperature.setAttribute('id', 'today-low-temperature');
        lowTemperature.classList.add('today-high-low-temperature');
        return lowTemperature;
    }

    /**
     * Renders content for main section of page.
     */
    renderMainContent() {
        const mainContent = document.createElement('main');
        mainContent.setAttribute('id', 'main');
        mainContent.appendChild(this.renderCityInfo());

        // Parent container for weather info.
        const currentConditions = document.createElement('div');
        currentConditions.classList.add('current-conditions-container');

        // Current conditions left side        
        const currentConditionsLeft = document.createElement('div');
        currentConditionsLeft.classList.add(
            'current-conditions-left-container');
        currentConditionsLeft.appendChild(this.renderDate());
        currentConditionsLeft.appendChild(this.renderTime());
        currentConditionsLeft.appendChild(this.renderTemperatureInfo());
        currentConditionsLeft.appendChild(this.renderHighTemperature());
        currentConditionsLeft.appendChild(this.renderLowTemperature());
        currentConditionsLeft.appendChild(
            this.renderCurrentConditionsDescription());
        currentConditions.appendChild(currentConditionsLeft);

        // Current conditions right
        const currentConditionsRight = document.createElement('div');
        currentConditionsRight.classList.add(
            'current-conditions-right-container');
        currentConditionsRight.appendChild(this.renderFeelsLikeInfo());
        currentConditionsRight.appendChild(this.renderHumidity());
        currentConditionsRight.appendChild(this.renderPrecipitationChance());
        currentConditionsRight.appendChild(this.renderWindConditions());
        currentConditions.appendChild(currentConditionsRight);
        mainContent.appendChild(currentConditions);

        // Additional daily information.
        const additionalInformation = document.createElement('div');
        additionalInformation.classList.add('additional-information');
        additionalInformation.appendChild(this.renderSunRiseToday());
        additionalInformation.appendChild(this.renderSunSetToday());
        additionalInformation.appendChild(this.renderBarometricPressure());
        additionalInformation.appendChild(this.renderVisibility());
        mainContent.appendChild(additionalInformation);

        // Daily forecast
        const hideShowButton = document.createElement('button');
        hideShowButton.textContent = 'Show/Hide Daily';
        hideShowButton.classList.add('hide-show-button');
        hideShowButton.setAttribute('id', 'hide-show-daily-forecast');
        mainContent.appendChild(hideShowButton);
        mainContent.appendChild(this.renderDailyForecast());

        // Hourly forecast
        mainContent.appendChild(this.renderHourlyForecast());

        this.container.appendChild(mainContent);
    }

    /**
     * Renders a rain icon and the chance of precipitation.
     * @returns HTMLDivElement that describes the chances of precipitatin.
     */
    renderPrecipitationChance() {
        const precipitaionChanceContainer = document.createElement('div');
        precipitaionChanceContainer.classList.add('current-conditions-info');

        const precipitationChanceIcon = new Image();
        precipitationChanceIcon.classList.add('conditions-icon');
        precipitationChanceIcon.src = PrecipitationChanceIcon;
        precipitaionChanceContainer.appendChild(precipitationChanceIcon);

        const precipitaionChanceInfo = document.createElement('div');
        precipitaionChanceInfo.classList.add(
            'current-conditions-info-description');
        precipitaionChanceInfo.textContent = 'Chance of PPT';

        const precipitationChance = document.createElement('div');
        precipitationChance.setAttribute('id', 'chance-of-rain');
        precipitaionChanceInfo.appendChild(precipitationChance);

        precipitaionChanceContainer.appendChild(precipitaionChanceInfo);
        return precipitaionChanceContainer;
    }

    /**
     * Renders search form and submit button for submitting search for 
     * weather forecast.
     * @returns HTMLDivElement for search bar.
     */
    renderSearchBar() {
        // Setup parent container
        const searchBarContainer = document.createElement('div');
        searchBarContainer.classList.add('search-bar-container');

        // Setup form
        const searchBarForm = document.createElement('form');
        searchBarForm.setAttribute('id', 'search-form');
        searchBarForm.setAttribute('method', 'GET');
        searchBarForm.setAttribute('action', '#');

        // Setup search bar
        const searchBar = document.createElement('input');
        searchBar.setAttribute('id', 'search');
        searchBar.setAttribute('name', 'search');
        searchBar.setAttribute('required', '');
        searchBar.setAttribute('placeholder', 'Enter a city');
        searchBar.classList.add('search-bar');
        searchBarForm.appendChild(searchBar);

        const searchButton = document.createElement('button');
        searchButton.setAttribute('id', 'submit-search');
        searchButton.setAttribute('type', 'submit');
        searchButton.classList.add('submit-search');
        searchButton.textContent = 'Search';
        searchBarForm.appendChild(searchButton);

        searchBarContainer.appendChild(searchBarForm);
        return searchBarContainer;
    }
    
    /**
     * Renders information about today's sunrise.
     * @returns HTMLDivElement that contains information about today's sunrise.
     */
    renderSunRiseToday() {
        const sunRiseContainer = document.createElement('div');
        sunRiseContainer.classList.add('additional-information-item');

        const title = document.createElement('h3');
        title.textContent = 'Sunrise';
        sunRiseContainer.appendChild(title);

        const information = document.createElement('div');
        information.setAttribute('id', 'today-sunrise');
        information.classList.add('additional-information-data');
        sunRiseContainer.appendChild(information);
        return sunRiseContainer;
    }

    /**
     * Renders information about today's sunset.
     * @returns HTMLDivElement that contains information about today's sunset.
     */
    renderSunSetToday() {
        const sunSetContainer = document.createElement('div');
        sunSetContainer.classList.add('additional-information-item');

        const title = document.createElement('h3');
        title.textContent = 'Sunset';
        sunSetContainer.appendChild(title);

        const information = document.createElement('div');
        information.setAttribute('id', 'today-sunset');
        information.classList.add('additional-information-data');
        sunSetContainer.appendChild(information);
        return sunSetContainer;
    }

    /**
     * Renders the current temperature.
     * @returns HTMLDivElement that contains current temperature.
     */
    renderTemperatureInfo() {
        const temperature = document.createElement('div');
        temperature.setAttribute('id', 'temperature');
        temperature.classList.add('current-temperature');
        return temperature;
    }

    /**
     * Creates a HTMLDivElement that renders the current time.
     * @returns HTMLDivElement containing the durrent time.
     */
    renderTime() {
        const currentTime = document.createElement('div');
        currentTime.classList.add('current-time');
        currentTime.setAttribute('id', 'current-time');
        return currentTime;
    }

    /**
     * Renders the title and logo.
     * @returns HTMLDivElement that contains title and logo for this page.
     */
    renderTitleLogoContainer() {
        // Setup parent
        const titleLogoContainer = document.createElement('div');
        titleLogoContainer.classList.add('title-logo');
        
        // Setup page title
        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = 'My Weather';
        titleLogoContainer.appendChild(title);

        // Setup logo icon
        const logoIcon = new Image();
        logoIcon.classList.add('logo-icon');
        logoIcon.src = WeatherIcon;
        titleLogoContainer.appendChild(logoIcon);

        return titleLogoContainer;
    }

    /**
     * Renders the toggle units button.
     * @returns HTMDivElement for toggle button and its parent container.
     */
    renderUnitsToggleButton() {
        const toggleButtonContainer = document.createElement('div');
        const toggleButton = document.createElement('button');
        toggleButton.setAttribute('id', 'toggle-button');
        toggleButton.classList.add('toggle-button');
        toggleButtonContainer.appendChild(toggleButton);
        return toggleButtonContainer;
    }

    /**
     * Renders a wind icon and the current wind speeds.
     * @returns HTMLDivElement that describes current wind conditions.
     */
    renderWindConditions() {
        const windConditionsContainer = document.createElement('div');
        windConditionsContainer.classList.add('current-conditions-info');

        const windIcon = new Image();
        windIcon.classList.add('conditions-icon');
        windIcon.src = WindIcon;
        windConditionsContainer.appendChild(windIcon);

        const windInfo = document.createElement('div');
        windInfo.classList.add('current-conditions-info-description');
        windInfo.textContent = 'Winds';

        const currentWinds = document.createElement('div');
        currentWinds.setAttribute('id', 'current-wind-speed');
        windInfo.appendChild(currentWinds);

        const windGustInfo = document.createElement('div');
        windGustInfo.textContent = 'Wind Gusts';
        windInfo.appendChild(windGustInfo);
        const windGusts = document.createElement('div');
        windGusts.setAttribute('id', 'current-wind-gusts');
        windInfo.appendChild(windGusts);

        windConditionsContainer.appendChild(windInfo);
        return windConditionsContainer;
    }

    /**
     * Renders information about current visibility conditions.
     * @returns HTMLDivElement that describes current visibility conditions.
     */
    renderVisibility() {
        const visibilityContainer = document.createElement('div');
        visibilityContainer.classList.add('additional-information-item');

        const title = document.createElement('h3');
        title.textContent = 'Visibility';
        visibilityContainer.appendChild(title);

        const information = document.createElement('div');
        information.setAttribute('id', 'visibility');
        information.classList.add('additional-information-data');
        visibilityContainer.appendChild(information);
        return visibilityContainer;
    }

    /**
     * Sets to text for the toggle button based on selected units.
     */
    setTemperatureUnitText(units) {
        return units == 'IMPERIAL' ? "F"
            : "C";
    }

    /**
     * This function detects if a US state is abbreviated and updates search 
     * query to contain full state name.
     * @param {String} searchQuery The search query.
     * @returns The original string or an updated string where the 
     * abbreviation of a US state is converted to its full name.
     */
    stateAbbreviationMapping(searchQuery) {
        let states = [ ['Arizona', 'AZ'], ['Alabama', 'AL'], ['Alaska', 'AK'],
            ['Arkansas', 'AR'], ['California', 'CA'], ['Colorado', 'CO'],
            ['Connecticut', 'CT'], ['Delaware', 'DE'], ['Florida', 'FL'],
            ['Georgia', 'GA'], ['Hawaii', 'HI'], ['Idaho', 'ID'],
            ['Illinois', 'IL'], ['Indiana', 'IN'], ['Iowa', 'IA'],
            ['Kansas', 'KS'], ['Kentucky', 'KY'], ['Louisiana', 'LA'],
            ['Maine', 'ME'], ['Maryland', 'MD'], ['Massachusetts', 'MA'],
            ['Michigan', 'MI'], ['Minnesota', 'MN'], ['Mississippi', 'MS'],
            ['Missouri', 'MO'], ['Montana', 'MT'], ['Nebraska', 'NE'],
            ['Nevada', 'NV'], ['New Hampshire', 'NH'], ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'], ['New York', 'NY'], ['North Carolina', 'NC'],
            ['North Dakota', 'ND'], ['Ohio', 'OH'], ['Oklahoma', 'OK'],
            ['Oregon', 'OR'], ['Pennsylvania', 'PA'], ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'], ['South Dakota', 'SD'],
            ['Tennessee', 'TN'], ['Texas', 'TX'],  ['Utah', 'UT'],
            ['Vermont', 'VT'], ['Virginia', 'VA'], ['Washington', 'WA'],
            ['West Virginia', 'WV'], ['Wisconsin', 'WI'], ['Wyoming', 'WY']];
        
        for(let i = 0; i < states.length; i++) {
            if(searchQuery.includes(states[i][1])) {
                searchQuery = searchQuery.replace(states[i][1], states[i][0]);
            } 
        }
       return searchQuery;
    }

    /**
     * The event listener for the submit button.
     */
    submitButtonListener() {
        const searchBarForm = document.querySelector('#search-form');
        searchBarForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('--------------------------------------------------');
            
            let searchQuery = document.getElementById('search').value;
            if(searchQuery == '' || searchQuery == null) {
                searchQuery.setCustomValidity();
            } else {
                try {
                    /* If query has US State name abbreviated we detect and 
                    correct query before performing search. */
                    searchQuery = this.stateAbbreviationMapping(searchQuery);

                    // To display new location name at top of page.
                    this.localityInfo = searchQuery;

                    let cityData = await this.weather.getCityData(searchQuery);
                    this.weather.setJSONCityData(cityData);
                    console.log(cityData);  
                    let descriptiveWeatherData = await this.weather.getWeatherData(
                        cityData.coord.lat, cityData.coord.lon);
                    this.weather.setJSONDescriptiveWeatherData(descriptiveWeatherData);
                    console.log(descriptiveWeatherData);
                    this.updateContent(cityData, descriptiveWeatherData);
                    this.dailyForecastContent(descriptiveWeatherData);
                    this.hourlyForecastContent(descriptiveWeatherData);
                    document.forms[0].reset();
                } catch (error) {
                    console.log(error);
                }
            } 
        });
    }

    /**
     * The event listener for the toggle units button.
     */
    toggleButtonListener() {
        const toggleButton = document.querySelector('#toggle-button');
        toggleButton.addEventListener('click', (event) => {
            this.weather.toggleUnits();
            const toggle = document.querySelector('#toggle-button');

            this.updateContent(
                this.weather.getJSONCityData(), 
                this.weather.getJSONDescriptiveWeatherData());

            this.dailyForecastContent(
                this.weather.getJSONDescriptiveWeatherData());
            
            this.hourlyForecastContent(
                this.weather.getJSONDescriptiveWeatherData());
            
            toggle.textContent = `\xB0${this.setTemperatureUnitText(
                this.weather.getUnits())}`;
        });
    }

    /**
     * Sets and updates weather information in main content section of page.
     * @param {JSON} cityData JSON string containing weather data for locality.
     * @param {JSON} descriptiveWeatherData JSON string containing descriptive 
     * weather data.
     */
    updateContent(cityData, descriptiveWeatherData) {
        let localDateTime = this.dateTimeUtility.getDateTime(
            descriptiveWeatherData.current.dt, 
            descriptiveWeatherData.timezone_offset);
        const currentTime = document.querySelector('#current-time');
        this.dateTimeUtility.getDateInfo(localDateTime);
        this.dateTimeUtility.getTimeInfo(localDateTime, currentTime);
        const city = document.querySelector('#city');
        if (cityData.sys.country == 'US') {
            city.textContent = `Current conditions in ${this.localityInfo}`;
        } else {
            city.textContent = `Current conditions in ${cityData.name}, 
                ${cityData.sys.country}`;
        }
        
        const description = document.querySelector('#description');
        description.textContent = cityData.weather[0].description;

        const descriptionIcon = document.querySelector('#description-icon');
        descriptionIcon.src = 
            `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;

        const temperature = document.querySelector('#temperature');
        temperature.textContent = `${this.weather.getTemperature(
            descriptiveWeatherData.current.temp)} 
            \xB0${this.setTemperatureUnitText(this.weather.getUnits())}`;

        const todayHighTemperature = document.querySelector(
            '#today-high-temperature');
        todayHighTemperature.textContent = `Today's High: 
            ${this.weather.getTemperature(
            descriptiveWeatherData.daily[0].temp.max)} 
            \xB0${this.setTemperatureUnitText(
            this.weather.getUnits())}`;

        const todayLowTemperature = document.querySelector(
            '#today-low-temperature');
        todayLowTemperature.textContent = `Today's Low: 
            ${this.weather.getTemperature(
            descriptiveWeatherData.daily[0].temp.min)} 
            \xB0${this.setTemperatureUnitText(
            this.weather.getUnits())}`;

        const feelsLikeTemperature = document.querySelector(
            '#feels-like-temperature');
        feelsLikeTemperature.textContent = 
            `${this.weather.convertTemperatureFromKelvin(
            cityData.main.feels_like)} \xB0${this.setTemperatureUnitText(
            this.weather.getUnits())}`;

        const currentHumidity = document.querySelector('#current-humidity');
        currentHumidity.textContent = `${cityData.main.humidity}%`;

        const chanceOfRain = document.querySelector('#chance-of-rain');
        chanceOfRain.textContent = 
            `${(descriptiveWeatherData.daily[0].pop * 100).toFixed(0)}%`;

        const currentWinds = document.querySelector('#current-wind-speed');
        currentWinds.textContent = 
            `${this.weather.getWindSpeed(cityData.wind.speed)}, 
            ${this.weather.getWindDirection(cityData.wind.deg)}`;

        const currentWindGusts = document.querySelector('#current-wind-gusts');
        if (!isNaN(descriptiveWeatherData.current.wind_gust)) {
            currentWindGusts.textContent = `${this.weather.getWindSpeed(
                descriptiveWeatherData.current.wind_gust)}`;
        } else {
            currentWindGusts.textContent = `${this.weather.getWindSpeed(0)}`;
        }

        const todaySunRise = document.querySelector('#today-sunrise');
        let sunRiseTime = this.dateTimeUtility.getDateTime(
            descriptiveWeatherData.current.sunrise, 
            descriptiveWeatherData.timezone_offset);
        this.dateTimeUtility.getTimeInfo(sunRiseTime, todaySunRise);

        const todaySunSet = document.querySelector('#today-sunset');
        let sunSetTime = this.dateTimeUtility.getDateTime(
            descriptiveWeatherData.current.sunset, 
            descriptiveWeatherData.timezone_offset);
        this.dateTimeUtility.getTimeInfo(sunSetTime, todaySunSet);

        const barometricPressure = document.querySelector(
            '#barometric-pressure');
        barometricPressure.textContent = 
            `${this.weather.getPressure(cityData.main.pressure)} in`;

        const visibility = document.querySelector("#visibility");
        visibility.textContent = 
            `${this.weather.getVisibility(cityData.visibility)}`;
    }
}