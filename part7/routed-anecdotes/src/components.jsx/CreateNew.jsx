import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/index'

// eslint-disable-next-line react/prop-types
const CreateNew = ({ addNew }) => {
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })


    navigate('/anecdotes')
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>

        <div>
          author
          <input {...author} />
        </div>

        <div>
          url for more info
          <input {...info} />
        </div>

        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>

      </form>
    </div>
  )
}

export default CreateNew
