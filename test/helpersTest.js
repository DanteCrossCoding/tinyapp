const { assert } = require('chai');


const { generateRandomString, selectUser, findEmail, urlsForUser } = require('../helpers');

const testUsers = {
  "user1RandomID": {
    id: "user1RandomID",
    email: "user1@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "blue-chimp-trex"
  }
};

const testUrlDatabase = {
  "bfjqot": {
    longUrl: "http://www.lighthouselabs.ca",
    userID: "user1RandomID"
  },
  "htlams": {
    longUrl: "http://www.google.com",
    userID: "user1RandomID"
  },
  "mjqcht": {
    longUrl: "http://www.zara.com",
    userID: "user2RandomID"
  }
};

describe('generateRandomString', function() {

  it('should return a string with six characters', function() {
    const randomStringLength = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(randomStringLength, expectedOutput);
  });

  it('should not return the same string when called multiple times', function() {
    const firstRandomString = generateRandomString();
    const secondRandomString = generateRandomString();
    assert.notEqual(firstRandomString, secondRandomString);
  });
});

describe('findEmail', function() {

  it('should return a user with a valid email', function() {
    const user = findEmail("user1@example.com", testUsers);
    const expectedOutput = "user1RandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined when no user exists for a given email address', function() {
    const user = findEmail("me@test.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('selectUser', function() {
  
  it('should return true if email corresponds to a user in the database', function() {
    const existingEmail = selectUser("user1@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(existingEmail, expectedOutput);
  });

  it('should return false if email does not correspond to a user in the database', function() {
    const nonExistantEmail = selectUser("fake_email@test.com", testUsers);
    const expectedOutput = false;
    assert.equal(nonExistantEmail, expectedOutput);
  });
});

describe('urlsForUser', function() {

  it('should return an object of url information specific to the given user ID', function() {
    const specificUrls = urlsForUser("user1RandomID", testUrlDatabase);
    const expectedOutput = {
      "bfjqot": {
        longUrl: "http://www.lighthouselabs.ca",
        userID: "user1RandomID"
      },
      "htlams": {
        longUrl: "http://www.google.com",
        userID: "user1RandomID"
      }
    };
    assert.deepEqual(specificUrls, expectedOutput);
  });

  it('should return an empty object if no urls exist for a given user ID', function() {
    const noSpecificUrls = urlsForUser("fakeUser", testUrlDatabase);
    const expectedOutput = {};
    assert.deepEqual(noSpecificUrls, expectedOutput);
  });
});