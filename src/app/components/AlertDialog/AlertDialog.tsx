import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IAlertDialogProps {
  title: string;
  text: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AlertDialog({
  title,
  text,
  open,
  onClose,
  onConfirm,
}: IAlertDialogProps) {
  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
