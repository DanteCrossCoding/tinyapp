const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession( {
  name: "user_id",
  keys: ['key1', 'key2'],
}))

app.set("view engine", "ejs");



//++++++++++++++++DATABASE++++++++++++++++++++++++
const urlDatabase = {

};

// const urlDatabase = {
//   "b2xVn2": { longURL:"http://www.lighthouselabs.ca", userID: "sda7f" },
//   "9sm5xK": { longURL: "http://www.google.com", userID: "sda7f" },
//   "ne8U8i": { longURL: "http://www.yahoo.com", userID: "af8ej5" },
// };

const users = {}
//   "sda7f": {
//   id: "sda7f",
//   email: "something@this.com",
//   password: "12345",
// },
//   "af8ej5": {
//     id: "af8ej5",
//     email: "something@that.com",
//     password: "54321",
//   }


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
      return users[user];
    }
  }
}
//-------------
const selectUser = function(user_id) {
  for (let user in users) {
    if (user_id === user) {
      return users[user];
    }
  } return false;
}
//---------------------
const urlsForUser = function(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

//++++++++++++++GET routes++++++++++++++++++

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//------------
app.get("/register", (req, res) => {
  const data = req.session.user_id;
  const user = users[data];
  const templateVars = {
    user: user,
  }
  res.render("register", templateVars)
})
 //-----------
app.get("/urls", (req, res) => {

   let templateVars = { user: selectUser(req.session.user_id), urls: urlsForUser(req.session.user_id, urlDatabase) };
  res.render("urls_index", templateVars);
});
//-------------
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templatVars = { urls: urlDatabase, user: selectUser(req.session.user_id) };
    res.render("urls_new", templatVars);
  }
});
//---------------
app.get("/urls/:shortURL", (req, res) => {
  const data = req.session.user_id
  const user = users[data];
  const postURL = urlDatabase[req.params.shortURL]; 

  const templateVars = { 
    user: selectUser(req.session.user_id),
    shortURL: req.params.shortURL, 
    longURL: postURL.longURL};

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
  const data = req.session.user_id
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
  const password = req.body.password
  
  
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
  users[id] = user
  
  req.session.user_id = id;
  res.redirect("/urls");
})
//-------------------------
app.post("/login", (req, res) => {
  const email = req.body.email;
  const userID = findEmail(req.body.email)
  

  if (!email || !req.body.password) {
    return res.status(400).send("Email and Password required");
  }
   if (userID) {
   if (bcrypt.compareSync(req.body.password, userID.password)) {
     req.session.user_id = userID.id
     res.redirect("urls"); 

    } else {
    return res.status(400).send("Incorrect email or password");
    } }
})
//---------------
app.post("/logout", (req, res) => {
  
  req.session = null;
  res.redirect("/urls");
})
//----------------



//++++++++++++++++Listening++++++++++++++++++++++
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});