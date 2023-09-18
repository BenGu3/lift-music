import { FC } from 'react'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { css } from '../../../styled-system/css'

type AlbumHeaderProps = {
  album?: SpotifyApi.AlbumObjectFull
}

const AlbumHeader: FC<AlbumHeaderProps> = props => {
  const { album } = props

  const renderAlbumHeader = (album: SpotifyApi.AlbumObjectFull) => {
    const { url: albumImage, width: albumImageWidth, height: albumImageHeight } = album.images[1]

    return (
      <>
        <img src={albumImage} width={albumImageWidth} height={albumImageHeight} alt={album.name}/>
        <div className={albumInfoStyles}>
          <Typography variant="h3" className={titleContainerStyles}>{album.name}</Typography>
          <Typography variant="subtitle1">
            <Link to={`/artist/${album.artists[0].id}`} className={linkStyles}>
            {album.artists[0].name}
            </Link>
          </Typography>
        </div>
      </>
    )
  }

  const renderNoAlbum = () => <span>No album 😭</span>

  return (
    <div className={containerStyles}>
      {
        album
          ? renderAlbumHeader(album)
          : renderNoAlbum()
      }
    </div>
  )
}

export default AlbumHeader

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

const albumInfoStyles = css({
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

const linkStyles = css({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
})
