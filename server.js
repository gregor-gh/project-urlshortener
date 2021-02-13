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

app.route("/api/shorturl/new")
/*  .get((_req,res)=> {
    res.json({
      "original_url": "one",
      "short_url": "two"
    });
  })*/
  .post(urlencodedParser, (req,res) => {
    const url = req.body.url;
    const id = urlStore.length+1;

    if(validUrl.isUri(url)) {
      urlStore.push({
        "original_url": url,
        "short_url": id
      })

      res.json({
        "original_url": url,
        "short_url": id
      });
    }
    else {
      res.json({ "error": "invalid url" })
    }

  });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
