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
//
var upload_path = __dirname + '/public/files/';

// Make multer save the original file properly
storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, upload_path)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

app.use(multer({ dest: upload_path, storage: storage }).any())
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

app.post('/file', (req, res) => {
    if (req.files) {
        var fullUrl =
            req.protocol + '://' +
            req.get('host') + '/files/' +
            req.files[0].originalname;

        var obj = {
            file: fullUrl
        }

        res.header("Content-Type", "application/json")
        res.send(obj);
    } else {
        res.status(400)
        res.send('Invalid data.')
    }
});

app.get('/profile', (req, res) => {
    db.collection('profile').find().toArray(function (err, results) {
        res.header("Content-Type", "application/json")
        res.send(results)
    })
})

app.post('/profile', (req, res) => {
    if (req.files && req.body) {
        // Take full url for first file
        var fullUrl =
            req.protocol + '://' +
            req.get('host') + '/files/' +
            req.files[0].originalname;

        var obj = {
            name: req.body.name,
            url: fullUrl
        }

        db.collection('profile').save(obj, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500)
                res.send('An error ocurred while saving the data.')
                return;
            }

            res.header("Content-Type", "application/json")
            res.status(200)
            res.send(obj)
        })
    } else {
        res.status(400)
        res.send('Invalid data.')
    }
})

MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(3000, function () {
        console.log('Server running on port 3000!')
    })
})
