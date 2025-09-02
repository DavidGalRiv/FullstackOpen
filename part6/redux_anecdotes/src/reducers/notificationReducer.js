import { createSlice } from '@reduxjs/toolkit'

let timeoutId

const slice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        show: (_state, action) => action.payload,
        clear: () => ''
    }
})

export const {show, clear} = slice.actions

export const setNotification = (message, seconds = 5) => dispatch => {
    dispatch(show(message))
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => dispatch(clear()), seconds * 1000)
}

export default slice.reducer