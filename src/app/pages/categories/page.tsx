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

interface IProduct {
  id: number;
  name: string;
}

interface ICategory {
  id: number;
  name: string;
  description: string;
  products: IProduct[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([
    {
      id: 1,
      name: "Category 1",
      description: "Description 1",
      products: [{ id: 1, name: "Product 1" }],
    },
    {
      id: 2,
      name: "Category 2",
      description: "Description 2",
      products: [{ id: 2, name: "Product 2" }],
    },
  ]);

  const [actualPage, setActualPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(INITIAL_ROWS_PER_PAGE);

  const router = useRouter();

  const handleAddCategory = (): void => {
    router.push("/categories/new");
  };

  const handleViewProducts = (categoryId: number): void => {};

  const handleEditCategory = (categoryId: number): void => {
    router.push(`/categories/${categoryId}/edit`);
  };

  const handleDeleteCategory = (categoryId: number): void => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
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

  const paginatedCategories = categories.slice(
    actualPage * rowsPerPage,
    actualPage * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Categorias
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
            <StyledTableCell>Nome</StyledTableCell>
            <StyledTableCell>Descrição</StyledTableCell>
            <StyledTableCell>Produtos</StyledTableCell>
            <StyledTableCell>Ação</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.products.length}</TableCell>
              <TableCell sx={{ width: "20%" }}>
                <IconButton
                  color="default"
                  onClick={() => handleViewProducts(category.id)}
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
          ))}
        </TableBody>
      </Table>
      <TablePagination
        labelRowsPerPage={"Itens por página"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={actualPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
