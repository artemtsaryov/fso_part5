import { useState } from 'react'

const Blog = (props) => {
  const [visible, setVisible] = useState(false)

  const blog = props.blog

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style = {blogStyle}>
      <div className='blog-header'>
        {blog.title} {blog.author}
        <button onClick = {() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className='blog-body' style = {{ display: (visible ? '' : 'none') }}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick = {() => { props.handleLike(blog) }}>like</button>
        </div>
        <div>
          {blog.author}
        </div>
        {
          props.handleRemove && <button onClick = {() => { props.handleRemove(blog) }}>remove</button>
        }
      </div>
    </div>
  )
}

export default Blog