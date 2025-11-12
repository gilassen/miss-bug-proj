
import { useState } from 'react'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

async function loadBug() {
    try {
        const data = await bugService.getById(bugId)
        setBug(data.bug)  
    } catch (err) {
        if (err.message && err.message.includes('Cannot view more than 3 bugs')) {
            showErrorMsg('Wait for a bit - you viewed 3 bugs already!')
        } else {
            showErrorMsg('Cannot load bug')
        }
    }
}

    if (!bug) return <h1>loadings....</h1>
    return <div className="bug-details main-layout">
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <p>Description: {bug.description || 'No description'}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

