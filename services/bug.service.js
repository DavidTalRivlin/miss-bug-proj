import fs from 'fs'
import { utilService } from "./utils.service.js";


export const bugService = {

    query,
    getById,
    remove,
    save
    
}
const PAGE_SIZE = 3

const bugs = utilService.readJsonFile('data/bug.json')



function query(filterBy, sortBy, sortDir) {
    let bugsToReturn = bugs
    
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.description) || regExp.test(bug.title))
    }
    if (filterBy.label) {

        bugsToReturn = bugsToReturn.filter(bug => bug.labels?.includes(filterBy.label))
    }
    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.severity)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    if (filterBy.sortBy === 'severity') { //numeric
        bugsToReturn.sort((b1, b2) => (b1.severity - b2.severity) * filterBy.sortDir)
    }
    if (filterBy.sortBy === 'createdAt') { //numeric
        bugsToReturn.sort((b1, b2) => (b1.createdAt - b2.createdAt) * filterBy.sortDir)
    }
    if (filterBy.sortBy === 'title') { //abc
        bugsToReturn.sort((b1, b2) => (b1.title.localeCompare(b2.title) * filterBy.sortDir))
    }
    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')

    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}