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

const showDeleteButton = 
  (typeof blog.user === 'object' && blog.user?.username === user?.username)
  || blog.user === user?.id

  return (
    <div style={blogStyle} className='blog'>
      <div className='blog-summary' data-testid='blog-item'>
        {blog.title} {blog.author}
        <button onClick = {toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className='blog-details'>
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