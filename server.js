var express = require('express');
const PORT = process.env.PORT || 3000;
var app = express();
var fs = require('fs');
var path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/favorites', function(req, res) {
    var data = fs.readFileSync('./data.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});

app.post('/favorites', function(req, res) {
    if (!req.body.title || !req.body.id) {
        res.json({ message: 'Error: favorite must include a name and id.' });
        // return;
    }

    var data = JSON.parse(fs.readFileSync('./data.json'));
    data[req.body.id] = req.body;
    fs.writeFileSync('./data.json', JSON.stringify(data));
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});

// Catch any non-defined routes
app.use((req, res) => {
    res.status(404).json({ message: res.message || 'Not Found' });
});

// Some error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});
