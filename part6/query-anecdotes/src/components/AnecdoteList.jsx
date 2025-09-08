import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from '../services/anecdotes'


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

    const { data: anecdotes, isLoading, isError } = useQuery({
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
      retry: 1,
    })
    
    const voteMutation = useMutation({
        mutationFn: updateVote,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
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