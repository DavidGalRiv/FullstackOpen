const Filter = ({search, handleSearchChange}) => (
    <div>
        Filter shown with: <input value = {search} onChange = {handleSearchChange} />
    </div>
)

export default Filter