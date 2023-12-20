import { BugPreview } from './BugPreview.jsx'
import { userService } from "../services/user.service.js";

const { Link } = ReactRouterDOM

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    if (!bugs) return <div>Loading...</div>

    const user = userService.getLoggedinUser()

    function isCreator(bug) {
        if (!user) return false
        if (!bug.creator) return true
        return user.isAdmin || bug.creator._id === user._id
    }


    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                    {
                        isCreator(bug) &&
                        <div>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                        </div>
                    }
                </li>
            ))
            }
        </ul >
    )
}
