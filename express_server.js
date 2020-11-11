const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");



//++++++++++++++++DATABASE++++++++++++++++++++++++
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  "userRandomID": {
  id: "",
  email: "",
  password: "",
},
}

//++++++++++++++FUNCTIONS THAT DIDNT LIKE BEING MODDED+++++++++++++++
function generateRandomString() {
  let url = "";
  const length = 6;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
  url += chars.charAt(Math.floor(Math.random() * chars.length));
  return url;
}


//++++++++++++++GET routes++++++++++++++++++

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  res.render("register")
})

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase.hasOwnProperty(req.params.shortURL)){
    res.send("Page does not exist");
    return res.status(400);
  }
})

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};
  let longURL = urlDatabase[req.params.shortURL];
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// ++++++++++++++++++++POST routes+++++++++++++++++++++


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect('/urls');
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body)
  res.redirect("/urls");
})

app.post("/register", (req, res) => {
  let id = generateRandomString();
  users.id = {
    "id": id,
    email: req.body.email,
    password: req.body.password,
  }
  res.cookie("username", req.body.email);
  res.redirect("/urls");
})

//++++++++++++++++Listening++++++++++++++++++++++
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});