import React from "react";
import { MenuItem, Select, FormControl, InputLabel, Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function PaginationControls({
  page,
  setPage,
  perPage,
  setPerPage,
  total,
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={() => setPage(p => Math.max(1, p - 1))} size="small">
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <span>Page {page} / {totalPages}</span>
      <IconButton onClick={() => setPage(p => Math.min(totalPages, p + 1))} size="small">
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="per-page-label">Per page</InputLabel>
        <Select
          labelId="per-page-label"
          value={perPage}
          label="Per page"
          onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
          {[10,25,50,100].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}
