const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');


const app = express();

const db = monk(process.env.MONGO_URI || 'localhost:27017/penguin-wishes');

db.then(() => {console.log("DBDB")})
const mews = db.get('wishes');
const filter = new Filter();

app.enable('trust proxy');

// allow cross origin requests
app.use(cors());


// import collection to const

const filter = new Filter()

port = process.env.PORT || 3000;

// Any in coming request has a content type of app json will be parse and by this middleware and put on the body
app.use(express.json());

app.get('/', (req,res) => {
    res.json({
        "hey":"Whasup",
        "ses":"ses2"         
    })   
})


app.get('/wishes', (req, res) => {
    wishes
    .find()
    .then(wishes => {        
        res.json(wishes);
    })
})


function isValidWish(wishData){
 return wishData.name && wishData.name.toString().trim() !== '' &&
 wishData.content && wishData.content.toString().trim() !== '';
}

app.post('/wishes', (req,res) => {
    if(isValidWish(req.body)){
        //insert into db
        const wishData = {
            name: filter.clean(req.body.name.toString().trim()),
            content: filter.clean(req.body.content.toString().trim()),
            created: new Date()
        }
        wishes
        .insert(wishData)
        .then(createdWish => {
            res.json(createdWish)
        })

    }else {
        res.status(422);
        res.json({
            message:"Hey this is not a valid wish !!"
        })
    }
    
})


app.listen(port, () => {
    console.log('listening on 3000');
});