import express from 'express';
import cors from 'cors';
import monk from 'monk';
import { Filter } from 'bad-words'
const app = express();

// const db = monk()

// const db = monk(process.env.MONGO_URI || 'mongodb+srv://ozan:<password>@cluster0-gnvcb.mongodb.net/test?retryWrites=true&w=majority')

const db = monk('mongodb+srv://ozan:<password>@cluster0-gnvcb.mongodb.net/test?retryWrites=true&w=majority')

// import collection to const
const wishes = db.get('wishes');
const filter = new Filter()

port = process.env.PORT || 3000;

app.use(cors());

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
    wishData.content && wishData.content.toString().trim() !== ''
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