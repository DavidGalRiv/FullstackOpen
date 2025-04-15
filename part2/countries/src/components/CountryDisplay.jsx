import CountryList from './CountryList'
import CountryDetails from './CountryDetails'

function CountryDisplay({ filter, filtered, selectedCountry, onSelectCountry, onBack }) {
  if (!filter) return null

  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} onBack={onBack} />
  }

  if (filtered.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filtered.length > 1) {
    return <CountryList countries={filtered} onShowCountry={onSelectCountry} />
  }

  if (filtered.length === 1) {
    return <CountryDetails country={filtered[0]} />
  }

  return <p>No matches found</p>
}

export default CountryDisplay
