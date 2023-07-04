import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@mui/material'

import './index.css'

type ProgressDialogProps = {
  isOpen: boolean,
  progress: number
}

const ProgressDialog = (props: ProgressDialogProps) => (
  <Dialog open={props.isOpen} className='progress-dialog'>
    <DialogTitle>Generating playlist...</DialogTitle>
    <DialogContent style={{ textAlign: 'center' }}>
      <LinearProgress variant='determinate' value={props.progress} color='primary'/>
    </DialogContent>
  </Dialog>
)

export default ProgressDialog
