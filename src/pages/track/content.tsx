import { FC } from 'react'
import { Slider, Typography } from '@mui/material'
import capitalize from 'lodash/capitalize'

import { css } from '../../../styled-system/css'

type TrackHeaderProps = {
  audioFeatures?: SpotifyApi.AudioFeaturesObject
}

const TrackContent: FC<TrackHeaderProps> = props => {
  const { audioFeatures } = props

  const renderSlider = (title: string, value: number) => {
    return (
      <>
        <Typography gutterBottom>{title}</Typography>
        <Slider disabled size="small" value={value} min={0} max={1} aria-labelledby={`${title}-slider`}/>
      </>
    )
  }

  const renderAudioFeatureSliders = (audioFeatures: SpotifyApi.AudioFeaturesObject) => {
    const features: (keyof SpotifyApi.AudioFeaturesObject)[] = [
      'valence',
      'danceability',
      'energy',
      'acousticness',
      'liveness',
    ]

    return features.map(feature => renderSlider(capitalize(feature), audioFeatures[feature] as number))
  }

  const renderNoAudioFeatures = () => <span>No audio features 😭</span>

  return (
    <div className={containerStyles}>
      {
        audioFeatures
          ? renderAudioFeatureSliders(audioFeatures)
          : renderNoAudioFeatures()
      }
    </div>
  )
}

export default TrackContent

const containerStyles = css({
  padding: '32px 40px',
  background: 'linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)',
})
