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
  "sda7f": {
  id: "sda7f",
  email: "something@this.com",
  password: "12345",
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

const findEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user].id;
    }
  }
}



//++++++++++++++GET routes++++++++++++++++++

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const templateVars = {
    user: user,
  }

  res.render("register", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase.hasOwnProperty(req.params.shortURL)){
    res.send("Page does not exist");
    return res.status(400);
  }
})

app.get("/urls", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const templateVars = { 
    user: user,
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const templateVars = {
    user: user,
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const templateVars = { 
    user: user,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};
  let longURL = urlDatabase[req.params.shortURL];
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const templateVars = {
    user: user,
  }
  res.render("login", templateVars);
})

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
  const email = req.body.email;
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  }
  
   const userID = findEmail(req.body.email)
     if (userID) {
    res.cookie("user_id", userID);
     }
  res.redirect("urls");
})

app.post("/logout", (req, res) => {
  
  res.clearCookie("user_id", req.body)
  res.redirect("/urls");
})

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password
  
  
  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  }

  for (let id in users) {
    if (email === users[id].email) {
      return res.status(400).send("Email already registered");
    }
  }
  const user = { id, email, password,};
  users[id] = user
  
  res.cookie("user_id", id);
  
  // console.log()
  res.redirect("/urls");
})


//++++++++++++++++Listening++++++++++++++++++++++
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});