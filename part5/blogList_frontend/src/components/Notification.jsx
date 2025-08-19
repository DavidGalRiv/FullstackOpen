const Notification = ({ message }) => {
  if (!message) return null

  const style = {
    color: message.type === 'error' ? 'red' : 'green',
    background: message.type === 'error' ? '#f8d7da' : '#d4edda',
    border: `1px solid ${message.type === 'error' ? 'red' : 'green'}`,
    padding: '10px',
    marginBottom: '1rem',
    borderRadius: '4px',
  }

  return (
    <div
      data-testid={message.type} 
      style={style}
    >
      {message.message}
    </div>
  )
}

export default Notification
