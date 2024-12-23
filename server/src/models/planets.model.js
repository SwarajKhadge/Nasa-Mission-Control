const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');

const planets = require('./planets.mongo');

const habitablePlanets = [];

function isHabitablePlanet(planet){

    return planet['koi_prad'] < 1.6 &&
    planet['koi_disposition'] == 'CONFIRMED' 
    && planet['koi_insol'] < 1.11 && planet['koi_insol'] > 0.36
}

function loadPlanetsData(){
    
    return new Promise((resolve, reject) => {
    
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
            comment : '#',
            columns: true,
        }))
        .on('data', (data) => {
            if(isHabitablePlanet(data)){
                savePlanetData(data);
            }
        })
        .on('error', (error) => {
            reject(error);
        })
        .on('end', async() => {
            const countPlanets = (await getAllPlanets()).length;
            console.log(`${countPlanets} planets are habitable!`);
            resolve();
        });    
    })
}

async function getAllPlanets(){

    return await planets.find({});
}

async function savePlanetData(planet){

    try{
        await planets.updateOne({
            keplerName: planet.kepler_name,
        },{
            keplerName: planet.kepler_name,
        },{
            upsert: true,
        })
    } catch(err){
        console.error(`Error : ${err}`);
    }
}

module.exports ={
    loadPlanetsData,
    getAllPlanets,
}