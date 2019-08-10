const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');


const app = express();
const mongouri = 'mongodb+srv://ozan:ozan@cluster0-gnvcb.mongodb.net/test?retryWrites=true&w=majority';
const db = monk(process.env.MONGO_URI || 'localhost:27017/wishlist');


db.then(() => {console.log("DBDB")})
const wishes = db.get('wishes');
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


app.get('/wishes', (req, res,next) => {
    wishes
    .find()
    .then(wishes => {        
        res.json(wishes);
    }).catch(next);
});

app.get('/v2/wishes', (req, res, next) => {
    // let skip = Number(req.query.skip) || 0;
    // let limit = Number(req.query.limit) || 10;
    let { skip = 0, limit = 5, sort = 'desc' } = req.query;
    skip = parseInt(skip) || 0;
    limit = parseInt(limit) || 5;
  
    skip = skip < 0 ? 0 : skip;
    limit = Math.min(50, Math.max(1, limit));
  
    Promise.all([
      wishes
        .countDocuments,
      wishes
        .find({}, {
          skip,
          limit,
          sort: {
            created: sort === 'desc' ? -1 : 1
          }
        })
    ])
      .then(([ total, wishes ]) => {
        res.json({
        wishes,
          meta: {
            total,
            skip,
            limit,
            has_more: total - (skip + limit) > 0,
          }
        });
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
      const wish = {
        name: filter.clean(req.body.name.toString().trim()),
        content: filter.clean(req.body.content.toString().trim()),
        created: new Date()
      };
  
      wishes
        .insert(wish)
        .then(createdWish => {
          res.json(createdWish);
        }).catch(next);
    } else {
      res.status(422);
      res.json({
        message: 'Hey! Name and Content are required! Name cannot be longer than 50 characters. Content cannot be longer than 140 characters.'
      });
    }
  };

  app.post('/wishes', createWish);
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