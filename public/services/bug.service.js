
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
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
      
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
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
