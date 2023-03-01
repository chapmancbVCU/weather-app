
import { API } from "./api";
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

    async getCountryInfo(geoLocationInfo) {
        try {
            const response = await fetch(geoLocationInfo);
            const data = await response.json();
            return data.countryName;
        } catch (error) {
            console.log(error);
        }
    }

    getCountryName() {
        return this.countryName;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

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

    async getWeatherData(latitude, longitude) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKeys.getWeatherKey()}`);
            const weatherData = await response.json();
            return weatherData;
        } catch (error) {
            console.log(error);
        }
    }

    getUnits() {
        return this.units;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    } 

    setLongitude(longitude) {
        this.longitude = longitude;
    }

    setUnits(countryName) {
        if (countryName.includes('United States of America')) {
            this.units = 'IMPERIAL'
        } else {
            this.units = 'METRIC';
        }
    }
}