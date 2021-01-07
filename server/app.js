const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const multer = require('multer')
const upload = multer({
    dest: 'uploads/'
});

//const predict = require('./predict');
const {constants, model} = require('./model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Please upload an image file of a single number, with a WHITE BACKGROUND');
});

app.post('/image', upload.single('file'), async (req, res) => {
    if (model.mode!==constants.TEST) {
        model.setMode(constants.TEST);
    }
    if (!req.file) {
        res.status(400).send("No file uploaded")
    }
    console.log("file name: " + req.file.filename);
    console.log("mimetype: " + req.file.mimetype);
    console.log("reverse color? " + req.body.rev)
    const {prediction, probability} = await model.predictFromImage(`./uploads/${req.file.filename}`, req.body.rev);
    console.log("result: " + result);
    res.json({prediction, probability});
});

app.post('/array', async(req, res) => {
    if (model.mode!==constants.TEST) {
        model.setMode(constants.TEST);
    }
    const array = req.body.array;
    const results = await model.predictFromArray(array);
    res.json(results);
})

app.post('/arraytrain', async(req, res) => {
    if (model.mode!==constants.TRAIN) {
        model.setMode(constants.TRAIN);
    }
    const array = req.body.array;
    const label = req.body.label;
    const results = await model.predictFromArray(array, label);
    res.json(results)
})

module.exports = app;