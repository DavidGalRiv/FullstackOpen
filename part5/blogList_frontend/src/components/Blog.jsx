import { useState } from 'react'

const Blog = ({ blog, user, onLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDeleteButton = blog.user?.username === user?.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick = {toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick = {() => onLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          { showDeleteButton && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
  </div>
)}

export default Blog