function CountryDetails({ country, onBack }) {
    return (
      <div>
        {onBack && <button onClick={onBack}>← Back</button>}
  
        <h2>{country.name.common}</h2>  
        <p>Capital: {country.capital?.[0]}</p>
        <p>Area: {country.area} km²</p>
  
        <h4>Languages:</h4>
        <ul>
          {Object.values(country.languages || {}).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
  
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      </div>
    )
  }
  
  export default CountryDetails
  