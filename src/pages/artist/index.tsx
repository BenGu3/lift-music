import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import spotifyApi from '../../api/spotify.ts'
import { css } from '../../../styled-system/css'
import ArtistHeader from './header'
import ArtistContent from './content'

const ArtistPage: FC = () => {
  const { artistId } = useParams()
  const [artist, setArtist] = useState<SpotifyApi.ArtistObjectFull>()
  const [artistAlbums, setArtistAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>()

  useEffect(() => {
    if (!artistId) return

    spotifyApi.getArtist(artistId).then(artist => setArtist(artist))
    spotifyApi.getArtistAlbums(artistId).then(res => setArtistAlbums(res.items))
  }, [artistId])

  return (
    <div className={containerStyles}>
      <ArtistHeader artist={artist} />
      <ArtistContent artistAlbums={artistAlbums} />
    </div>
  )
}

export default ArtistPage

const containerStyles = css({
  backgroundColor: '#125ec8'
})
