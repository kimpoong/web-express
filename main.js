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
        var template;
        if (title == undefined) {
            title = 'front page';
            content = 'Welcome!';
            template = `
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
            `;
        }
        else {
            content = fs.readFileSync(`data/${title}`, 'utf8');
            template = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Web-NodeJs:${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web-NodeJs</a></h1>
                    ${list_html}
                    <p>
                        <a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>
                    </p>
                    <h2>${title}</h2>
                    <p>${content}</p>
                </body>
            </html>
            `;
        }

        
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
    else if (pathname == '/update') {
        var title = queryData.id;
        var content = fs.readFileSync(`data/${title}`, 'utf8');
        var template = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Web-NodeJs:update</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web-NodeJs</a></h1>
                    <form action="/update_doc" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" value="${title}"></p>
                        <p><textarea name="content">${content}</textarea></p>
                        <p><input type="submit"></p>
                    </form>
                </body>
            </html>
            `
        res.writeHead(200);
        res.end(template);
    }
    else if (pathname == '/update_doc') {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            fs.writeFileSync(`data/${post.id}`, post.content, 'utf8');
            fs.renameSync(`data/${post.id}`, `data/${post.title}`);
            res.writeHead(302, { Location: '/' });
            res.end();
        })
    }
    else if (pathname == '/delete') {
        var body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            fs.unlinkSync(`data/${post.id}`);
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