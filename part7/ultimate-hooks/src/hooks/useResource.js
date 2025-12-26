import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // fetch all resources once
  useEffect(() => {
    const fetchAll = async () => {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    }
    fetchAll()
  }, [baseUrl])

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject)
    setResources(resources.concat(response.data))
    return response.data
  }

  const service = {
    create
  }

  return [resources, service]
}

export default useResource
