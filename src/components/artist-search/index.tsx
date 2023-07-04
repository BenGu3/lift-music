import AsyncSelect from 'react-select/async'
import * as React from 'react'
import { ActionMeta, components, DropdownIndicatorProps } from 'react-select'
import Search from '@mui/icons-material/Search'

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <Search />
    </components.DropdownIndicator>
  )
}

type Props = {
  onChange: (artist: SpotifyApi.ArtistObjectFull) => void
  loadArtists: (query: string) => Promise<SpotifyApi.ArtistObjectFull[]>
}

const ArtistSearch = (props: Props) => {
  const getNoOptionsMessage = (): string => 'No artists found'
  const getOptionLabel = (option: SpotifyApi.ArtistObjectFull): string => option.name
  const getOptionValue = (option: SpotifyApi.ArtistObjectFull): string => option as unknown as string

  const handleQueryChange = async (selectedArtist: SpotifyApi.ArtistObjectFull, action: ActionMeta<SpotifyApi.ArtistObjectFull>) => {
    if (action.action === 'select-option') {
      props.onChange(selectedArtist)
    }
  }

  return (
    <AsyncSelect
      placeholder="Search your favorite artist"
      className="search-bar"
      components={{ DropdownIndicator }}
      onChange={handleQueryChange}
      loadOptions={props.loadArtists}
      isClearable
      noOptionsMessage={getNoOptionsMessage}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      value=""
    />
  )
}

export default ArtistSearch
