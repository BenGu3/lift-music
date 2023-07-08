import debounce from 'lodash/debounce'
import { FC, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { SkipNext } from '@mui/icons-material'

import * as api from '../../api'
import spotifyApi from '../../api/spotify.ts'
import SpotifyPlayer from '../../components/player'
import ArtistSearch from '../../components/artist-search'

import './index.css'
import { useInterval } from '../../hooks/useInterval.ts'
import { useQueue } from '../../hooks/useQueue.ts'

type Props = {
  me: SpotifyApi.CurrentUsersProfileResponse
}

const MAX_QUEUE_LENGTH = 10

const Home: FC<Props> = () => {
  const [selectedArtist, setSelectedArtist] = useState<SpotifyApi.ArtistObjectFull | null>(null)
  const [trackUriQueue, trackUriQueueActions] = useQueue<string>()
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  useInterval(async () => {
    if (selectedArtist && trackUriQueue.length < MAX_QUEUE_LENGTH) {
      const uris = await api.gather(selectedArtist)
      trackUriQueueActions.push(uris)
    }
  }, 5000)

  const queryArtist = async (query: string): Promise<SpotifyApi.ArtistObjectFull[]> => {
    const queryResults = await spotifyApi.searchArtists(query)
    return queryResults.artists.items
  }

  const debouncedQueryArtist = debounce((searchTerm, callback) => {
    queryArtist(searchTerm)
      .then((result) => callback(result))
      .catch((error) => callback(error))
  }, 350)

  const handleQueryChange = async (selectedArtist: SpotifyApi.ArtistObjectFull) => {
    const uris = await api.gather(selectedArtist)
    const firstUri = uris.pop()

    setSelectedArtist(selectedArtist)
    setCurrentlyPlaying(firstUri ?? null)
    trackUriQueueActions.clear()
    trackUriQueueActions.push(uris)
  }

  const handleNextClick = () => {
    const nextUri = trackUriQueueActions.pop()
    setCurrentlyPlaying(nextUri)
  }

  return (
    <div className='main-container'>
      <div className='container'>
        <ArtistSearch onChange={handleQueryChange} loadArtists={debouncedQueryArtist}/>
        {
          selectedArtist
          && <Typography variant="h4">{ selectedArtist.name }</Typography>
        }
        <SpotifyPlayer uri={currentlyPlaying}/>
        {
          selectedArtist
          && <IconButton onClick={handleNextClick}><SkipNext /></IconButton>
        }
      </div>
    </div>
  )
}

export default Home
