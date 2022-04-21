import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLoginFormSubmit = (event) => {
    event.preventDefault()

    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={onLoginFormSubmit}>
        <div>
          username
          <input type='text' name='username' value={username} onChange={({ target }) => setUsername(target.value)}></input>
        </div>
        <div>
          password
          <input type='password' name='password' value={password} onChange={({ target }) => setPassword(target.value)}></input>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm