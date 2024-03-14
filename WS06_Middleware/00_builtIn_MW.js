// ladataan tarvittavat modulit

var express = require('express');
var app = express();
var fs = require('fs');

//haetaan dotenv moduuli
const dotenv = require('dotenv').config();
// luodaan palvelinportti

const PORT = dotenv.parsed.PORT00 || 3000;

// ladataan body-parser moduuli
const bodyParser = require('body-parser');

//middleware to parse the request body
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

// Serve static files from the "public" directory
app.use(express.static('public'));

const { format } = require('date-fns');
const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;

// luodaan custom middleware, joka tulostaa jokaisen palvelimelle tulleen pyynnön URL-osoitteen konsoliin
app.use(function (req, res, next) {

    console.log('A new request received at ' + dateTime + ' for the URL ' + req.url + ' and the method is ' + req.method + ' and the path is ' + req.path);
    // next() -funktiolla pyyntö siirtyy seuraavaan middlewareen
    next();
});

// luo juurireitti, joka palauttaa selaimeen index.html tiedoston sisällön
app.get('/', function (req, res) {
    //res.send('Hello World!');
    res.sendFile(__dirname + '/index.html');
});
// luo toinen reitti, joka palauttaa selaimeen tekstidata.txt tiedoston sisällön
app.get('/list', function (req, res) {
    //res.send('Listing data from a file!');
    res.sendFile(__dirname + "/data/tekstidata.txt");
});

// luo kolmas reitti, joka palauttaa selaimeen JSONdata.json tiedoston sisällön
app.get('/jsondata', function (req, res) {
    var data = require(__dirname + '/data/JSONdata.json');
    res.json(data);
});



// luodaan reitti, joka parsii .json tiedoston sisällön taulukkomuotoon ja palauttaa sen selaimeen
app.get('/details', function (req, res) {
    var data = require(__dirname + '/data/JSONdata.json');

    // Parse the results into a variabke
    var results = '<table border="1"> ';

    for (var i = 0; i < data.length; i++) {
        results +=
            '<tr>' +
            '<td>' + data[i].Name + '</td>' +
            '<td>' + data[i].Email + '</td>' +
            '<td>' + data[i].Date + '</td>' +
            '</tr>';
    }

    res.send(results);
});

// lisätään GET polku (route) joka hakee /public/adduser.html tiedoston ja lähettää sen selaimeen 
app.get('/adduser', function (req, res) {
    res.sendFile(__dirname + '/public/adduser.html');

})

// lisätään POST polku (route) joka hakee tiedot ja tallentaa ne JSONdata.json tiedostoon.
app.post('/adduser', function (req, res) {
    // Load the existing data from a file and assign to an array (lista)
    const data = require(__dirname + '/data/JSONdata.json');

    //luodaan uusi henkilö...
    const nimi = req.body.name
    const email = req.body.email
    const company = req.body.company;
    const date = new Date().getDate() + "/" + (1 + parseInt(new Date().getMonth())) + "/" + new Date().getFullYear();
    //...ja pusketaan uusi käyttäjä listan (tiedoston) viimeiseksi
    data.push({
        "Name": nimi,
        "Company": email,
        "Email": company,
        "Date": date

    });

    // Convert the JSON object to a string format 
    var jsonStr = JSON.stringify(data);

    // Write data to a file
    fs.writeFile(__dirname + '/data/JSONdata.json', jsonStr, (err) => {
        if (err) throw err;
        console.log("tiedot tallennettu...")
    })
    res.send("Saved the data to a file. Browse to the /details to see the contents of the file");
});


app.get('*', function (req, res) {
    //res.send('Cant find the requested page', 404);
    res.sendFile(__dirname + '/public/error.html');
});

// käynnistetään palvelin kuuntelemaan valittua porttia
app.listen(PORT, function () {
    console.log('Example 00 app listening on port: ' + PORT);
});