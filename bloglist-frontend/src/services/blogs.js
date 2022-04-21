import axios from 'axios'
const baseUrl = '/api/blogs'

let AUTH_TOKEN = null
const setToken = token => {
  AUTH_TOKEN = `bearer ${token}`
}

const getAll = () => {
  const request = axios.get(baseUrl, { headers: { Authorization: AUTH_TOKEN } })
  return request.then(response => response.data)
}

const create = (blog) => {
  const request = axios.post(baseUrl, blog, { headers: { Authorization: AUTH_TOKEN } })
  return request.then(response => response.data)
}

const addLike = (blog) => {
  const request = axios.put(`${baseUrl}/${blog.id}`, {
    user: blog.user.id,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }, { headers: { Authorization: AUTH_TOKEN } })
  return request.then(response => response.data)
}

const remove = (blog) => {
  const request = axios.delete(`${baseUrl}/${blog.id}`, { headers: { Authorization: AUTH_TOKEN } })
  return request.then(response => response.data)
}

const exportedApi = { setToken,  getAll, create, addLike, remove }

export default exportedApi