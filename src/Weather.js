
/******************************************************************************
 * IMPORTS
 *****************************************************************************/
import { API } from "./api";


/**
 * @class The weather class is responsible for getting weather data.
 * @author Chad Chapman
 */
export class Weather{
    constructor() {
        this.apiKeys = new API();
        let geoLocationInfo = this.getLocationInformation();
        this.city = this.getLocalityInfo(geoLocationInfo);
        this.countryName = this.getCountryInfo(geoLocationInfo);
        this.latitude = 0;
        this.longitude = 0;
        this.units = '';
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
    getCountryName() {
        return this.countryName;
    }

    /**
     * Getter function for the latitude.
     * @returns The latitude of the user or search query
     */
    getLatitude() {
        return this.latitude;
    }

    /**
     * Getter function for the longitude.
     * @returns The longitude of the user or search query
     */
    getLongitude() {
        return this.longitude;
    }

    /**
     * Retrieves locality information of user.
     * @param {String} geoLocationInfo JSON string that contains information 
     * about user's current location.
     * @returns The locality of where the user resides.
     */
    async getLocalityInfo(geoLocationInfo) {              
        try {
            const response = await fetch(geoLocationInfo);
            const data = await response.json();
            return data.locality + ", " + data.principalSubdivision;
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
     * Returns the detailed weather data of the user's location or search 
     * query.
     * @param {Number} latitude The latitude of user's location or search 
     * query.
     * @param {Number} longitude The longitued of user's location or search 
     * query.
     * @returns Detailed weather data. 
     */
    async getWeatherData(latitude, longitude) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKeys.getWeatherKey()}`);
            const weatherData = await response.json();
            return weatherData;
        } catch (error) {
            console.log(error);
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
        if (countryName.includes('United States of America')) {
            this.units = 'IMPERIAL'
        } else {
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