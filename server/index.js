const express = require('express');
const cors = require('cors');
const Filter = require('bad-words');


const app = express();
app.use(cors());
// const db = monk()



// Retrieve

// Connect to the db

// import collection to const



const filter = new Filter()

port = process.env.PORT || 3000;


const url = 'mongodb+srv://ozan:ozan@cluster0-gnvcb.mongodb.net/test?retryWrites=true&w=majority'; // Connection URL
const db = require('monk')(url);

const wishes = db.get('wihes')
// Any in coming request has a content type of app json will be parse and by this middleware and put on the body
app.use(express.json());

app.get('/', (req,res) => {
    res.json({
        "hey":"Whasup"          
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
    console.log('listening on 5000');
});