import { useEffect, useState } from 'react'
import countryService from './services/countryService'
import Filter from './components/Filter'
import CountryDisplay from './components/CountryDisplay'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll().then(setCountries)
  }, [])

  const handleChange = (e) => {
    setFilter(e.target.value)
    setSelectedCountry(null)
  }

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <Filter value={filter} onChange={handleChange} />
      <CountryDisplay
        filter={filter}
        filtered={filtered}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onBack={() => setSelectedCountry(null)}
      />
    </div>
  )
}

export default App
