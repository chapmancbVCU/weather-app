/******************************************************************************
 * IMPORTS
 *****************************************************************************/
import FeelsLikeIcon from "./icons/temperature-feels-like.svg";
import HumidityIcon from "./icons/humidity.png";
import PrecipitationChanceIcon from './icons/weather-pouring.png';
import { Weather } from "./Weather";
import WeatherIcon from "./icons/weather-cloudy-custom.png";
import WindIcon from "./icons/weather-windy.png";
import { slice } from "lodash";


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
        this.weather = new Weather();
        this.localityInfo = '';
    }

    /**
     * Converts temperature to Celcius or Farenheit depending on which unit of 
     * measurement is selected.
     * @param {Number} temperature The temperate we want to convert from 
     * Kelvin. 
     * @returns The converted temperature in either Celcius or Farenheit.
     */
    convertTemperatureFromKelvin(temperature) {
        if(this.weather.getUnits() === 'IMPERIAL') {
            return ((temperature - 273.15) * 9/5 + 32).toFixed(0);
        } else {
            return (temperature - 273.15).toFixed(0);
        }
    }

    /**
     * Determines time for locality we are getting weather forecast.
     * @param {JSON} descriptiveWeatherData JSON string containing descriptive 
     * weather data.
     * @returns A string containing local timestamp.
     */
    getDateTime(descriptiveWeatherData) {
        let dt = descriptiveWeatherData.current.dt;
        let timezone = descriptiveWeatherData.timezone_offset;
        const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
        const utc_milliseconds = utc_seconds * 1000;
        return new Date(utc_milliseconds).toUTCString();
    }

    /**
     * This function reports the local date.
     * @param {String} localDateTime The local timestamp.
     */
    getDateInfo(localDateTime) {
        console.log(localDateTime);

        let days = [['Sunday', 'Sun'], ['Monday', 'Mon'], ['Tuesday', 'Tue'],
            ['Wednesday', 'Wed'], ['Thursday', 'Thu'], ['Friday', 'Fri'],
            ['Saturday', 'Sat']];

        let dayOfWeek = localDateTime.slice(0, 3);
        for(let i = 0; i < days.length; i++) {
            if(dayOfWeek.includes(days[i][1])) {
                dayOfWeek = dayOfWeek.replace(days[i][1], days[i][0]);
            }
        }

        let dayOfMonth = localDateTime.slice(5, 7);
        if(dayOfMonth < 10) {
            dayOfMonth = dayOfMonth.slice(1, 2);
        }
        let date = new Date();

        let months = [['January', 'Jan'],
            ['February', 'Feb'],
            ['March', 'Mar'],
            ['April', 'Apr'],
            ['May', 'May'],
            ['June', 'Jun'],
            ['July', 'Jul'],
            ['August', 'Aug'],
            ['September', 'Sep'],
            ['October', 'Oct'],
            ['November', 'Nov'],
            ['December', 'Dec']];
        let monthName = localDateTime.slice(8, 11);
        for(let i = 0; i < months.length; i++) {
            if(monthName.includes(months[i][1])) {
                monthName = monthName.replace(months[i][1], months[i][0]);
            }
        }

        let year = localDateTime.slice(12, 16);

        const dateInfo = document.querySelector('#date-info');
        dateInfo.textContent = dayOfWeek + ', ' + monthName + ' ' + 
            dayOfMonth + ', ' + year;
    }

    /**
     * This function reports the local time.
     * @param {String} localDateTime The local timestamp.
     */
    getTimeInfo(localDateTime) {
        let hours = localDateTime.slice(17, 19);
        let minutes = localDateTime.slice(20, 22);

        if(minutes < 10) {
            minutes = minutes.slice(0, 1);
        }

        let timePeriod = '';
        if (hours >= 12) {
            timePeriod = 'PM';
        } else {
            timePeriod = 'AM';
        }
        
        // When hours is greater than 12
        if (hours > 12) {
            hours = hours - 12;
        }

        // Handle midnight
        if (hours == 0) {
            hours = 12;
        }

        // Get minutes and format it correctly if the value is less than 10.
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        const currentTime = document.querySelector('#current-time');
        currentTime.textContent = hours + ':' + minutes + ' ' + timePeriod;
    }

    /**
     * Returns either N, NE, E, SE, S, SW, W, or NW depending on wind 
     * direction.
     * @param {Number} deg The direction of the winds. 
     * @returns A string value indicating general direction of the winds.
     */
    getWindDirection(deg) {
        if ((deg >= 337.6 && deg <= 359.9) || deg >= 0 && deg <= 22.5) {
            return 'N';
        } else if (deg >= 22.6 && deg <= 67.5) {
            return 'NE';
        } else if (deg >= 67.6 && deg <= 112.5) {
            return 'E';
        } else if (deg >= 112.6 && deg <= 157.5) {
            return 'SE';
        } else if (deg >= 157.6 && deg <= 202.5) {
            return 'S';
        } else if (deg >= 202.6 && deg <= 247.5) {
            return 'SW';
        } else if (deg >= 247.6 && deg <= 292.5) {
            return 'W';
        } else if (deg >= 292.6 && deg <= 337.5) {
            return 'NW';
        }
    }

    /**
     * Returns wind as mph or km/h depending of location.
     * @param {Number} wind The wind speed expressed in meters per second. 
     * @returns The wind speed in mph or km/h.
     */
    getWindSpeed(wind) {
        if (this.weather.getUnits() === 'IMPERIAL') {
            return (wind * 2.2369).toFixed(1) + ' mph';
        } else {
            return (wind * (18/5)).toFixed(1) + ' km/h'
        }
    }

    /**
     * Initialize page components when user first visits page.
     */
    initializeComponents() {
        this.renderHeader();
        this.renderMainContent();
        document.addEventListener("DOMContentLoaded", async() => {
            // Get locality info on page load
            this.localityInfo = await this.weather.getCityInfo();
            console.log(this.localityInfo);

            // Setup content of toggle units button
            let countryName = await this.weather.getCountryName();
            this.weather.setUnits(countryName);
            const toggle = document.querySelector('#toggle-button');
            toggle.textContent = `\xB0${this.setToggleButtonText(
                this.weather.getUnits())}`;
            
            // Get weather information.
            let cityData = await this.weather.getCityData(this.localityInfo);
            this.weather.setJSONCityData(cityData);
            console.log(cityData);
            let descriptiveWeatherData = await this.weather.getWeatherData(
                this.weather.getLatitude(), 
                this.weather.getLongitude());
            this.weather.setJSONDescriptiveWeatherData(descriptiveWeatherData);
            console.log(descriptiveWeatherData);
            const mainContent = document.querySelector('#main');
            this.updateContent(cityData, descriptiveWeatherData);
        });
        
    }

    /**
     * Remove header from DOM.
     */
    removeHeaderFromDOM() {
        const header = document.getElementById('header');
        header.remove();
    }

    /**
     * Removes weather content from DOM after a search for weather from 
     * another city.
     */
    removeMainContentFromDOM() {
        const mainContent = document.getElementById('main');
        mainContent.remove();
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
        currentConditionsLeft.classList.add('current-conditions-left-container');
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
        currentConditionsRight.classList.add('current-conditions-right-container');
        currentConditionsRight.appendChild(this.renderFeelsLikeInfo());
        currentConditionsRight.appendChild(this.renderHumidity());
        currentConditionsRight.appendChild(this.renderPrecipitationChance());
        currentConditionsRight.appendChild(this.renderWindConditions());
        currentConditions.appendChild(currentConditionsRight);
        
        mainContent.appendChild(currentConditions);
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
        precipitaionChanceInfo.textContent = 'Chance of Rain';

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
     * This function detects if a US state is abbreviated and updates search 
     * query to contain full state name.
     * @param {String} searchQuery The search query.
     * @returns The original string or an updated string where the 
     * abbreviation of a US state is converted to its full name.
     */
    stateAbbreviationMapping(searchQuery) {
        let states = [
            ['Arizona', 'AZ'],
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['Arkansas', 'AR'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];
        
        for(let i = 0; i < states.length; i++) {
            if(searchQuery.includes(states[i][1])) {
                searchQuery = searchQuery.replace(states[i][1], states[i][0]);
            } 
        }
       return searchQuery;
    }

    /**
     * Sets to text for the toggle button based on selected units.
     */
    setToggleButtonText(units) {
        return units == 'IMPERIAL' ? "F"
            : "C";
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
                /* If query has US State name abbreviated we detect and 
                correct query before performing search. */
                searchQuery = this.stateAbbreviationMapping(searchQuery);

                // To display new location name at top of page.
                this.localityInfo = searchQuery;

                let cityData = await this.weather.getCityData(searchQuery);
                console.log(cityData);  
                let descriptiveWeatherData = await this.weather.getWeatherData(
                    cityData.coord.lat, cityData.coord.lon);
                console.log(descriptiveWeatherData);
                this.updateContent(cityData, descriptiveWeatherData);
                document.forms[0].reset();
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

            toggle.textContent = `\xB0${this.setToggleButtonText(
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
        let localDateTime = this.getDateTime(descriptiveWeatherData);
        this.getDateInfo(localDateTime);
        this.getTimeInfo(localDateTime);
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
        temperature.textContent = `${this.convertTemperatureFromKelvin(
            cityData.main.temp)} \xB0${this.setToggleButtonText(
            this.weather.getUnits())}`;

        const todayHighTemperature = document.querySelector(
            '#today-high-temperature');
        todayHighTemperature.textContent = `Today's High: 
            ${this.convertTemperatureFromKelvin(
            cityData.main.temp_max)} \xB0${this.setToggleButtonText(
            this.weather.getUnits())}`;

        const todayLowTemperature = document.querySelector(
            '#today-low-temperature');
        todayLowTemperature.textContent = `Today's Low: 
            ${this.convertTemperatureFromKelvin(
            cityData.main.temp_min)} \xB0${this.setToggleButtonText(
            this.weather.getUnits())}`;

        const feelsLikeTemperature = document.querySelector(
            '#feels-like-temperature');
        feelsLikeTemperature.textContent = 
            `${this.convertTemperatureFromKelvin(
            cityData.main.feels_like)} \xB0${this.setToggleButtonText(
            this.weather.getUnits())}`;

        const currentHumidity = document.querySelector('#current-humidity');
        currentHumidity.textContent = `${cityData.main.humidity}%`;

        const chanceOfRain = document.querySelector('#chance-of-rain');
        chanceOfRain.textContent = 
            `${(descriptiveWeatherData.daily[0].pop * 100).toFixed(0)}%`;

        const currentWinds = document.querySelector('#current-wind-speed');
        currentWinds.textContent = `${this.getWindSpeed(cityData.wind.speed)}, 
            ${this.getWindDirection(cityData.wind.deg)}`;

        const currentWindGusts = document.querySelector('#current-wind-gusts');
        if (!isNaN(descriptiveWeatherData.current.wind_gust)) {
            currentWindGusts.textContent = `${this.getWindSpeed(
                descriptiveWeatherData.current.wind_gust)}`;
        } else {
            currentWindGusts.textContent = `${this.getWindSpeed(0)}`;
        }
    }
}