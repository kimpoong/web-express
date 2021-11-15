var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer((req, res) => {
    var queryData = url.parse(req.url, true).query;
    var pathname = url.parse(req.url, true).pathname;
    
    if (pathname != '/') {
        res.writeHead(404);
        res.end('not found');
    }
    else {
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
                    <title>Web-NodeJs/${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Web-NodeJs</a></h1>
                    ${list_html}
                    <h2>${title}</h2>
                    <p>${content}</p>
                </body>
            </html>
            `
        res.writeHead(200);
        res.end(template);
    }
    
});

app.listen(3000);