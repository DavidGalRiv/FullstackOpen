function Filter({ value, onChange }) {
    return (
      <label>
        Find countries:{" "}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="e.g. Spain"
        />
      </label>
    )
  }
  
  export default Filter
  