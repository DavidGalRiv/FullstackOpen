import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload) 
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id !== updated.id ? a : updated)
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdotesSlice.actions

export const initializeAnecdotes = () => async dispatch => {
  const anecdotes = await anecdoteService.getAll()
  dispatch(setAnecdotes(anecdotes))
}

export const createAnecdote = (content) => async dispatch => {
  const newAnecdote = await anecdoteService.createNew(content)
  dispatch(appendAnecdote(newAnecdote))
}

export const voteAnecdote = (anecdote) => async dispatch => {
  const updated = await anecdoteService.updateVote(anecdote)
  dispatch(updateAnecdote(updated))
}

export default anecdotesSlice.reducer
