import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, onVote }) => (
    <div>
        <div>{anecdote.content}</div>
        <div>
            has {anecdote.votes} <button onClick={onVote}>vote</button>
        </div>
    </div>
)

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ anecdotes, filter }) => {
        return [...anecdotes]
            .filter(a => {
            return a.content.toLowerCase().includes(filter.toLowerCase())
            })
            .sort((a, b) => b.votes - a.votes)
    })

    const handleVote = (a) => {
        dispatch(voteAnecdote(a))
        dispatch(setNotification(`You voted for '${a.content}'`, 5))
    }

    return(
        <div>
            {anecdotes.map(a => (
                <Anecdote
                    key={a.id}
                    anecdote={a}
                    onVote={() => handleVote(a)}
                />
            ))}
        </div>
    )
}

export default AnecdoteList