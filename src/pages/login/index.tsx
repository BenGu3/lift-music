import Button from '@mui/material/Button'

import './index.css'

function handleLogin() {
  const url = 'https://accounts.spotify.com/authorize?response_type=token'
    + '&client_id=' + encodeURIComponent(import.meta.env.VITE_SPOTIFY_CLIENT_ID)
    + '&scope=' + encodeURIComponent(import.meta.env.VITE_SPOTIFY_API_SCOPE)
    + '&redirect_uri=' + encodeURIComponent(import.meta.env.VITE_REDIRECT_URI)

  window.location.href = url}


export default function Login() {
  return (
    <div className='header-container'>
      <div className='lift-intro-container'>
        <span className='login-lift-motto'>search your favorite artists.</span>
        <span className='login-lift-motto'>access a curated playlist.</span>
        <span className='login-lift-motto'>listen to uplifting music.</span>
        <span className='login-lift-title'>welcome to lift.</span>
      </div>
      <Button variant='contained' color='primary' className='login-button' onClick={handleLogin}>
        Login with Spotify
      </Button>
    </div>
  )
}
