import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import About from './components.jsx/About'
import AnecdoteList from './components.jsx/AnecdoteList'
import CreateNew from './components.jsx/CreateNew'
import Footer from './components.jsx/Footer'
import Menu from './components.jsx/Menu'
import Anecdote from './components.jsx/Anecdote'
import Notification from './components.jsx/Notification'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    setNotification(`a new anecdote "${anecdote.content}" created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification message={notification}/>

        <Routes>
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />}/> 
          <Route path="/anecdotes" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </div>
  )
}

export default App
