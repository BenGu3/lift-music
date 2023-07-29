import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import spotifyApi from '../../api/spotify.ts'
import { css } from '../../../styled-system/css'
import TrackHeader from './header'
import TrackContent from './content'

const TrackPage: FC = () => {
  const { trackId } = useParams()
  const [track, setTrack] = useState<SpotifyApi.TrackObjectFull>()
  const [audioFeatures, setAudioFeatures] = useState<SpotifyApi.AudioFeaturesObject>()

  useEffect(() => {
    if (!trackId) return

    spotifyApi.getTrack(trackId).then(track => setTrack(track))
    spotifyApi.getAudioFeaturesForTrack(trackId).then(audioFeatures => setAudioFeatures(audioFeatures))
  }, [trackId])

  if (!track)
    return <div>Nothing here :sad:</div>

  return (
    <div className={containerStyles}>
      <TrackHeader track={track} />
      <TrackContent audioFeatures={audioFeatures} />
    </div>
  )
}

export default TrackPage

const containerStyles = css({
  backgroundColor: '#125ec8'
})
