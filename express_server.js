const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const { generateRandomString, findEmail, urlsForUser, } = require("./helpers");
const app = express();
const PORT = 8080;

//-----------------------------

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: "user_id",
  keys: ['key1', 'key2'],
}));

app.set("view engine", "ejs");



//++++++++++++++++DATABASE++++++++++++++++++++++++
const urlDatabase = {};

const users = {
  asfds: {
    id: "id",
    email: "email@this.com",
    password: ""
  },
};


//++++++++++++++GET routes++++++++++++++++++

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//------------
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("register", templateVars);
});
//-----------
app.get("/urls", (req, res) => {

  let templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id, urlDatabase) };
  res.render("urls_index", templateVars);
});
//-------------
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { urls: urlDatabase, user: users[req.session.user_id],  };
    res.render("urls_new", templateVars);
  }
});
//---------------
app.get("/urls/:shortURL", (req, res) => {
  const postURL = urlDatabase[req.params.shortURL];

  const templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: postURL.longURL};

  res.render("urls_show", templateVars);
});
//--------------
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase.hasOwnProperty(req.params.shortURL)) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);

  } else {
    res.send("Page does not exist");
    return res.status(400);
  }
});
//------------------
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("login", templateVars);
});

// ++++++++++++++++++++POST routes+++++++++++++++++++++


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});
//----------
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});
//------------
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL: longURL, userID: req.session.user_id};
  
  res.redirect("/urls");
});
//-------------

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  
  
  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  }
  
  for (let id in users) {
    if (email === users[id].email) {
      return res.status(400).send("Email already registered");
    }
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = { id: id, email: req.body.email, password: hashedPassword,};
  users[id] = user;
  
  req.session.user_id = id;
  res.redirect("/urls");
});
//-------------------------
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = findEmail(req.body.email, users);
  if (userID) {
    if (bcrypt.compareSync(password, userID.password)) {
      req.session.user_id = userID.id;
      res.redirect("urls");

    } else if (!email || !req.body.password) {
      return res.status(400).send("Email and Password required");

    } else {
      return res.status(400).send("Incorrect email or password");
    }
  }
});
//---------------
app.post("/logout", (req, res) => {
  
  req.session = null;
  res.redirect("/urls");
});
//----------------



//++++++++++++++++Listening++++++++++++++++++++++
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

