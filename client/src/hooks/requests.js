const baseUrl = 'http://localhost:8000';

async function httpGetPlanets() {
  const response = await fetch(`${baseUrl}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${baseUrl}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) =>{
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {

  try{
    return await fetch(`${baseUrl}/launches`, {
      method: "POST", 
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(launch),
    });  
  } catch(err){
      return {
        ok: false,
      }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
    try{
      return await fetch(`${baseUrl}/launches/${id}`,{
        method: "DELETE"
      });
    } catch(err){
      return {
        ok: false,
      }
    }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};