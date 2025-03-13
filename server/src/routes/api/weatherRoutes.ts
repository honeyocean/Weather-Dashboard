import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history

  const {city} = req.body;
  
  if(!city){
    return res.status(400).json({error: 'Give a city name'});
  }
  try{
    const weatherData = await WeatherService.getWeatherForCity(city);

    await HistoryService.addCity(city);

    return res.status(200).json({weatherData})
  }catch(err){
    return res.status(500).json({error: 'Failed to get data'})
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try{
    const history = await HistoryService.getHistory();
    return res.status(200).json({history});
  }catch(err){
    return res.status(500).json({error: 'Failed to get data'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const {id} = req.params;
  
  if(!id){
    return res.status(400).json({error: 'Give a City ID'});
  }

  try{
    await HistoryService.removeCity(id);
    return res.status(200).json({message: 'City removed'});
  }catch(err){
    return res.status(500).json({error: 'Failed to delete'});
  }
});

export default router;
