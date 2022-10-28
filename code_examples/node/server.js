const express = require('express');
const app = express();
const port = 3000;

app.get('/validateEmail/:email', (req, res) => {
    if (/([a-zA-Z0-9]+[_\-\.]*)+@(hotmail|gmail).com$/.test(req.params.email)) {
        return res.send('Your email is valid!');
    }
    return res.send('Your email isn\'t valid!');
})

app.listen(port, () => {
  console.log(`Vuln app listen on port: ${port}`);
})