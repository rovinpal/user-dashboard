import React, { useEffect, useState, useMemo } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/usersService";
import UserForm from "../components/UserForm/UserForm";
import FilterDialog from "../components/FilterDialog";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
import PaginationControls from "../components/PaginationControls";
import {
  Box, Button, TextField, IconButton, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

const mapApiToUI = (u) => {
  const [firstName, ...rest] = (u.name || "").split(" ");
  const lastName = rest.join(" ") || "";
  const department = (u.company && u.company.name) || (u.department || "") || "";
  return { id: u.id, firstName: u.firstName || firstName, lastName: u.lastName || lastName, email: u.email || "", department };
};

const mapUIToApi = (ui) => {
  return {
    name: `${ui.firstName} ${ui.lastName}`,
    email: ui.email,
    company: { name: ui.department }
  };
};

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ open:false, message:'', severity:'info' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState(""); 
  const [sortDir, setSortDir] = useState("asc");
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await getUsers();
      const mapped = res.data.map(mapApiToUI);
      setUsers(mapped);
    } catch (err) {
      setNotif({ open:true, message: "Failed to fetch users", severity:'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (data) => {
    try {
      const apiPayload = mapUIToApi(data);
      const res = await createUser(apiPayload);
      const created = { id: res.data.id || (users.length + 1), ...data };
      setUsers(prev => [...prev, created]);
      setNotif({ open:true, message: "User created", severity:'success' });
    } catch (err) {
      setNotif({ open:true, message: "Failed to create user", severity:'error' });
    }
  };

  const handleUpdate = async (data) => {
    try {
      const apiPayload = mapUIToApi(data);
if (data.id <= 10) {
      await updateUser(data.id, apiPayload); // API update
    }      setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } : u));
      setNotif({ open:true, message: "User updated", severity:'success' });
    } catch (err) {
      setNotif({ open:true, message: "Failed to update user", severity:'error' });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteUser(toDelete.id);
      setUsers(prev => prev.filter(u => u.id !== toDelete.id));
      setNotif({ open:true, message: "User deleted", severity:'success' });
    } catch (err) {
      setNotif({ open:true, message: "Failed to delete user", severity:'error' });
    } finally {
      setToDelete(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(u => {
      if (q) {
        const hay = `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filter.firstName && !u.firstName.toLowerCase().includes(filter.firstName.toLowerCase())) return false;
      if (filter.lastName && !u.lastName.toLowerCase().includes(filter.lastName.toLowerCase())) return false;
      if (filter.email && !u.email.toLowerCase().includes(filter.email.toLowerCase())) return false;
      if (filter.department && !u.department.toLowerCase().includes(filter.department.toLowerCase())) return false;
      return true;
    }).sort((a,b) => {
      if (!sortBy) return 0;
      const av = (a[sortBy] || "").toString().toLowerCase();
      const bv = (b[sortBy] || "").toString().toLowerCase();
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [users, query, filter, sortBy, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (page > totalPages) setPage(totalPages);
  }, [filtered, perPage]);

  return (
    <Box className="app-container">
      <Box className="header">
        <Typography variant="h5">User Management Dashboard</Typography>
        <Box className="controls">
          <TextField size="small" label="Search" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={(e)=>setSortBy(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="firstName">First Name</MenuItem>
              <MenuItem value="lastName">Last Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="department">Department</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<SortByAlphaIcon />} onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </Button>
          <IconButton color="primary" onClick={() => setFilterOpen(true)} title="Filter"><FilterListIcon /></IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingUser(null); setFormOpen(true); }}>
            Add User
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        {loading ? <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box> : (
          <>
            <TableContainer className="table-wrap">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paged.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.firstName}</TableCell>
                      <TableCell>{u.lastName}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.department}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => { setEditingUser(u); setFormOpen(true); }} size="small"><EditIcon /></IconButton>
                        <IconButton onClick={() => { setToDelete(u); setConfirmOpen(true); }} size="small" color="error"><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paged.length === 0 && (
                    <TableRow><TableCell colSpan={6}><Typography align="center" sx={{ py: 2 }}>No users found</Typography></TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="body2">Showing {filtered.length} result(s)</Typography>
              <PaginationControls page={page} setPage={setPage} perPage={perPage} setPerPage={setPerPage} total={filtered.length} />
            </Box>
          </>
        )}
      </Paper>

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingUser || {}}
        onSave={async (data) => {
          if (editingUser?.id) await handleUpdate({ ...editingUser, ...data });
          else await handleAdd(data);
        }}
      />

      <FilterDialog open={filterOpen} onClose={() => setFilterOpen(false)} onApply={(f)=>{ setFilter(f); setPage(1); }} initialFilter={filter} />

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete user" message={`Are you sure you want to delete ${toDelete?.firstName} ${toDelete?.lastName}?`} />

      <Notification open={notif.open} setOpen={(open)=>setNotif(o => ({ ...o, open }))} severity={notif.severity} message={notif.message} />
    </Box>
  );
}
