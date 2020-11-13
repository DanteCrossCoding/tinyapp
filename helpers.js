

function generateRandomString() {
  let url = "";
  const length = 6;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
  url += chars.charAt(Math.floor(Math.random() * chars.length));
  return url;
}
//------------
const findEmail = function(email, users) {
  for (let user in users) {
    if (email === users[user].email) {
      
      return users[user];
    }
  }
}
//-------------
const selectUser = function(user_id, users) {
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

module.exports = {
  generateRandomString,
  findEmail,
  selectUser,
  urlsForUser,
}
