const fs = require("fs");
const { validateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.post("/", validateUser, async (req, res, next) => {
  try {
      const { username, age, password } = req.body;
      const data = await fs.promises
          .readFile("./user.json", { encoding: "utf8" })
          .then((data) => JSON.parse(data));
      const id = uuidv4();
      data.push({ id, username, age, password });
      await fs.promises.writeFile("./user.json", JSON.stringify(data), {
          encoding: "utf8",
      });
      res.send({ id, message: "sucess" });
  } catch (error) {
      next({ status: 403, internalMessage: error.message });
  }
  debugger
});

router.patch("/:userId", validateUser, async (req, res, next) => {
  try {
    const { username, age, password } = req.body;
    const users = await fs.promises.readFile("./user.json",{encoding:"utf8"}).then((data)=> JSON.parse(data));
    const del = users.filter((user) => {
      if (user.id!==req.params.userId) return user;
      return {
        username, age, password, id:user.id
      }
    })
    await fs.promises.writeFile("../user.json", JSON.stringify(del),{encoding: "utf8"});
    res.status(200)
    res.send({message:"user deleted"})
    
  } catch (error) {
    next({ status: 404, internalMessage: error.message });
  }
});

router.get('/', async (req,res,next)=>{
  try {
  const age = Number(req.query.age)
  const users = await fs.promises
  .readFile("./user.json", { encoding: "utf8" })
  .then((data) => JSON.parse(data));
  const filteredUsers = users.filter(user=>user.age===age)
  res.send(filteredUsers)
  } catch (error) {
  next({ status: 404, internalMessage: error.message });
  }

})

router.use((err,req,res,next)=>{
 if (err.status>=500) {
   return res.status(500).send({error:"internal server error"})
 }else if (err.status>=400 && err.status<500){
   return res.status(400).send({error:"can't reache server"})
 }
})


module.exports = router;
