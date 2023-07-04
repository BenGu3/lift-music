import { Divider, IconButton, List, ListItem, ListItemSecondaryAction } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import './index.css'

const renderPlaylists = (props: PlaylistListProps) => {
  return props.playlists.map((playlist, index) => {
    return (
      <div key={playlist.name}>
        <ListItem
          button
          className="playlist-button"
          onClick={() => props.onPlaylistClick(playlist)}
          key={playlist.name}
        >
          {playlist.name.slice(7)}
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete" onClick={() => props.onDeletePlaylist(playlist.id)}>
              <DeleteIcon color="secondary" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {index < props.playlists.length - 1 && (<Divider className="white-divider" />)}
      </div>
    )
  })
}

export default function PlaylistListWrapper(props: PlaylistListProps) {
  return (
    <div className="playlist-list">
      <List>
        <ListItem>
          <div className="header">
            <span className="motto">search.</span>
            <span className="motto">listen.</span>
            <span className="title">lift.</span>
          </div>
        </ListItem>
        {renderPlaylists(props)}
      </List>
    </div>
  )
}

interface PlaylistListProps {
  playlists: SpotifyApi.PlaylistObjectSimplified[],
  onPlaylistClick: (playlist: SpotifyApi.PlaylistObjectSimplified) => void,
  onDeletePlaylist: (playlistId: string) => void
}
