var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var app = http.createServer((req, res) => {
    var queryData = url.parse(req.url, true).query;
    var pathname = url.parse(req.url, true).pathname;
    
    if (pathname == '/') {
        var title = queryData.id;
        var content;
        var filelist = fs.readdirSync("./data");
        var list_html = '<ol>';
        filelist.forEach((file) => {
            list_html += `<li><a href="/?id=${file}">${file}</a></li>`;
        });
        list_html += '</ol>';
        if (title == undefined) {
            title = 'front page';
            content = 'Welcome!';
        }
        else {
            content = fs.readFileSync(`data/${title}`, 'utf8');
        }

        var template = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Web-NodeJs:${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web-NodeJs</a></h1>
                    ${list_html}
                    <p><a href="/create">create</a></p>
                    <h2>${title}</h2>
                    <p>${content}</p>
                </body>
            </html>
            `
        res.writeHead(200);
        res.end(template);
    }
    else if (pathname == '/create') {
        var template = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Web-NodeJs:create</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web-NodeJs</a></h1>
                    <form action="/create_doc" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p><textarea name="content" placeholder="content"></textarea></p>
                        <p><input type="submit"></p>
                    </form>
                </body>
            </html>
            `
        res.writeHead(200);
        res.end(template);
    }
    else if (pathname == '/create_doc') {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            fs.writeFileSync(`data/${post.title}`, post.content, 'utf8');
            res.writeHead(302, { Location: '/' });
            res.end();
        })
    }
    else {
        res.writeHead(404);
        res.end('not found');
    }
    
});

app.listen(3000);