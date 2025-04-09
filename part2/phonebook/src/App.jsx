import {useState, useEffect } from "react"
import phoneBookService from "./services/phonebook"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Numbers from "./components/Numbers"

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber,setNewNumber] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    phoneBookService.getAll()
    .then(persons => setPersons(persons))
    .catch(error => alert(`Server not found, please check again the url\nerror ${error}`))
  }, [])
  
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
    if(persons.reduce((found, person) => {
      return found || person.name == newName
    },false
    )){
      let personId = persons.find(person => person.name === newName).id
      updatePerson(personId)
    }else if(persons.reduce((found, person) => {
      return found || person.number == newNumber
    },false
    )){
      alert("The phone number is already in the phonebook")
    }else if(newName === "" || newNumber === ""){
      alert("Please complete both the person's name and phone number before proceeding")
    }else{
      const personObject = {
        name: newName,
        number: newNumber
      }
      phoneBookService.create(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName("")
        setNewNumber("")
      })
      .catch(error => alert(`Something went wrong: (\nerror: ${error})`))
    }
  }

  const updatePerson = (personId) => {
    if (newNumber !== "" && !persons.reduce((found, person) => {
      return found || person.number === newNumber
    }, false)) {    
      const oldPerson = persons.find(person => person.id === personId)
      if(confirm(`Do you want to update ${oldPerson.name}'s number?`)){
        const updatedPerson = {... oldPerson, number: newNumber}
        phoneBookService.update(personId, updatedPerson)
        .then(response => {
          setPersons(persons.map(person => person.id === personId ? updatedPerson : person ))
        })
        .catch(error => alert(`Person could not be found in server\nerror: ${error}`))
      }
    } else if(newNumber === ""){
      alert("Please complete both the person's name and phone number before proceeding")
    }else{
      alert("Phone already in the phonebook")
    }
  }

  const deletePerson = (personId) => {
    return() => {
      if(confirm("Are you sure you want to delete this person?")){
        phoneBookService.remove(personId)
        .then(response => {
          setPersons(persons.filter(person => person.id != personId))
        })
        .catch(error => alert(`Person could not be found in server\nerror: ${error}`))      }
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search = {search}  handleSearchChange={handleSearchChange} />

      <h3> Add a new contact </h3>
      <PersonForm
        newName = {newName}
        newNumber = {newNumber}
        handleNameChange = {handleNameChange}
        handleNumberChange = {handleNumberChange}
        addPerson = {addPerson}
      />
      
      <h3>Numbers</h3>
      <Numbers persons = {filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App