import express from 'express';
import cors from 'cors';
import monk from 'monk';


 
const app = express();

app.use(cors());

// Any in coming request has a content type of app json will be parseandd by this middleware and put on the body
app.use(express.json());

app.get('/', (req,res) => {
    res.json({
        "hey":"Whasup"        
    })   
})
function isValidWish(wishData){
    return wishData.name && wishData.name.toString().trim() !== '' &&
    wishData.wish && wishData.wish.toString().trim() !== ''
}

app.post('/wish', (req,res) => {
    if(isValidWish(req.body)){
        //insert into db
        const wishData = {
            name: req.body.name.toString(),
            wish: req.body.wish.toString()
        }
    }else {
        res.status(422);
        res.json({
            message:"Hey this is not a valid wish !!"
        })
    }
    
})

app.listen(5000, () => {
    console.log('listening on 5000');
});