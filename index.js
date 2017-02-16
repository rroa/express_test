var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var multer = require('multer');
var upload = multer();

app.use(multer({dest:__dirname + '/uploads/'}).any());

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

    res.header("Content-Type", "application/json");
    res.send(obj)
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse application/json
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

app.get('/', handler)

app.post('/', handler)

app.get('*', handler)

app.listen(3000, function () {
  console.log('Server running on port 3000!')
})