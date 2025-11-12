import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState({ txt: '', minSeverity: 0 })
    const [viewedCount, setViewedCount] = useState(0)

    useEffect(() => {
        loadBugs()
    }, [filterBy])

useEffect(() => {
  async function loadViewedCount() {
    try {
      const data = await bugService.getCookieCount()
      console.log('Cookie count:', data)
      setViewedCount(data.count)
    } catch (err) {
      console.error('Failed to load viewed count', err)
    }
  }
  loadViewedCount()
}, [])



    async function loadBugs() {
    try {
        const bugs = await bugService.query(filterBy)  
        setBugs(bugs)
    } catch (err) {
        showErrorMsg('Cannot load bugs')
    }
}

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?'),
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs(prevBugs => [...prevBugs, savedBug])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {
            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    function downloadPDF()
    {
        const doc = new jsPDF()

        doc.setFontSize(20)
        doc.text('Bugs Report', 14, 20)
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
    
        const tableData = bugs.map(bug => [
            bug.title,
            bug.severity || 'N/A',
            bug.description || 'No description',
            new Date(bug.createdAt).toLocaleDateString()
        ])

        autoTable(doc, {
            head: [['Title', 'Severity', 'Description', 'Created']],
            body: tableData,
            startY: 40,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [100, 100, 100] }
        })

        doc.save('bugs-report.pdf')
}

    return (
        <section>
            <h3>Bugs App</h3>
            <main>
                <button onClick={onAddBug}>Add Bug ⛏</button>
                <button onClick={downloadPDF}>Download PDF 📄</button>
                <p>Viewed {viewedCount} / 3 bugs</p>
                <BugFilter filterBy={filterBy} onSetFilter={setFilterBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </section>
    )
}