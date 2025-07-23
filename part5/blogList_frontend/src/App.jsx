/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginFrom from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

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

  const createBlog = async (blogObject) => {
    try{
      const createdBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => [createdBlog, ...prevBlogs])
      notify(`Blog "${createdBlog.title}" by ${createBlog.author} added`)
    } catch (error){
      console.error('Error creating blog:', error)
      notify('Error creating blog', 'error')
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
      <BlogForm createBlog = {createBlog} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App