import './index.css'

type SpotifyPlayerProps = {
  uri: string,
}

const getUrlFromUri = (uri: string): string => {
  const [_, type, id] = uri.split(':')
  return `https://open.spotify.com/embed/${type}/${id}`
}

const SpotifyPlayer = (props: SpotifyPlayerProps) =>
  <iframe
    title="Spotify Player"
    className="player"
    src={getUrlFromUri(props.uri)}
  />
export default SpotifyPlayer

