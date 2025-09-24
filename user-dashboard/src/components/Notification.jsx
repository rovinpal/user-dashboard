import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Notification({ open, setOpen, severity = "info", message }) {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)} anchorOrigin={{vertical:'top', horizontal:'center'}}>
      <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
