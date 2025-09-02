import { configureStore } from '@reduxjs/toolkit'
import anecdotes from './reducers/anecdoteReducer'
import filter from './reducers/filterReducer'
import notification from './reducers/notificationReducer'

const store = configureStore({
  reducer: { 
    anecdotes, 
    filter, 
    notification 
  },
})

export default store
