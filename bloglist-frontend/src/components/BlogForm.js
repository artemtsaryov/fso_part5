import { useState } from 'react'

const BlogForm = ({ handleCreateNew }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onBlogFormSubmit = (event) => {
    event.preventDefault()

    handleCreateNew({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onBlogFormSubmit}>
        <div>
          title:
          <input type='text' name='title' value={title} placeholder="type blog title here" onChange={({ target }) => setTitle(target.value)}></input>
        </div>
        <div>
          author:
          <input type='text' name='author' value={author} placeholder="type blog author here" onChange={({ target }) => setAuthor(target.value)}></input>
        </div>
        <div>
          url:
          <input type='text' name='url' value={url} placeholder="type blog url here" onChange={({ target }) => setUrl(target.value)}></input>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm