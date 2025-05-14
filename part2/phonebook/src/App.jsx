import { useState, useEffect } from "react"
import phoneBookService from "./services/phonebook"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Numbers from "./components/Numbers"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [notification, setNotification] = useState({ text: null, type: "" })

  useEffect(() => {
    phoneBookService.getAll()
      .then(setPersons)
      .catch(error => {
        setNotification({ text: `Server not found, please check again the url\nerror ${error}`, type: "error" })
        setTimeout(() => setNotification({ text: null, type: "" }), 5000)
      })
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleSearchChange = (e) => setSearch(e.target.value)

  const submitHandler = (event) => {
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
      addPerson()
    }
  }

  const addPerson = () => {
    const personObject = {
      name: newName,
      number: newNumber
    }

    phoneBookService.create(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
        setNotification({ 
          text: `${newPerson.name} added to the phonebook`, 
          type: "success" 
        })
        setTimeout(() => setNotification({ 
          text: null, 
          type: "" 
        }), 5000)
      })
      .catch(error => {
        const errorMessage = error.response?.data?.error || "Something went wrong"
        setNotification({
            text: errorMessage,
            type: "error" 
          })
        setTimeout(() => setNotification({ 
          text: null, 
          type: "" 
        }), 5000)
      })
  }

  const updatePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    if (newNumber === "") {
      alert("Please enter a new number.")
      return
    }

    if (persons.find(p => p.number === newNumber)) {
      alert("That number is already in use.")
      return
    }

    if (confirm(`Do you want to update ${person.name}'s number?`)) {
      const updated = { ...person, number: newNumber }

      phoneBookService.update(id, updated)
        .then(response => {
          setPersons(persons.map(p => p.id === id ? response : p))
          setNewName('')
          setNewNumber('')
          setNotification({ 
            text: `${response.name}'s number updated to ${response.number}`, 
            type: "update" 
          })
          setTimeout(() => setNotification({ 
            text: null, 
            type: "" 
          }), 5000)
        })
        .catch(error => {
          if(error.response && error.response.status === 404){
            setNotification({ 
              text: `Information of ${person.name} doesn't exists in the server anymore`, 
              type: "error" 
            })
            setPersons(persons.filter(p => p.id !== id))
          }else{
            const errorMessage = error.response?.data?.error || "Could not update"
            setNotification({
              text: errorMessage,
              type: "error"
            })
            setTimeout(() => setNotification({ 
              text: null,
               type: "" 
              }), 5000)
          }
        })
    }
  }

  const deletePerson = (id) => {
    return () => {
      const person = persons.find(p => p.id === id)
      if (!person) return

      if (confirm(`Are you sure you want to delete ${person.name}?`)) {
        phoneBookService.remove(id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== id))
            setNotification({ 
              text: `${person.name} was deleted from phonebook`, 
              type: "error" 
            })
            setTimeout(() => setNotification({ 
              text: null, 
              type: "" 
            }), 5000)
          })
          .catch(error => {
            if(error.response && error.response.status === 404){
              setNotification({ 
                text: `Information of ${person.name} doesn't exists in the server anymore`, 
                type: "error" 
              })
              setPersons(persons.filter(p => p.id !== id))
            }else{
              setNotification({
                text: `Could not updated: ${error}`,
                type: "error"
              })
              setTimeout(() => setNotification({ 
                text: null,
                 type: "" 
                }), 5000)
            }
          })
      }
    }
  }

  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification?.text} type={notification?.type} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h3>Add a new contact</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={submitHandler}
      />
      <h3>Numbers</h3>
      <Numbers persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
