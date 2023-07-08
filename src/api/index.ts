import * as promise from 'bluebird'
import flatten from 'lodash/flatten'
import chunk from 'lodash/chunk'

import spotify from './spotify.ts'

const VALENCE_THRESHOLD = 0.6

export const gather = async (artist: SpotifyApi.ArtistObjectFull): Promise<string[]> => {
  // albums
  const { items: artistAlbums } = await spotify.getArtistAlbums(artist.id, { limit: 3 })

  // tracks from albums
  const tracks = flatten(await promise.map(artistAlbums, async artistAlbum => {
    const albumTracks = await spotify.getAlbumTracks(artistAlbum.id)
    return albumTracks.items
  }, { concurrency: 5 }))

  // audio features
  const trackIds = tracks.map(track => track.id)
  const trackIdChunks = chunk(trackIds, 100)
  const audioFeatures = flatten(await promise.map(trackIdChunks, async trackIdChunk => {
    const audioFeatures = await spotify.getAudioFeaturesForTracks(trackIdChunk)
    return audioFeatures.audio_features
  }, { concurrency: 5 }))

  // high valence
  const highValenceUris = audioFeatures
    .filter(audioFeature => audioFeature.valence >= VALENCE_THRESHOLD)
    .map(audioFeature => audioFeature.uri)

  return highValenceUris
}
