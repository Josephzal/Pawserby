const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Animal = require('./models/animal');
const ejsMate = require('ejs-mate');

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

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/animals', async(req, res) => {
    const animals = await Animal.find({});
    res.render('animals/index', {animals});
});

app.get('/animals/new', (req, res) => {
    res.render('animals/new')
});

app.post('/animals', async(req, res) => {
    const animal = new Animal(req.body.animal);
    await animal.save();
    res.redirect(`/animals/${animal._id}`);
});

app.get('/animals/:id', async(req, res) => {
    const animal = await Animal.findById(req.params.id);
    res.render('animals/show', {animal});
});

app.get('/animals/:id/edit', async(req, res) => {
    const animal = await Animal.findById(req.params.id);
    res.render('animals/edit', {animal});
});

app.put('/animals/:id', async(req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal});
    res.redirect(`/animals/${animal._id}`);
});

app.delete('/animals/:id', async(req, res) => {
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    res.redirect('/animals');
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});

