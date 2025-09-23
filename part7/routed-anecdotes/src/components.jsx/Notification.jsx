/* eslint-disable react/prop-types */
const Notification = ({ message }) => {
  if (!message) return null

  const style = {
    border: '1px solid green',
    padding: 10,
    marginBottom: 15
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification