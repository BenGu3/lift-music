import SpotifyWebApi from 'spotify-web-api-js'

let spotifyApi: SpotifyWebApi.SpotifyWebApiJs

const getSpotifyApi = () => {
  if (!spotifyApi)
    spotifyApi = new SpotifyWebApi()

  return spotifyApi
}

export default getSpotifyApi()
