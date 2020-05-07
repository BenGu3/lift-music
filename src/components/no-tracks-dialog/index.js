import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'
import { bool, func } from 'prop-types'

import './index.css'

const NoTracksDialog = props => (
  <Dialog open={props.isOpen} onClose={props.onClose} className="no-tracks-dialog">
    <DialogTitle>Whoops!</DialogTitle>
    <DialogContent style={{ textAlign: 'center' }}>
      It seems your artist had no high valence tracks, so we didn't create a playlist for you. Maybe look in to some happier sounding tunes!
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
)

NoTracksDialog.propTypes = {
  isOpen: bool.isRequired,
  onClose: func.isRequired
}

export default NoTracksDialog
