import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])

  const updateBlogs = (blogs) => {
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  const notify = (text, isError) => {
    setNotifications(currentNotifications => {
      const updatedNotifications = Array.from(currentNotifications)
      updatedNotifications.unshift({
        id: uuidv4(),
        text: text,
        isError: isError || false
      })
      return updatedNotifications
    })

    setTimeout(() => {
      setNotifications(currentNotifications => {
        const updatedNotifications = Array.from(currentNotifications)
        updatedNotifications.pop()
        return updatedNotifications
      })
    }, 5000)
  }

  useEffect(() => {
    const authorizedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (authorizedUserJSON) {
      // This does not mean the token is still valid, it may have expired
      const authorizedUser = JSON.parse(authorizedUserJSON)
      setUser(authorizedUser)
      blogService.setToken(authorizedUser.token)
      blogService.getAll().then(blogs =>
        updateBlogs( blogs )
      )
    }
  }, [])

  const handleLogin = (username, password) => {
    loginService.login(username, password)
      .then((authorizedUser) => {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(authorizedUser))
        setUser(authorizedUser)
        blogService.setToken(authorizedUser.token)
        blogService.getAll().then(blogs =>
          updateBlogs( blogs )
        )
        notify(`${authorizedUser.name} has successfully logged in`)
      })
      .catch((error) => {
        notify(`failed to login as ${username} due to "${error.response.data.error}"`, true)
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const togglableBlogFormRef = useRef()

  const handleCreateNewBlog = (blog) => {
    blogService.create(blog)
      .then((blog) => {
        updateBlogs(blogs.concat(blog))
        notify(`blog ${blog.title} has successfully been added`)
        togglableBlogFormRef.current.close()
      })
      .catch((error) => {
        notify(`failed to add a new blog due to "${error.response.data.error}"`, true)
      })
  }

  const handleLike = (blog) => {
    blogService.addLike(blog)
      .then((blog) => {
        updateBlogs(blogs.map(b => b.id !== blog.id ? b : { ...b, likes: blog.likes }))
        notify(`blog ${blog.title} has received a new like`)
      })
      .catch((error) => {
        notify(`failed to send like to blog due to "${error.response.data.error}"`, true)
      })
  }

  const handleRemove = (blog) => {
    blogService.remove(blog)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`blog ${blog.title} has been removed`)
      })
      .catch((error) => {
        notify(`failed to remove blog due to "${error.response.data.error}"`, true)
      })
  }

  const notificationStack = () => {
    return (
      <div>
        {notifications.map(n =>
          <p className = {'notification ' + (n.isError ? 'error' : 'success')} key={n.id}>{n.text}</p>
        )}
      </div>
    )
  }

  const showLogin = () => {
    return (
      <div>
        <h2>log in to application</h2>
        {notificationStack()}
        <LoginForm handleLogin = {handleLogin} />
      </div>
    )
  }

  const showBlogList = () => {
    return (
      <>
        <div>
          <h2>blogs</h2>
          {notificationStack()}
          {user.name} logged-in
          <button onClick = { handleLogout }>logout</button>
          <Togglable label = 'create new' ref = {togglableBlogFormRef}>
            <BlogForm handleCreateNew = { handleCreateNewBlog } />
          </Togglable>
          {
            blogs.map(blog => {
              const remove = user.username === blog.user.username ? handleRemove : null
              return (<Blog key={blog.id} blog={blog} handleLike = {handleLike} handleRemove = {remove}/>)
            })
          }
        </div>
      </>
    )
  }

  return (
    <div>
      {user ? showBlogList() : showLogin()}
    </div>
  )
}

export default App