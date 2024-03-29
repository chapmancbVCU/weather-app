
/******************************************************************************
 * IMPORTS
 *****************************************************************************/
import { forOwn } from "lodash";
import { API } from "./API.js";


/**
 * @class The weather class is responsible for getting weather data.
 * @author Chad Chapman
 */
export class Weather{
    constructor() {
        this.apiKeys = new API();
        let geoLocationInfo = this.getLocationInformation();
        this.city = this.getLocalityInfo(geoLocationInfo);
        this.initCountryName = this.getCountryInfo(geoLocationInfo);
        this.initialUnits = '';
        this.JSONCityData = '';
        this.JSONDescriptiveWeatherData = '';
        this.latitude = 0;
        this.longitude = 0;
        this.units = '';
    }

    /**
     * Converts temperature to Celcius or Farenheit depending on which unit of 
     * measurement is selected.
     * @param {Number} temperature The temperate we want to convert from 
     * Kelvin. 
     * @returns The converted temperature in either Celcius or Farenheit.
     */
    convertTemperatureFromKelvin(temperature) {
        if (this.getUnits() === 'IMPERIAL') {
            return ((temperature - 273.15) * 9/5 + 32).toFixed(0);
        } else {
            return (temperature - 273.15).toFixed(0);
        }
    }

    /**
     * Returns the limited weather data using api call based on city name.
     * @param {String} city The locality whose weather we want to retrieve.
     * @returns The limited local weather data.
     */
    async getCityData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKeys.getWeatherKey()}`);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Get the name of city that is detected using geolocation based on 
     * localhost's location.
     * @returns The name of the city when using geolocation to detect location.
     */
    getCityInfo() {
        return this.city;
    }

    /**
     * The name of the country where the user resides.
     * @param {String} geoLocationInfo JSON string that contains information 
     * about user's current location.
     * @returns The country where the user resides.
     */
    async getCountryInfo(geoLocationInfo) {
        try {
            const response = await fetch(geoLocationInfo);
            const data = await response.json();
            return data.countryName;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Getter function for retrieving the users country.
     * @returns The nation where the user resides.
     */
    getInitCountryName() {
        return this.initCountryName;
    }

    /**
     * Getter function for initial unit system.  It can be either IMPERIAL or 
     * METRIC.
     * @returns The initial units that were set upon location detection when 
     * the user loads the page.
     */
    getInitialUnits() {
        return this.initialUnits;
    }

    /**
     * Getter function for returning city data as a JSON object.
     * @returns JSON object containing city data.
     */
    getJSONCityData() {
        return this.JSONCityData;
    }

    /**
     * Getter function for returning descriptive weather data as a JSON object.
     * @returns JSON object containing descriptive weather data.
     */
    getJSONDescriptiveWeatherData() {
        return this.JSONDescriptiveWeatherData;
    }

    /**
     * Getter function for the latitude.
     * @returns The latitude of the user or search query
     */
    getLatitude() {
        return this.latitude;
    }

    /**
     * Retrieves locality information of user upon initialization of page.
     * @param {String} geoLocationInfo JSON string that contains information 
     * about user's current location.
     * @returns The locality of where the user resides.
     */
    async getLocalityInfo(geoLocationInfo) {              
        try {
            const response = await fetch(geoLocationInfo);
            const data = await response.json();
            const country = data.countryName;
            if(country.includes('United States of America')) {
                return data.locality + ", " + data.principalSubdivision;
            } else {
                return data.city + ", " + data.countryName;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Detect location of localhost so we can get local weather on page load.
     * @returns The JSON representation of locality information.
     */
    getLocationInformation() {
        let _this = this;
        let bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";

        //check if geolocation is available
        if (navigator.geolocation) { 
            navigator.geolocation.getCurrentPosition(function(position) {
                _this.setLatitude(position.coords.latitude);
                _this.setLongitude(position.coords.longitude);
                bdcApi = bdcApi
                    + "?latitude=" + position.coords.latitude
                    + "&longitude=" + position.coords.longitude
                    + "&localityLanguage=en";         
            });   
        }
        return bdcApi;
    }

    /**
     * Getter function for the longitude.
     * @returns The longitude of the user or search query
     */
    getLongitude() {
        return this.longitude;
    }

    /**
     * Converts pressure in hectoPascals(hPa) to inches.
     * @param {Number} pressureInhPa in hectoPascals (hPa).
     * @returns The pressure represented in inches.
     */
    getPressure(pressureInhPa) {
        const PRESSURE_CONVERSION_CONSTANT = 0.0295;
        return (pressureInhPa * PRESSURE_CONVERSION_CONSTANT).toFixed(1);
    }

    getTemperature(temperature) {
        if (this.getInitialUnits() == 'IMPERIAL') {
            if(this.getUnits() == 'IMPERIAL') {
                return temperature.toFixed(0);
            } else {
                return ((temperature - 32) * (5/9)).toFixed(0);
            }   
        } else if (this.getInitialUnits() == 'METRIC') {
            if(this.getUnits() == 'IMPERIAL') {
                return ((temperature * 1.8) + 32).toFixed(0);
            } else {
                return temperature;
            }
        }
    }

    /**
     * Returns the detailed weather data of the user's location or search 
     * query.
     * @param {Number} latitude The latitude of user's location or search 
     * query.
     * @param {Number} longitude The longitued of user's location or search 
     * query.
     * @returns Detailed weather data. 
     */
    async getWeatherData(latitude, longitude) {
        let units = '';
        if(this.getUnits() === 'IMPERIAL') {
            units = 'imperial';
        } else {
            units = 'metric';
        }        
        try {
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=${units}&appid=${this.apiKeys.getWeatherKey()}`);
            const weatherData = await response.json();
            return weatherData;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Returns either N, NE, E, SE, S, SW, W, or NW depending on wind 
     * direction.
     * @param {Number} deg The direction of the winds. 
     * @returns A string value indicating general direction of the winds.
     */
    getWindDirection(deg) {
        if ((deg >= 337.6 && deg <= 359.9) || deg >= 0 && deg <= 22.5) {
            return 'S';
        } else if (deg >= 22.6 && deg <= 67.5) {
            return 'SW';
        } else if (deg >= 67.6 && deg <= 112.5) {
            return 'W';
        } else if (deg >= 112.6 && deg <= 157.5) {
            return 'NW';
        } else if (deg >= 157.6 && deg <= 202.5) {
            return 'N';
        } else if (deg >= 202.6 && deg <= 247.5) {
            return 'NE';
        } else if (deg >= 247.6 && deg <= 292.5) {
            return 'E';
        } else if (deg >= 292.6 && deg <= 337.5) {
            return 'SE';
        }
    }

    /**
     * Getter function that retrieves the units.  This value can be METRIC or 
     * IMPERIAL.
     * @returns The units name that the user as selected or detected based on 
     * the user's location.
     */
    getUnits() {
        return this.units;
    }

    /**
     * Converts visibility in meters to kilometers or miles depending on which 
     * units are selected.
     * @param {JSON} cityData string containing weather data for locality.
     * @returns Visibility represented as miles or kilometers depending on 
     * which units of measurement is selected.
     */
    getVisibility(visibility) {
        if (this.getUnits() === 'IMPERIAL') {
            return (visibility / 1609.344).toFixed(1) + ' miles';
        } else {
            return (visibility / 1000).toFixed(1) + ' km';
        }
    }

    /**
     * Returns wind as mph or km/h depending of location.
     * @param {Number} wind The wind speed expressed in meters per second. 
     * @returns The wind speed in mph or km/h.
     */
    getWindSpeed(wind) {
        if (this.getUnits() === 'IMPERIAL') {
            return (wind * 2.2369).toFixed(1) + ' mph';
        } else {
            return (wind * (18/5)).toFixed(1) + ' km/h'
        }
    }

    /**
     * Setter function for simple weather data in the form of a JSON object.
     * @param {JSON} cityData JSON object containing weather data. 
     */
    setJSONCityData(cityData) {
        this.JSONCityData = cityData;
    }

    /**
     * Setter function for descriptive weather data in the form of a JSON 
     * object.
     * @param {JSON} descriptiveWeatherData JSON object containing descriptive 
     * weather data.
     */
    setJSONDescriptiveWeatherData(descriptiveWeatherData) {
        this.JSONDescriptiveWeatherData = descriptiveWeatherData;
    }

    /**
     * Setter function for the latitude of the user's location or search query.
     * @param {Number} latitude The latitude of the user's location or search 
     * query.
     */
    setLatitude(latitude) {
        this.latitude = latitude;
    } 

    /**
     * Setter function for the longitude of the user's location or search 
     * query.
     * @param {Number} longitude The longitude of the user's location or search 
     * query.
     */
    setLongitude(longitude) {
        this.longitude = longitude;
    }

    /**
     * Sets the value of the units to be used based on user's location.
     * @param {String} countryName The name of the user's nation based on 
     * location detection.
     */
    setUnits(countryName) {
        if (countryName.includes('United States of America') ||
            countryName.includes('Myanmar') ||
            countryName.includes('Liberia')) {
            this.initialUnits = 'IMPERIAL';
            this.units = 'IMPERIAL'
        } else {
            this.initialUnits = 'METRIC';
            this.units = 'METRIC';
        }
    }

    /**
     * Toggles the this.units instance variable between IMPERIAL and METRIC.
     */
    toggleUnits() {
        if(this.units === 'IMPERIAL') {
            this.units = 'METRIC';
        } else {
            this.units = 'IMPERIAL';
        }
    }
}