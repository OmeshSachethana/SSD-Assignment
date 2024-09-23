import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
import background from './backgroundImage.jpg'
import jwtDecode from 'jwt-decode'
import { login } from '../../services/auth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loginUser = async (e) => {
    e.preventDefault()
    try {
      const userInfo = {
        username,
        password,
      }
      const response = await login(userInfo)

      if (response) {
        localStorage.setItem('accessToken', response.accessToken)
        const decodedToken = jwtDecode(response.accessToken)
        const uid = decodedToken.UserInfo.uid
        localStorage.setItem('uid', uid)
        navigate('/tours')
      } else {
        setError('Please check your username and password')
      }
    } catch (error) {
      setError('Please check your username and password')
      console.error(error)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:2000/api/auth/google' // Adjust to your backend URL
  }

  return (
    <>
      <Layout>
        <div
          style={{
            backgroundImage: `url(${background})`,
            height: '900px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div>
            <center>
              <div className="w-full max-w-xs">
                <h1>
                  <b>Login</b>
                </h1>
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ opacity: 0.6 }} onSubmit={loginUser}>
                  {error && <p className="text-red-500">{error}</p>}
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    required
                  />
                  <br />
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                  <br />
                  <input className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-2 px-3 rounded" type="submit" value="Login" />
                </form>
                <button onClick={handleGoogleLogin} className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                  Sign in with Google
                </button>
              </div>
            </center>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Login
