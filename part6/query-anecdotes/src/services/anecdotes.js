import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createAnecdote = async (content) => {
  if(content.length < 5){
    throw new Error('Anecdote too short, must be 5 chars or more')
  }
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  console.log('Saved anecdote:', response.data)
  return response.data
}

export const updateVote = async (anecdote) => {
  const updated = {...anecdote, votes: anecdote.votes + 1}
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, updated)
  return response.data
}