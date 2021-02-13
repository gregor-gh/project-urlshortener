require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const urlStore = [];


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function(_req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(_req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:id", ( req, res ) => {

  const redirectUrl = urlStore.find(x => x.short_url == req.params.id).original_url;
  
  res.redirect(redirectUrl);
})

app.post("/api/shorturl/new",urlencodedParser, (req,res) => {
  
    const url = req.body.url;
    const id = urlStore.length+1;
    const regex = /^http|^https/;

    // if valid url
    if(regex.test(url)) {
      //push to store
      urlStore.push({
        "original_url": url,
        "short_url": id
      })
      // return json
      res.json({
        "original_url": url,
        "short_url": id
      });

    }
    else {
      //else return error
      res.json({ "error": "invalid url" })
    }

  });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
