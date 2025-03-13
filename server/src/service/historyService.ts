import * as fs from 'fs';
import * as path from 'path';
import {v4} from 'uuid';

//gets explicitly typed objects
interface City{
  name: string;
  id: string
}

class HistoryService {
  private filePath: string;
  
  constructor(){
    this.filePath = "db/db.json";
  }

  private async read(): Promise<City[]>{
    const data = await fs.promises.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  private async write(cities: City[]): Promise<void>{
    await fs.promises.writeFile(this.filePath, JSON.stringify(cities,null,2));
  }

  async getCities(): Promise<City[]>{
    return this.read();
  }

  async addCity(cityName: string): Promise<void>
{
  const cities =  await this.read();
  const cityExists = cities.some(
    (city) => city.name.toLowerCase()===cityName.toLowerCase()
  );
  if(cityExists) return;
  const newCity: City = {
    name: cityName,
    id: v4()
  };
  cities.push(newCity);
  await this.write(cities);
}

  async removeCity(cityId: string): Promise<void>{
    const cities = await this.read();
    const cityIndex = cities.findIndex((city)=> city.id === cityId);

    if(cityIndex === -1) return;

    cities.splice(cityIndex,1);
    await this.write(cities);
  }
}

export default new HistoryService();
