import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid
} from "@mui/material";


export default function UserForm({ open, onClose, onSave, initialData = {} }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', department:'' });
  const [errors, setErrors] = useState({});

  useEffect(() => setForm({ firstName:'', lastName:'', email:'', department:'', ...initialData }), [initialData, open]);

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "First name is required";
    if (!form.lastName?.trim()) e.lastName = "Last name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.department?.trim()) e.department = "Department is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData?.id ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="First name" required value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} error={!!errors.firstName} helperText={errors.firstName || ''} fullWidth/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last name" required value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} error={!!errors.lastName} helperText={errors.lastName || ''} fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" required value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} error={!!errors.email} helperText={errors.email || ''} fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Department" required value={form.department} onChange={(e)=>setForm({...form, department: e.target.value})} error={!!errors.department} helperText={errors.department || ''} fullWidth/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>{initialData?.id ? "Update" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
