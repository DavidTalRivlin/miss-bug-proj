
import { utilService } from './util.service.js'



const BASE_URL = '/api/bug/'
// _createBugs()

export const bugService = {
    query,
    get,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function get(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
}

function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&description=${bug.description}&severity=${+bug.severity}`
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams)
}




function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                discribtion: "lolo",
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                discribtion: "lola",
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                discribtion: "lolo123123",
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                discribtion: "popopop",
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
