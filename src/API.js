/**
 * @class Class for handlig API keys.
 * @author Chad Chapman
 */
export class API {
    constructor() {
        this.weatherKey = '37848b175665f0d44acbf1f3d3b01259';
    }

    getWeatherKey() {
        return this.weatherKey;
    }
}