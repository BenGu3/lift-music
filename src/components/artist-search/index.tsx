import AsyncSelect from 'react-select/async'
import { ActionMeta, components, DropdownIndicatorProps } from 'react-select'
import Search from '@mui/icons-material/Search'
import { AsyncProps } from 'react-select/src/Async'

import * as css from './index.css'

const DropdownIndicator = (props: DropdownIndicatorProps<SpotifyApi.ArtistObjectFull>) => {
  return (
    <components.DropdownIndicator {...props}>
      <Search />
    </components.DropdownIndicator>
  )
}

type Props = {
  onChange: (artist: SpotifyApi.ArtistObjectFull) => void
  loadArtists: AsyncProps<SpotifyApi.ArtistObjectFull>['loadOptions']
}

const ArtistSearch = (props: Props) => {
  const getNoOptionsMessage = (): string => 'No artists found'
  const getOptionLabel = (option: SpotifyApi.ArtistObjectFull): string => option.name
  const getOptionValue = (option: SpotifyApi.ArtistObjectFull): string => option as unknown as string

  const handleQueryChange = async (selectedArtist: SpotifyApi.ArtistObjectFull | null, action: ActionMeta<SpotifyApi.ArtistObjectFull>) => {
    if (action.action === 'select-option' && selectedArtist) {
      props.onChange(selectedArtist)
    }
  }

  return (
    <AsyncSelect
      placeholder="Search your favorite artist"
      className={css.searchBar}
      components={{ DropdownIndicator }}
      onChange={handleQueryChange}
      loadOptions={props.loadArtists}
      isClearable
      isMulti={false}
      noOptionsMessage={getNoOptionsMessage}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      value={null}
    />
  )
}

export default ArtistSearch
