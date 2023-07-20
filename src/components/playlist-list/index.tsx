import { Divider, IconButton, List, ListItem, ListItemSecondaryAction } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import * as css from './index.css'

type PlaylistListProps = {
  playlists: SpotifyApi.PlaylistObjectSimplified[],
  onPlaylistClick: (playlist: SpotifyApi.PlaylistObjectSimplified) => void,
  onDeletePlaylist: (playlistId: string) => void
}

const PlaylistListWrapper = (props: PlaylistListProps) => {
  const renderPlaylists = (props: PlaylistListProps) => {
    return props.playlists.map((playlist, index) => {
      return (
        <div key={playlist.name}>
          <ListItem
            button
            className={css.playlistButton}
            onClick={() => props.onPlaylistClick(playlist)}
            key={playlist.name}
          >
            {playlist.name.slice(7)}
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" onClick={() => props.onDeletePlaylist(playlist.id)}>
                <DeleteIcon color="secondary"/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {index < props.playlists.length - 1 && (<Divider className={css.whiteDivider}/>)}
        </div>
      )
    })
  }

  return (
    <div className={css.playlistList}>
      <List>
        <ListItem>
          <div className={css.header}>
            <span className={css.motto}>search.</span>
            <span className={css.motto}>listen.</span>
            <span className={css.title}>lift.</span>
          </div>
        </ListItem>
        {renderPlaylists(props)}
      </List>
    </div>
  )
}

export default PlaylistListWrapper
