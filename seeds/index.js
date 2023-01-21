const mongoose = require('mongoose');
const cities = require('./cities');
const {species} = require('./seedHelpers');
const Animal = require('../models/animal');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/pawserby', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Animal.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const animal = new Animal({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/9039695',
            species: `${sample(species)}`
        })
        await animal.save();
    }
};

seedDB().then(() => {
    console.log('huh')
    mongoose.connection.close();
});