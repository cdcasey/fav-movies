var express = require('express');
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

// app.get('favorites', function(req, res){
//   if(!req.body.name || !req.body.oid){
//     res.send("Error");
//     return

//   var data = JSON.parse(fs.readFileSync('./data.json'));
//   data.push(req.body);
//   fs.writeFile('./data.json', JSON.stringify(data));
//   res.setHeader('Content-Type', 'application/json');
//   res.send(data);
// });

// Catch any non-defined routes
app.use((req, res) => {
    res.status(404).json({ message: res.message || 'Not Found' });
});

// Some error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
