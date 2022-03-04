const bcrypt = require("bcrypt");
const { mongoConnection } = require("./connection");

// Add User

function addUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      // check if user does not exists
      let checkUserData = await checkIfUserExists({ email: userData.email });
      if (checkUserData.data && checkUserData.data.length > 0) {
        // user already exists (send response)
        return resolve({
          error: true,
          message: "User already exists, please Login",
          data: [],
        });
      }
      let passwordHash = await bcrypt.hash(userData.password, 15);
      userData.password = passwordHash;

      // add new user
      mongoConnection
        .collection("users")
        .insertOne(userData, async (err, results) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          resolve({
            error: false,
            data: results.ops[0],
          });
        });
    } catch (err) {
      reject(err);
    }
  });
}

// Verify user

function verifyUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      let userDatafromDb = await checkIfUserExists({ email: userData.email });
      if (userDatafromDb.data && userDatafromDb.data.length > 0) {
        // user already exists, verify the password
        let passwordVerification = await bcrypt.compare(
          userData.password,
          userDatafromDb.data[0].password
        );
        if (!passwordVerification) {
          //password mismatch
          return resolve({
            error: true,
            message: "Password is incorrect",
            data: [],
          });
        }
        return resolve({ error: false, data: userDatafromDb.data[0] });
      } else {
        return resolve({
          error: true,
          message:
            "There is no user exists with this account. Please create a new account",
          data: [],
        });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

function checkIfUserExists(userData) {
  return new Promise((resolve, reject) => {
    try {
      mongoConnection
        .collection("users")
        .find({ email: userData.email })
        .toArray((err, results) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          resolve({ error: false, data: results });
        });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  addUser: addUser,
  verifyUser: verifyUser,
};
