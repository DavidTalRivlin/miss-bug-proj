import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState('')
    const [sortDir, setSortDir] = useState(null)
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy, sortDir])

    function loadBugs() {
        bugService.query(filterBy, sortBy, sortDir)
            .then(bugs => setBugs(bugs))
            .catch(err => console.log('err:', err))
    }


    function onChangePageIdx(diff) {
        if (isUndefined(filterBy.pageIdx)) return
        setFilterBy(prevFilter => {
            let newPageIdx = prevFilter.pageIdx + diff
            if (newPageIdx < 0) newPageIdx = 0
            return { ...prevFilter, pageIdx: newPageIdx }
        })
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => {
            return {
                ...prevFilter,
                pageIdx: isUndefined(prevFilter.pageIdx) ? 0 : undefined
            }
        })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('bug describtion?'),
            creator: userService.getLoggedinUser()


        }
        bugService.save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const title = prompt('Bug title?')
        const bugToSave = { ...bug, severity, title }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }


    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onSetFilter(filterBy) {
        console.log('filterBy', filterBy)
        setFilterBy(prevFilter => ({
            ...prevFilter,
            ...filterBy,
            pageIdx: isUndefined(prevFilter.pageIdx) ? undefined : 0
        }))
    }


    function isUndefined(value) {
        return value === undefined
    }


    function onSetSortBy(sortKey) {
        setSortBy(sortKey)
    }

    function onSetSortDir(dir) {
        setSortDir(dir)
    }


    const { txt, label, severity, pageIdx } = filterBy

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <BugFilter filterBy={{ txt, severity, label }} onSetFilter={debounceOnSetFilter.current}  onSetSortBy={onSetSortBy} onSetSortDir={onSetSortDir} sortBy={sortBy} sortDir={sortDir}/>

                <section className="pagination">
                    <button onClick={() => onChangePageIdx(1)}>+</button>
                    {pageIdx + 1 || 'No Pagination'}
                    <button onClick={() => onChangePageIdx(-1)} >-</button>
                    <button onClick={onTogglePagination}>Toggle pagination</button>
            
   
                </section>
            
            </main>
        </main>
    )
}
