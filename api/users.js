const { JWT_SECRET } = process.env;
const express = require('express');
const usersRouter = express.Router();
const {getUserByEmail, getUserById,createUser} = require("../db");

usersRouter.post("/register", async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const _user = await getUserByEmail(email);
      if (_user) {
        res.status(401);
        next({
          name: "UserExistsError",
          message: `User ${email} is already taken.`,
        });
      }
      const user = await createUser({
        email,
        password,
      });
      const token = jwt.sign(
        {
          id: user.id,
          email,
        },
        JWT_SECRET,
        { expiresIn: "3w" }
      );
      res.send({
        user,
        message: "Thank you for signing up",
        token,
      });
    } catch ({ error, name, message }) {
      next({ error,name, message });
    }
  });


  // POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both an email and password",
      });
    }
    try {
      const user = await getUserByEmail(email);
      if (user.password===password) {
        const token = jwt.sign(user, JWT_SECRET);
        res.send({ user, message: "you're logged in!", token: token });
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
    } catch (error) {
      next(error);
    }
  });
   //:user_id


   //Get All user
   usersRouter.get("/", async (req, res) => {
    const allUsers = await getAllUsers();
    res.send(allUsers);
  });


module.exports = usersRouter;