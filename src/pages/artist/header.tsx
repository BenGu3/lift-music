import { FC } from 'react'
import { Typography } from '@mui/material'

import { css } from '../../../styled-system/css'

type ArtistHeaderProps = {
  artist?: SpotifyApi.ArtistObjectFull
}

const ArtistHeader: FC<ArtistHeaderProps> = props => {
  const { artist } = props

  const renderArtistHeader = (artist: SpotifyApi.ArtistObjectFull) => {
    const { url: artistImage, width: artistImageWidth, height: artistImageHeight } = artist.images[1]

    return (
      <>
        <img src={artistImage} width={artistImageWidth} height={artistImageHeight} alt={artist.name}/>
        <div className={artistInfoStyles}>
          <Typography variant="h3" className={titleContainerStyles}>{artist.name}</Typography>
        </div>
      </>
    )
  }

  const renderNoTrack = () => <span>No artist 😭</span>

  return (
    <div className={containerStyles}>
      {
        artist
          ? renderArtistHeader(artist)
          : renderNoTrack()
      }
    </div>
  )
}

export default ArtistHeader

const containerStyles = css({
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  display: 'flex',
  background: 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%)',

  md: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: '40px',
  },
})

const artistInfoStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  md: {
    alignItems: 'start',
    marginLeft: '20px'
  },
})

const titleContainerStyles = css({
  padding: '8px 0',
  textAlign: 'center',

  md: {
    textAlign: 'unset'
  }
})
