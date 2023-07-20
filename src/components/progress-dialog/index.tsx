import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@mui/material'

import * as css from './index.css'

type ProgressDialogProps = {
  isOpen: boolean,
  progress: number
}

const ProgressDialog = (props: ProgressDialogProps) => (
  <Dialog open={props.isOpen} className={css.progressDialog}>
    <DialogTitle>Generating playlist...</DialogTitle>
    <DialogContent className={css.progressDialogContent}>
      <LinearProgress variant='determinate' value={props.progress} color='primary'/>
    </DialogContent>
  </Dialog>
)

export default ProgressDialog
