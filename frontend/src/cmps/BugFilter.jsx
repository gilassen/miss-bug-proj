export function BugFilter({ filterBy, onSetFilter }) {
  function handleChange({ target }) {
    const { name, value } = target
    onSetFilter({ ...filterBy, [name]: value })
  }

  return (
    <section className="bug-filter">
      <input
        type="text"
        name="txt"
        placeholder="Search bugs..."
        value={filterBy.txt}
        onChange={handleChange}
      />

      <input
        type="number"
        name="minSeverity"
        placeholder="Min severity"
        value={filterBy.minSeverity}
        onChange={handleChange}
      />
    </section>
  )
}
