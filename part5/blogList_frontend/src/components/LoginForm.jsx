import { useState } from "react"
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = (event) => {
        event.preventDefault()
        handleLogin({ username, password })
        setUsername('')
        setPassword('')
    }

    return(
        <form onSubmit = {onSubmit}>
            <div>
                username
                <input 
                    data-testid='username'
                    type = "text"
                    value = {username}
                    name = "Username"
                    onChange = {({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    data-testid='password'
                    type = "password"
                    value = {password}
                    name = "Password"
                    onChange = {({target}) => setPassword(target.value)}
                />
            </div>
            <button type = "submit">Login</button>
        </form>
    )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm