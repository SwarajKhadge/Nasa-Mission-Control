const {getAllLaunches, addNewLaunch,existsWithLaunchId,abortLaunch} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res){

    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res){ 

    const launch = req.body;

    if(!launch.launchDate ||!launch.target ||!launch.rocket ||!launch.mission){
        return res.status(400).json({
            error : "Missing Values"
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){

        return res.status(400).json({
            error: "Invalid Date",
        });
    }

    await addNewLaunch(launch);

    return res.status(201).json(launch);

}

async function httpAbortLaunch(req, res){

    const launchId = Number(req.params.id);

    const existsLaunch = await existsWithLaunchId(launchId);
    if(!existsLaunch){
        return res.status(404).json({
            error: "Launch Not Found",
        });
    }
    const abortedLaunch = await abortLaunch(launchId);

    if(!abortedLaunch){
        return res.status(400).json({
            error: "Launch Not Aborted",
        });
    } else{
        return res.status(200).json({
            ok : true,
        });
    }
}
module.exports = {httpGetAllLaunches, httpAddNewLaunch,httpAbortLaunch};