/******************************************************************************
 * IMPORTS
 *****************************************************************************/

import { API } from "./api";

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
        this.apiKeys = new API();
        let city = '4776024';
        fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${this.apiKeys.getWeatherKey()}`)
            .then(function(resp) {
                return resp.json();
            })
            .then(function(data) {
                console.log(data);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    initializeComponents() {
        this.renderHeader();


    }


    renderHeader() {
        const header = document.createElement('header');
        header.textContent = 'weather';
        this.container.appendChild(header);
    }
}