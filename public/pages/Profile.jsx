import { BugList } from "../cmps/BugList"
import { userService } from "../services/user.service.js"

export function Profile() {

    getUser()

    function getUser() {
        const {fullname} = userService.getLoggedinUser()
        console.log('fullname', fullname)
        return fullname
    }

    return (
        <section>
            <h1>Hello {getUser()} </h1>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} /> 
           
        </section>
    )

}

 // bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} 