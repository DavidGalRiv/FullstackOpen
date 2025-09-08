import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from '../services/anecdotes'
import { useNotification } from '../NotificationContext'


const Anecdote = ({anecdote, onVote}) => (
    <div>
      <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes} 
          <button onClick={onVote}>vote</button>
      </div>
    </div>
)

const AnecdoteList = () => {
    const queryClient = useQueryClient()
    const [, dispatch] = useNotification()

    const { data: anecdotes, isLoading, isError } = useQuery({
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
      retry: 1,
    })
    
    const voteMutation = useMutation({
        mutationFn: updateVote,
        onSuccess: (updatedAnecdote) => {
        const anecdotes = queryClient.getQueryData(['anecdotes'])
        queryClient.setQueryData(
          ['anecdotes'],
          anecdotes.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote)
        )
        dispatch({ type: 'SET_NOTIFICATION', payload: `You voted '${updatedAnecdote.content}'` })
        setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
      }
    })

    if(isLoading){
      return <div>loading data...</div>
    }

    if(isError){
      return <div>anecdote service is not available due to problems in server</div>
    }

    const handleVote = (anecdote) => {
      voteMutation.mutate(anecdote)
      console.log('vote')
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