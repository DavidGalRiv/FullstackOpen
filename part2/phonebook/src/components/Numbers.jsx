const DeleteButton = ({onClickHandle}) => {
    return(
        <button onClick={onClickHandle}>Delete</button>
    )
}

const Numbers = ({persons, deletePerson}) => (
    <ul>
        {persons.map(person => (
            <li key={person.id}>
               Name: {person.name} Phone: {person.number} <DeleteButton onClickHandle={deletePerson(person.id)}/>
            </li>
        ))}
    </ul>
)

export default Numbers