const mongoose = require("mongoose");
const users = require("../models/users");

const jwt = require("jsonwebtoken");
const key = require("../config/keys.json");
const passwordHash = require("password-hash");

Users = () => {};

Users.addUsers = (name, pass, following) => {
  let usersModel = mongoose.model("Users", users);

  let newUser = new usersModel();
  newUser.name = name;
  newUser.password = pass;
  newUser.following = following;

  newUser.save((err, save) => {
    if (save) console.log("User Added");
    else console.log(err);
  });
};

Users.loginUser = async (name, pass) => {
  let usersModel = mongoose.model("Users", users);
  let user = await usersModel.find({ name: name });
  if (user.length > 0) {
    if (passwordHash.verify(pass, user[0].password)) {
      let token = {
        id: jwt.sign(
          { exp: Date.now() / 1000 + 60 * 60, id: user[0].id },
          key.tokenKey
        ),
        validity: true
      };
      return token;
    } else {
      let token = { validity: false };
      return token;
    }
  } else console.log("Empty");
};

Users.getUsers = async () => {
  let usersModel = mongoose.model("Users", users);
  let promise = await usersModel.find();
  return promise;
};

Users.getUserName = async id => {
  let uid = jwt.verify(id, key.tokenKey).id;
  let usersModel = mongoose.model("Users", users);
  let promise = await usersModel.find({ _id: uid });
  let name = { name: promise[0].name };
  return name;
};

Users.addFollower = async followers => {
  let usersModel = mongoose.model("Users", users);
  let namez = followers[0];
  usersModel.findOneAndUpdate(
    { name: namez },
    { following: followers },
    { new: true }
  );
};

module.exports = Users;
