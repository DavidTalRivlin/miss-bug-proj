
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import express from 'express'

const app = express()

app.use(express.static('public'))
// app.use(cookieParser())

// app.get('/', (req, res) => res.send('Hello there'))

// Get Bugs 
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


// Save Bugs
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        description: req.query.description,
        severity:req.query.severity,
        createdAt: Date.now(),
        _id: req.query._id
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})


app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})



// Remove bug (DELETE)
app.get('/api/bug/:id/remove', (req, res) => {
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

