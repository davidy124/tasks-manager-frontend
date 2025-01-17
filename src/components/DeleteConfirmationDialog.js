import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function DeleteConfirmationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Delete',
  message,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel'
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
