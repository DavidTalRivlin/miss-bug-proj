
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// app.get('/', (req, res) => res.send('Hello there'))

app.get('/puki', (req, res) => {
    let visitedCount = req.cookies.visitedCount || 0
    res.cookie('visitedCount', ++visitedCount, { maxAge: 1000 * 5 })
    res.send(`<h1>Hello Puki ${visitedCount}</h1>`)
})



// Get (all) Bugs (READ)
app.get('/api/bug', (req, res) => {

    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

//Get Bug
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})
 

// Add Bug
app.post('/api/bug/', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity:req.body.severity,
        label:req.body.label,
        createdAt: Date.now(),
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Edit/Update Bug

app.put('/api/bug/', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity:req.body.severity,
        label:req.body.label,
        _id: req.body._id
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})




// Remove bug (DELETE)
app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})


const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

