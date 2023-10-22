const express = require('express');
const app = express();
const port = 3000;

app.get('/validateEmail/:email', (req, res) => {
  console.time('--- Validating email ---')
    if (/([a-zA-Z0-9]+)([\-\_\.])(\w*)*@gmail.com$/.test(req.params.email)) {
      res.send('Your email is valid!');
    } else {
      res.send('Your email isn\'t valid!');
    }
  console.timeEnd('--- Validating email ---')
})

app.get('/health', (req, res) => {
  return res.send({
    "status": "ok"
  })
})

app.listen(port, () => {
  console.log(`Vuln app listen on port: ${port}`);
})



