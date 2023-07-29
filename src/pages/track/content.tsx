import { FC } from 'react'
import { Box, Grid, Slider, Typography } from '@mui/material'
import capitalize from 'lodash/capitalize'

import { css } from '../../../styled-system/css'

type TrackHeaderProps = {
  audioFeatures?: SpotifyApi.AudioFeaturesObject
}

const TrackContent: FC<TrackHeaderProps> = props => {
  const { audioFeatures } = props

  const renderSlider = (title: string, value: number) => {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography id="input-slider" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              disabled
              size='small'
              step={0.1}
              value={value}
              min={0}
              max={1}
              aria-labelledby="input-slider"
            />
          </Grid>
        </Grid>
      </Box>
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

  if (!audioFeatures)
    return <span>No audio features 😭</span>

  return (
    <div className={containerStyles}>
      {renderAudioFeatureSliders(audioFeatures)}
    </div>
  )
}

export default TrackContent

const containerStyles = css({
  padding: '32px 40px',
  background: 'linear-gradient(rgba(0, 0, 0, .6) 0, #121212 100%)',
})
