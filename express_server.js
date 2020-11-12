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
  "b2xVn2": { longURL:"http://www.lighthouselabs.ca", userID: "sda7f" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "sda7f" },
  "ne8U8i": { longURL: "http://www.yahoo.com", userID: "af8ej5" },
};

const users = {
  "sda7f": {
  id: "sda7f",
  email: "something@this.com",
  password: "12345",
},
  "af8ej5": {
    id: "af8ej5",
    email: "something@that.com",
    password: "54321",
  }
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
//------------
const findEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user].id;
    }
  }
}
//-------------
const urlsForUser = function(id) {
let myURLs = {};
  
  for (let key in urlDatabase) {
  let userID = urlDatabase[key].userID
    if (id === userID) {
      myURLs[key] = urlDatabase[key].longURL;
      
      return myURLs;
    }
  }}
//--------------
const checkUserPassword = function(email) {
  let userPassword = ""
  for (let user in users) {
    if (email === users[user].email) {
      userPassword = users[user].password
      return userPassword
    }
  }
}


//++++++++++++++GET routes++++++++++++++++++

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//------------
app.get("/register", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const templateVars = {
    user: user,
  }
  res.render("register", templateVars)
})
 //-----------
app.get("/urls", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  let myURLs = {};
  
  for (let key in urlDatabase) {
    let userID = urlDatabase[key].userID
    if (req.cookies["user_id"] === userID) {
      myURLs[key] = urlDatabase[key].longURL;
    }
  }
   const templateVars = { 
    user: user,
    urls: myURLs };
  res.render("urls_index", templateVars);
});
//-------------
app.get("/urls/new", (req, res) => {
  const data = req.cookies["user_id"];
  const user = users[data];
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: user,
  }
  if (!userID) {
    res.redirect("/login?")
  } else {
    res.render("urls_new", templateVars);
  }
});
//---------------
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
//--------------
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase.hasOwnProperty(req.params.shortURL)){
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);

  } else {
      res.send("Page does not exist");
      return res.status(400);
  }
});
//------------------
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
//----------
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//------------
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});
//-------------
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  let thisCheck = checkUserPassword(req.body.email)

  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  }
   
   if (email && password !== thisCheck)
     return res.status(400).send("Incorrect email or password");

   const userID = findEmail(req.body.email)
     if (userID) {
    res.cookie("user_id", userID);
     }
  res.redirect("urls");
})
//---------------
app.post("/logout", (req, res) => {
  
  res.clearCookie("user_id", req.body)
  res.redirect("/urls");
})
//----------------
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
  res.redirect("/urls");
})


//++++++++++++++++Listening++++++++++++++++++++++
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});