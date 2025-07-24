/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginFrom from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
  if (user) {
    blogService.setToken(user.token)
    blogService.getAll().then(blogs => {
      console.log('blogs fetched:', blogs)
      setBlogs(blogs)
    })
  }
}, [user])



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const notify = (message, type = 'success') => {
  setNotification({ message, type })
  setTimeout(() => {
    setNotification(null)
  }, 5000)
}
  const handleLogin = async ({ username, password }) => {      
    try {
      const user = await loginService.login({
        username, password,
      })
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      console.log('logged in user:', user)
      notify(`Welcome, ${user.name}`)
    } catch (exception) {
      notify('Wrong username or password', 'error') 
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    notify("Logged out")
  }

  const blogFormRef = useRef()

  const createBlog = async (blogObject) => {
    try{
      const createdBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => [createdBlog, ...prevBlogs])
      notify(`Blog "${createdBlog.title}" by ${createdBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (error){
      console.error('Error creating blog:', error)
      notify('Error creating blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    try{
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user,
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? {...returnedBlog, user: blog.user} : b))
    }catch(error){
      console.error('Error updating blog:', error)
      notify('Error updating blog', 'error')
    }
  }

  const handleDelete = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if(!ok) return

    try{
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      notify(`Blog ${blog.title} has been removed`)
    }catch(error){
      console.error('Error removing blog:', error)
      notify('Error remoiving blog', 'error')
    }
  }

  if(!user){
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <LoginFrom handleLogin = {handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged in</p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>      
      <button onClick={handleLogout}>Logout</button>
      {[...blogs].sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} onLike={handleLike} handleDelete={handleDelete}/>
      )}
    </div>
  )
}

export default App