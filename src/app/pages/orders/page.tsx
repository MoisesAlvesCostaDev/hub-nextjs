"use client";
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  IconButton,
  TablePagination,
} from "@mui/material";
import { StyledTableCell } from "@/app/components/StyledTitleCell/StyledTitleCell";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useRouter } from "next/navigation";
import {
  INITIAL_ROWS_PER_PAGE,
  ROWS_PER_PAGE_OPTIONS,
} from "@/conf/generalValues";

interface IOrder {
  id: number;
  date: string;
  total: number;
}

interface ICategory {
  id: number;
  orders: IOrder[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ICategory[]>([
    {
      id: 1,
      orders: [
        { id: 1, date: "2023-12-01", total: 100.5 },
        { id: 2, date: "2023-12-02", total: 150.75 },
      ],
    },
    {
      id: 2,
      orders: [{ id: 3, date: "2023-12-03", total: 200 }],
    },
  ]);

  const [actualPage, setActualPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(INITIAL_ROWS_PER_PAGE);

  const router = useRouter();

  const handleAddCategory = (): void => {
    router.push("/pages/orders/new");
  };

  const handleViewOrders = (categoryId: number): void => {
    console.log(`Visualizando pedidos da categoria ${categoryId}`);
  };

  const handleEditCategory = (categoryId: number): void => {
    router.push(`/pages/orders/${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: number): void => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      setOrders(orders.filter((category) => category.id !== categoryId));
      alert(`Categoria ${categoryId} deletada!`);
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setActualPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setActualPage(0);
  };

  const paginatedOrders = orders.slice(
    actualPage * rowsPerPage,
    actualPage * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Pedidos
      </Typography>
      <Box display={"flex"} justifyContent={"right"}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{ marginBottom: 2 }}
        >
          Adicionar
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Data do Pedido</StyledTableCell>
            <StyledTableCell>Total do Pedido</StyledTableCell>
            <StyledTableCell>Produtos</StyledTableCell>
            <StyledTableCell>Ação</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedOrders.map((category) =>
            category.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total.toFixed(2)}</TableCell>
                <TableCell>{category.orders.length}</TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <IconButton
                    color="default"
                    onClick={() => handleViewOrders(category.id)}
                  >
                    <InventoryIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditCategory(category.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        labelRowsPerPage={"Itens por página"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={actualPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
