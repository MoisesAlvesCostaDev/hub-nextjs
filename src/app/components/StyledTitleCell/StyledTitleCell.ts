import { styled, TableCell } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[100],
}));
