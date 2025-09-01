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
    const dispatch = useDispatch()
    const anecdotes = useSelector(({anecdotes, filter}) => {
        return anecdotes
            .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => b.votes - a.votes)
    })

    return(
        <div>
            {anecdotes.map(a => (
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