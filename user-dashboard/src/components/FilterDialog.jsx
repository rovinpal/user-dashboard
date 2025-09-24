import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid
} from "@mui/material";



export default function FilterDialog({ open, onClose, onApply, initialFilter = {} }) {
  const [filter, setFilter] = useState({ firstName: '', lastName: '', email: '', department: '' });

  useEffect(() => setFilter({ ...filter, ...initialFilter }), [open]);

  const apply = () => {
    onApply(filter);
    onClose();
  };

  const clear = () => {
    setFilter({ firstName: '', lastName: '', email: '', department: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Users</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" value={filter.firstName} onChange={(e)=>setFilter({ ...filter, firstName: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={filter.lastName} onChange={(e)=>setFilter({ ...filter, lastName: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={filter.email} onChange={(e)=>setFilter({ ...filter, email: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Department" value={filter.department} onChange={(e)=>setFilter({ ...filter, department: e.target.value })} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={clear}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={apply}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
