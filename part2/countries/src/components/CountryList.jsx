function CountryList({countries, onShowCountry}) {
    return (
        <ul>
            {countries.map (c => (
                <li key = {c.cca3}>
                    {c.name.common}
                    <button onClick = {() => onShowCountry(c)}>show</button>
                </li>
            ))}
        </ul>
    )
}

export default CountryList