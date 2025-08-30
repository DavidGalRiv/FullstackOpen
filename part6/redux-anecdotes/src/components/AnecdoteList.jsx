import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, onVote }) => (
    <div>
        <div>{anecdote.content}</div>
        <div>
            has {anecdote.votes} <button onClick={onVote}>vote</button>
        </div>
    </div>
)

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const sorted = [...anecdotes].sort((a, b) => b.votes- a.votes)

    return(
        <div>
            {sorted.map(a => (
                <Anecdote
                    key={a.id}
                    anecdote={a}
                    onVote={() => dispatch(voteAnecdote(a.id))}
                />
            ))}
        </div>
    )
}

export default AnecdoteList