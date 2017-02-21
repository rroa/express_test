var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer()
const MongoClient = require('mongodb').MongoClient
var db = null
const url = 'mongodb://localhost:27017/quotes';

function handler(req, res, next) {
    let obj = {};
    obj.path = req.path
    obj.method = req.method
    obj.headers = req.headers
    obj.body = req.body
    obj.files = req.files
    obj.text = req.text
    obj.params = req.params
    obj.query = req.query

    res.header("Content-Type", "application/json")  
    res.send(obj)
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/json
app.use(multer({ dest: __dirname + '/uploads/' }).any());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

app.get('/quotes', (req, res) => {
    db.collection('quotes').find().toArray(function (err, results) {
        res.header("Content-Type", "application/json")
        res.send(results)
    })
})

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)        
        res.header("Content-Type", "application/json")
        res.send(result)
    })
})
// app.post('/quotes', handler);

MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(3000, function () {
        console.log('Server running on port 3000!')
    })
})
