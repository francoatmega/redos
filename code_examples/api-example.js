const { createServer } = require('http')
var validator = require("validator")
var qs = require('querystring');

const app = createServer(async (req, res) => {
    if(req.method == 'POST' && req.url == '/user') {
        let body
        req.on('data', function (data) {
            body += data;

        });

        req.on('end', function () {
            var post = qs.parse(body);
            const validEmail = validator.isEmail(body.email)
            const validEmailDisplayName = validator.isEmail(body.emailDisplayName, { allow_display_name: true })
            if(!validEmail || !validEmailDisplayName) {
                res.writeHead(400, 'Invalid data')
            }
            // use post['blah'], etc.
        });

        // for await (const chunk of req) body = JSON.parse(chunk)

        res.end()
    }
})

app.listen(3000, () => console.log('listening on port 3000'))
