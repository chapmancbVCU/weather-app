/******************************************************************************
 * IMPORTS
 *****************************************************************************/
import { Weather } from "./Weather";
import WeatherIcon from "./icons/weather-cloudy-custom.png";
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
        document.addEventListener("DOMContentLoaded", async() => {
            // Get locality info on page load
            let localityInfo = await this.weather.getCityInfo();
            console.log(localityInfo);

            // Setup content of toggle units button
            let countryName = await this.weather.getCountryName();
            this.weather.setUnits(countryName);
            const toggle = document.querySelector('#toggle-button');
            toggle.textContent = `\xB0${this.setToggleButtonText(
                this.weather.getUnits())}`;
            
            // Get weather information.
            let cityData = await this.weather.getCityData(localityInfo);
            console.log(cityData);
            let descriptiveWeatherData = await this.weather.getWeatherData(
                this.weather.getLatitude(), 
                this.weather.getLongitude());
            console.log(descriptiveWeatherData);
            
        });
        
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
        header.classList.add('weather');
        
        header.appendChild(this.renderTitleLogoContainer());
        header.appendChild(this.renderSearchBar());
        header.appendChild(this.renderUnitsToggleButton());
        
        this.container.appendChild(header);
        this.submitButtonListener();
    }

    renderMainContent() {
        const mainContent = document.createElement('main');
        mainContent.setAttribute('id', 'main');

        this.container.appendChild(mainContent);
    }

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

    renderUnitsToggleButton() {
        const toggleButtonContainer = document.createElement('div');
        const toggleButton = document.createElement('button');
        toggleButton.setAttribute('id', 'toggle-button');
        toggleButton.classList.add('toggle-button');
        toggleButtonContainer.appendChild(toggleButton);
        return toggleButtonContainer;
    }

    setToggleButtonText(units) {
        return "IMPERIAL" ? "F"
            : "C";
    }

    submitButtonListener() {
        const searchBarForm = document.querySelector('#search-form');
        searchBarForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchQuery = document.getElementById('search').value;
            alert(searchQuery);
            document.forms[0].reset();
        });
    }
}