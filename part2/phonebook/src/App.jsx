import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.some(person => person.name === newName)){
      alert(`${newName} is already added to the phonebook`)
      return
    }
    const newPerson = {name: newName, number: newNumber}
    setPersons([...persons, newPerson])
    setNewName('')
    setNewNumber('')
  }
  
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Filter shown with: <input value = {search} onChange = {handleSearchChange} />
      </div>

      <h3> Add a new contact </h3>
      <form onSubmit = {addPerson}>
        <div>
          name: <input value = {newName} onChange = {handleNameChange}/>
        </div>
        <div>
          number: <input value = {newNumber} onChange = {handleNumberChange}/>
        </div>
        <div>
          <button type="submit"> add </button>
        </div>
      </form>
      
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map((person, index) => (
          <li key = {index}>{person.name} {person.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App