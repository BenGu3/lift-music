type SpotifyPlayerProps = {
  uri: string,
}

const SpotifyPlayer = (props: SpotifyPlayerProps) => (
  <iframe
    title='Spotify'
    className='SpotifyPlayer'
    src={`https://embed.spotify.com/?uri=${props.uri}&view=list&theme=black`}
    width='100%'
    height='700px'
    frameBorder='0'
    allowTransparency
  />
)
export default SpotifyPlayer

