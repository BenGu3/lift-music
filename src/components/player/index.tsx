import * as React from 'react'

export default function SpotifyPlayer(props: SpotifyPlayerProps) {
  return (
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
}

interface SpotifyPlayerProps {
  uri: string,
}
