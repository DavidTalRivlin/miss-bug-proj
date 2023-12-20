import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'

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

// List Bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: req.query.severity || 0,
        label: req.query.label || '',
        pageIdx: req.query.pageIdx,
        sortBy: req.query.sortBy || '',
        sortDir: req.query.sortDir || 1

    }

    console.log(filterBy)
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})


//Read Bug 
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then((bug) => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})


// Add Bug
app.post('/api/bug', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity, label } = req.body

    const bugToSave = {
        title,
        description,
        severity,
        label,
    }

    bugService.save(bugToSave, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})


// Update Bug

app.put('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { title, description, severity, label, _id } = req.body

    const bugToSave = {
        title,
        description,
        severity,
        label,
        _id
    }

    bugService.save(bugToSave, loggedinUser)
        .then((bug) => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})




// Remove bug (DELETE)
app.delete('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')

    const bugId = req.params.id

    bugService.remove(bugId, loggedinUser)
        .then(() => {
            loggerService.info(`bug ${bugId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})


// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})


app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})


app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})


app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)