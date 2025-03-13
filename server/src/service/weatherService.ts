import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

class Weather {
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  city: string;

  constructor(
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    city: string,

  ) {
    this.date = date
    this.icon = icon
    this.iconDescription = iconDescription
    this.tempF = tempF
    this.windSpeed = windSpeed
    this.humidity = humidity
    this.city = city
  }
}
class WeatherService {
  private apiKey: string;
  private baseURL: string;
  constructor(){
    this.apiKey = process.env.API_KEY!;
    this.baseURL = process.env.API_BASE_URL!;
  }
  private async fetchLocationData(query: string): Promise<{lat:number,lon:number}> {
    const locationUrl = `${this.baseURL}/data/2.5/weather?q=${query}&appid=${this.apiKey}`;
    const response = await fetch(locationUrl);
    const data = await response.json();
    return {lat: data.coord.lat, lon: data.coord.lon};
  }

  private destructureLocationData(locationData: { lat: number, lon: number }): { lat: number, lon: number } {
    const{lat,lon} = locationData;
    return(lat,lon);
  }

  private buildGeocodeQuery(query:string): string {
    return `${this.baseURL}/data/2.5/weather?q=${query}&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: {lat:number, lon:number}): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData(query: string): Promise<{ lat: number, lon: number }> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates:{ lat: number, lon: number }): Promise<any> {
    const weatherUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return data;
  }

  private parseCurrentWeather(response: any):Weather {
    const temperature = response.main.temp;
    const humidity = response.main.humidity;
    const description = response.weather[0].description;
    const icon = response.weather[0].icon;
    const date = new Date().toLocaleDateString();

    return new Weather(date,icon,description,temperature,response.wind.speed, humidity, response.name);
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]):Weather[] {
    return weatherData.map((item:any)=>{
      const temperature = item.main.temp;
      const humidity = item.main.humidity;
      const description = item.weather[0].description;
      const icon = item.weather[0].icon;
      const date = new Date(item.dt * 1000).toLocaleDateString();
      return new Weather(date, icon, description, temperature, item.wind.speed, humidity, currentWeather.city);
    });
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city); 
    const weatherData = await this.fetchWeatherData(coordinates); 
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list);
    return forecast;
  }
}

export default new WeatherService();
