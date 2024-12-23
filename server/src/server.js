const http = require('http');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8000;

const {loadPlanetsData} = require('./models/planets.model');

const Mongo_pass = 'mpdmNi8cwdVuS9AZ';
const MONGO_URL = `mongodb+srv://nasa-api:${Mongo_pass}@nasacluster.amgrj.mongodb.net/?retryWrites=true&w=majority&appName=NasaCluster`


const app = require('./app');

const server = http.createServer(app);

async function startServer(){
    mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Server Listening at port ${PORT}...`);
    });
}

startServer();
mongoose.connection.on('open' ,() => {
    console.log('Mongo Database Connnected Successfully!');
});

mongoose.connection.once('error', (err) =>{

    console.error(`Connection Failed : ${err}`);
});