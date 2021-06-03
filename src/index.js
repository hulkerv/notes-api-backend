const express = require('express')
const cors = require('cors')
const app = express()

const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
	{
		"id":1,
		"content":"Me tengo que subscribir a @midudev en YouTube Twitch",
		"date":"20019-05-30T17:30:31.098Z",
		"important":true
	},
	{
		"id":2,
		"content":"Tengo que estudiar las clases del FullStack Bootcamp",
		"date":"20019-05-30T18:39:34.091Z",
		"important":false
	},
	{
		"id":3,
		"content":"Repasar los retos de JS de midudev",
		"date":"20019-05-30T19:20:14.298Z",
		"important":true
	}
]

//const app = http.createServer((request, response) => { 
//	response.writeHead(200, {'Content-Type':'application/json'})
//	response.end(JSON.stringify(notes))
//})

app.get('/', ((req,res) => {
	res.send('<h1>Hello World</h1>')
}))

app.get('/api/notes', (req,res) => {
	res.json(notes)
})

app.get('/api/notes/:id', (req,res) => {
	const id =Number(req.params.id)
	const note = notes.find(note=>note.id === id)
	if (note){
		res.json(note)
	}else{
		res.status(404).end()
	}
})

app.delete('/api/notes/:id', (req,res) => {
	const id =Number(req.params.id)
	notes = notes.filter(note => note.id !== id)
	res.status(204).end()
})

app.post('/api/notes', (req,res) => {
	const note = req.body
	
	if(!note || !note.content){
		return res.status(400).json({
			error: "note.content is missing"
		})
	}
	
	const ids= notes.map(note => note.id)
	const maxId = Math.max(...ids)
	
	const newNote = {
		id: maxId + 1,
		content: note.content,
		important: typeof note.important !== 'undefined' ? note.important : false,
		date: new Date().toISOString()
	}

	notes = [...notes, newNote]
	
	res.status(201).json(newNote)
})

app.use((req, res)=>{
	console.log(req.path)
	res.status(404).json({
		error: 'Not found'
	})
})

const PORT = 3001
app.listen(PORT, ()=> {
	console.log(`Server on port ${PORT}`)
})
