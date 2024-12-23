const launchesDB = require("./launches.mongo");

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber : 100,
    launchDate : new Date('November 29, 2008'),
    mission : 'Nasa Exoploration Exoplanet',
    rocket : 'Explorer IS1',
    target : 'Kepler-442 b',
    customer : ['ZTM', 'NASA'],
    upcoming : true,
    success : true, 
}

//launches.set(launch.flightNumber, launch);

async function saveLaunch(launch){

    await launchesDB.updateOne({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert: true,
    });
}

saveLaunch(launch);

async function existsWithLaunchId(launchId){

    return await launchesDB.findOne({
        flightNumber: launchId,
    });
}

async function getAllLaunches(){

    return await launchesDB.find({});    
}

async function getLatestFlightNumber(){

    const latestLaunch = await launchesDB.findOne().sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber; 
}

async function addNewLaunch(launch){

    const newLaunch = Object.assign(launch, {
        flightNumber: await getLatestFlightNumber() + 1,
        success: true,
        upcoming : true, 
        customer : ['ZTM', 'NASA'], 
    })
    await launchesDB.updateOne({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert: true
    });
}

async function abortLaunch(launchId){

    const aborted = await launchesDB.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });

    return aborted.acknowledged == true && aborted.modifiedCount == 1 && aborted.matchedCount == 1;
}

module.exports = {
    existsWithLaunchId,
    getAllLaunches,
    addNewLaunch,
    abortLaunch
};