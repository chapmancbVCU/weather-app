/******************************************************************************
 * IMPORTS
 *****************************************************************************/
import { Weather } from "./Weather";

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
    }

    initializeComponents() {
        this.renderHeader();
        this.renderMainContent();
        /*document.addEventListener("DOMContentLoaded", async() => {
            let localityInfo = await this.weather.getCityInfo();
            console.log(localityInfo);
            let cityData = await this.weather.getCityData(localityInfo);
            console.log(cityData);
            let descriptiveWeatherData = await this.weather.getWeatherData(
                this.weather.getLatitude(), 
                this.weather.getLongitude());
            console.log(descriptiveWeatherData);
        });*/
        
    }

    /**
     * Removes weather content from DOM after a search for weather from 
     * another city.
     */
    removeMainContentFromDOM() {
        const mainContent = document.getElementById('main');
        mainContent.remove();
    }
    
    renderHeader() {
        const header = document.createElement('header');
        header.setAttribute('id', 'header');
        header.textContent = 'weather';
        this.container.appendChild(header);
    }

    renderMainContent() {
        const mainContent = document.createElement('main');
        mainContent.setAttribute('id', 'main');
        this.count++;
        mainContent.textContent = `${this.count}`;

        this.container.appendChild(mainContent);
    }
}