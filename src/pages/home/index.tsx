import debounce from 'lodash/debounce'
import { FC, useState } from 'react'

import * as api from '../../api'
import spotifyApi from '../../api/spotify.ts'
import SpotifyPlayer from '../../components/player'
import ArtistSearch from '../../components/artist-search'
import { useInterval } from '../../hooks/useInterval.ts'
import { useFIFOQueue, useLIFOQueue } from '../../hooks/useQueue.ts'

import * as css from './index.css'

const MAX_QUEUE_LENGTH = 10

const Home: FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<SpotifyApi.ArtistObjectFull | null>(null)
  const [nextTrackQueue, nextTrackQueueActions] = useFIFOQueue<string>()
  const [prevTrackQueue, prevTrackQueueActions] = useLIFOQueue<string>()
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  useInterval(async () => {
    if (selectedArtist && nextTrackQueue.length < MAX_QUEUE_LENGTH) {
      const uris = await api.gather(selectedArtist)
      nextTrackQueueActions.back(uris)
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
    prevTrackQueueActions.clear()
    nextTrackQueueActions.clear()
    nextTrackQueueActions.back(uris)
  }

  const handlePrevClick = () => {
    const trackUri = prevTrackQueueActions.pop()
    currentlyPlaying && nextTrackQueueActions.front(currentlyPlaying)
    setCurrentlyPlaying(trackUri)
  }

  const handleNextClick = () => {
    const trackUri = nextTrackQueueActions.pop()
    currentlyPlaying && prevTrackQueueActions.front(currentlyPlaying)
    setCurrentlyPlaying(trackUri)
  }

  return (
    <div className={css.mainContainer}>
      <div className={css.container}>
        <ArtistSearch onChange={handleQueryChange} loadArtists={debouncedQueryArtist}/>
        <SpotifyPlayer
          title={selectedArtist?.name ?? null}
          uri={currentlyPlaying}
          hasPreviousTracks={!!prevTrackQueue.length}
          hasNextTracks={!!nextTrackQueue.length}
          onPreviousClick={handlePrevClick}
          onNextClick={handleNextClick}
        />
      </div>
    </div>
  )
}

export default Home
