const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const compression = require('compression')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

app.get('/', (req, res) => {
    var file_list = fs.readdirSync("./page")
    var list_html = '<ol>'
    file_list.forEach((page_id) => {
        console.log(page_id)
        list_html += `<li><a href="/page/${page_id}">${page_id}</a></li>`
    })
    list_html += '</ol>'
    var title = 'front page'
    var content = 'Welcome!'
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
    res.send(template)
})

app.get('/page/:pageId', (req, res) => {
    var file_list = fs.readdirSync("./page")
    var list_html = '<ol>'
    file_list.forEach((page_id) => {
        console.log(page_id)
        list_html += `<li><a href="/page/${page_id}">${page_id}</a></li>`
    })
    list_html += '</ol>'
    var title = req.params.pageId
    var content = fs.readFileSync(`./page/${title}`, 'utf8')
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
                <p>
                    <a href="/create">create</a>
                    <a href="/update/${title}">update</a>
                    <form action="/delete" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>
                </p>
                <h2>${title}</h2>
                <p>${content}</p>
            </body>
        </html>
        `
    res.send(template)
})

app.get('/create', (req, res) => {
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
    res.send(template)
})

app.post('/create_doc', (req, res) => {
    var post = req.body;
    fs.writeFileSync(`page/${post.title}`, post.content, 'utf8');
    res.redirect('/');
})

app.get('/update/:pageId', (req, res) => {
    var title = req.params.pageId
    var content = fs.readFileSync(`page/${title}`, 'utf8')
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
    res.send(template)
})

app.post('/update_doc', (req, res) => {
    var post = req.body
    fs.writeFileSync(`page/${post.id}`, post.content, 'utf8')
    fs.renameSync(`page/${post.id}`, `page/${post.title}`)
    res.redirect('/')
})

app.post('/delete', (req, res) => {
    var post = req.body
    fs.unlinkSync(`page/${post.id}`)
    res.redirect('/')
})

app.listen(port, () => {

})