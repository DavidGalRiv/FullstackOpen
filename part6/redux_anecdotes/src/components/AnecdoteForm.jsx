import { useDispatch } from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()
        const content = e.target.anecdote.value.trim()
        if(!content) return
        dispatch(createAnecdote(content))
        e.target.anecdote.value = ''
    }

    return (
        <div>
            <h2>Create form</h2>
            <form onSubmit={onSubmit}>
                <div><input name='anecdote' /></div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm