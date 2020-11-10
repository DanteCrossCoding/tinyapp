const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

function generateRandomString() {
  let url = "";
  const length = 6;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
  url += chars.charAt(Math.floor(Math.random() * chars.length));
  return url;
}

const findKeyByValue = function(obj, value) {
  let result = ""; 
  for (let i in obj) {
    if (obj[i] === value) {
      result = i;
    }
  } 
return result;
}

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()]= req.body;
  let result = findKeyByValue(urlDatabase, req.body)
  res.send(result);
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase.hasOwnProperty(req.params.shortURL)){
    res.send("Page does not exist");
    return res.status(400);
  }
})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.redirect(longURL)
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});