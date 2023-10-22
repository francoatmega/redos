const express = require('express');
const parser = require('body-parser')
const User = require('./db')

const app = express();
const port = 3000;

app.use(parser.json())

app.post('/user', async (req, res) => {
    console.time('--- Creating user ---')
    await User.create({
        username: req.body.username,
        email: req.body.email,
    });
    console.timeEnd('--- Creating user ---')
})

app.get('/users', async (req, res) => {
    const users = await User.findAll();
    return res.send(users);
})

app.get('/health', (req, res) => {
    return res.send({
      "status": "ok"
    })
  })

app.listen(port, () => {
  console.log(`Vuln app listen on port: ${port}`);
})



