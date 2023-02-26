/**
 * @class Class for handlig API keys.
 * @author Chad Chapman
 */
export class API {
    /**
     * Default constructor.
     */
    constructor() {
        this.weatherKey = '37848b175665f0d44acbf1f3d3b01259';
    }

    /**
     * Getter function for open weather API key.
     * @returns The API key for open weather.
     */
    getWeatherKey() {
        return this.weatherKey;
    }
}