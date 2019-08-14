const express = require('express');
const cors = require('cors');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose')
const fetch = require('node-fetch');

//Mongoose Schema

const Schema = mongoose.Schema;

const wishSchema = new Schema({
    name: String,
    content: String,
    created:Date

});
var WishModel = mongoose.model('Wish', wishSchema);




const app = express();
const uri = "mongodb+srv://ozanm:ozanm@cluster0-k18u3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true}).then(
  () => {console.log('DB')}
);
// const db = monk(uri || 'localhost:27017/wishlist');

// var WishModel = mongoose.model('WishModel', wishSchema);

const filter = new Filter();

app.enable('trust proxy');

// allow cross origin requests
app.use(cors());


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Flying Penguin Waiting For User Wishes..'
  });
});

app.get('/v2/wishes', (req, res, next) => {
  WishModel
  .find()
  .then(wishes => {        
      res.json(wishes);
  }).catch(next);
  });


function isValidWish(wish){
 return wish.name && wish.name.toString().trim() !== '' && wish.name.toString().trim().length <= 50 &&
 wish.content && wish.content.toString().trim() !== ''&& wish.content.toString().trim().length <= 140;
}

app.use(rateLimit({
    windowMs: 3 * 1000, // 30 seconds
    max: 1
  }));

  const createWish = (req, res, next) => {
    if (isValidWish(req.body)) {
      const wish = new WishModel( {
        name: filter.clean(req.body.name.toString().trim()),
        content: filter.clean(req.body.content.toString().trim()),
        created: new Date()
      });
          // save model to database
    wish.save(function (err, savedwish) {
      if (err) return console.error(err);
      console.log(savedwish.name + " saved to wishes collection.");
    });
    } else {
      res.status(422);
      res.json({
        message: 'Hey! Name and Content are required! Name cannot be longer than 50 characters. Content cannot be longer than 140 characters.'
      });
    }
  };

  app.post('/v2/wishes', createWish);
  
  app.use((error, req, res, next) => {
    res.status(500);
    res.json({
      message: error.message
    });
  });
  
  app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
  });