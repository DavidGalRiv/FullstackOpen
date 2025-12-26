import { useState } from 'react'
import useCountry from './hooks/useCountry'

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  const data = country.data

  return (
    <div>
      <h3>{data.name.common}</h3>
      <div>capital {data.capital}</div>
      <div>population {data.population}</div>
      <img
        src={data.flags.png}
        height="100"
        alt={`flag of ${data.name.common}`}
      />
    </div>
  )
}

const App = () => {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')

  const country = useCountry(search)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearch(name)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
