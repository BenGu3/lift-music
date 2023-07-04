import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import './index.css'

type NoTracksDialogProps = {
  isOpen: boolean,
  onClose: () => void
}

const NoTracksDialog = (props: NoTracksDialogProps) => (
  <Dialog open={props.isOpen} onClose={props.onClose} className='no-tracks-dialog'>
    <DialogTitle>Whoops!</DialogTitle>
    <DialogContent style={{ textAlign: 'center' }}>
      It seems your artist had no high valence tracks, so we didn't create a playlist for you. Maybe look in to some
      happier sounding tunes!
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color='primary'>
        Close
      </Button>
    </DialogActions>
  </Dialog>
)
export default NoTracksDialog
