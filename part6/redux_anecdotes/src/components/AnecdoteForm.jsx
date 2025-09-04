import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (!content) return
    e.target.anecdote.value = ''

    dispatch(createAnecdote(content))
    dispatch(setNotification(`You created '${content}'`, 5))
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={onSubmit}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
