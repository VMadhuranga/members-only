#! /usr/bin/env node
const mongoose = require("mongoose");

const UserModel = require("./models/user-model");
const MessageModel = require("./models/message-model");

console.log(
  'This script populates some test products, manufacturers, categories and sizes to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

let admin;
const users = [];
const members = [];
const messages = [];

mongoose.set("strictQuery", false);
const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createMessages();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createAdmin(firstName, lastName, userName, password, role) {
  const newAdmin = new UserModel({
    firstName,
    lastName,
    userName,
    password,
    role,
  });

  await newAdmin.save();
  admin = newAdmin;
}

async function createNewMember(
  index,
  firstName,
  lastName,
  userName,
  password,
  role,
) {
  const newMember = new UserModel({
    firstName,
    lastName,
    userName,
    password,
    role,
  });

  await newMember.save();
  members[index] = newMember;
}

async function createNewUser(index, firstName, lastName, userName, password) {
  const newUser = new UserModel({
    firstName,
    lastName,
    userName,
    password,
  });

  await newUser.save();
  users[index] = newUser;
  console.log(`Added user: ${userName}`);
}

async function createNewMessage(index, user, message) {
  const newMessage = new MessageModel({
    user,
    message,
  });

  await newMessage.save();
  messages[index] = newMessage;
  console.log(`Added message: ${message}`);
}

async function createUsers() {
  console.log("Adding users");

  await Promise.all([
    createAdmin("admin", "nimda", "animda", "nimda1234", "admin"),
    createNewUser(0, "john", "doe", "jdoe", "jdoe1234"),
    createNewUser(1, "mike", "tyson", "mtyson", "mtyson1234"),
    createNewUser(2, "joe", "rogan", "jrogan", "jrogan1234"),
    createNewMember(0, "json", "momoa", "jmomoa", "jmomoa1234", "member"),
    createNewMember(1, "kevin", "josef", "kjosef", "kjosef1234", "member"),
  ]);
}

async function createMessages() {
  console.log("Adding messages");

  await Promise.all([
    createNewMessage(0, admin, "Hello I'm Admin"),
    createNewMessage(1, users[0], "Hello I'm John Doe"),
    createNewMessage(2, users[1], "Hello I'm Mike Tyson"),
    createNewMessage(3, users[2], "Hello I'm Joe Rogan"),
    createNewMessage(4, members[0], "Hello I'm Joson Momoa (Member)"),
    createNewMessage(5, members[1], "Hello I'm Kevin Josef (Member)"),
  ]);
}
