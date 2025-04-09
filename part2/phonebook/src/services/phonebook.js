import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

const create = newContact => {
  const request = axios.post(baseUrl, newContact)
  return request.then(response => response.data)
}

const update = (contactId, updatedContact) => {
  const request = axios.put(`${baseUrl}/${contactId}`, updatedContact)
  return request.then(response => response.data)
}

const remove = (contactId) => {
  const request = axios.delete(`${baseUrl}/${contactId}`)
  return request.then(response => response.data)
}


export default { getAll, create, update, remove }