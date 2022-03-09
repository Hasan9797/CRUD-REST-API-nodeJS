const ht = require("http")
const { v4 } = require("uuid")
const getBayData = require('./util')



let books = [
    {
        id: 1,
        title: 'Book n1',
        pages: 250,
        author: 'Writer 1'
    }
]

const server = ht.createServer(async (req,res) => {
    if (req.url === '/book' && req.method === 'GET'){
        res.writeHead(200, {'Content-type': 'application/json charset=utf8'})
        const resp = {
            status: 'Ok',
            books
        }
        res.end(JSON.stringify(resp))
    }else if (req.url === '/book' && req.method === 'POST'){
        const data = await getBayData(req)
        const {title, pages, author} = JSON.parse(data)
        const newBook = {
            id: v4(),
            title,
            pages,
            author
        }
        books.push(newBook)
        const resp = {
            status: 'Created',
            book: newBook
        }
        res.writeHead(200, {'Content-type': 'application/json charset=utf8'})
        res.end(JSON.stringify(resp))
        
    }else if (req.url.match(/\/book\/\w+/) && req.method === 'GET'){
        const id = req.url.split('/')[2]
        const book = books.find(b => b.id === id)
        res.writeHead(200, {'Content-type': 'application/json charset=utf8'})
        const resp = {
            status: 'OK',
            book
        }
        res.end(JSON.stringify(resp))

    }else if (req.url.match(/\/book\/\w+/) && req.method === 'PUT'){
        const id = req.url.split('/')[2]
        const data = await getBayData(req)
        const {title, pages, author} = JSON.parse(data)
        const indexId = books.findIndex(b => b.id === id)

        const changedBook = {
            id: books[indexId].id,
            title: title || books[indexId].title,
            pages: pages || books[indexId].pages,
            author: author || books[indexId].author
        }
        books[indexId] = changedBook

        res.writeHead(200, {'Content-type': 'application/json charset=utf8'})
        const resp = {
            status: 'Changed',
            book: changedBook
        }
        res.end(JSON.stringify(resp))
    }else if (req.url.match(/\/book\/\w+/) && req.method === 'DELETE'){
        const id = req.url.split('/')[2]
        books = books.filter(b => b.id !== id)
        const resp = {
            status: 'DELETE',
        }
        res.writeHead(200, {'Content-type': 'application/json charset=utf8'})
        res.end(JSON.stringify(resp))
    }
})

server.listen(5000, () => console.log('Server running on port: 5000...'));