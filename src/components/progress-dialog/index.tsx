import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@mui/material'

import './index.css'

export default function ProgressDialog(props: ProgressDialogProps) {
  return (
    <Dialog open={props.isOpen} className='progress-dialog'>
      <DialogTitle>Generating playlist...</DialogTitle>
      <DialogContent style={{ textAlign: 'center' }}>
        <LinearProgress variant='determinate' value={props.progress} color='primary' />
      </DialogContent>
    </Dialog>
  )
}

interface ProgressDialogProps {
  isOpen: boolean,
  progress: number
}
