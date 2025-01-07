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
import { useRouter } from "next/navigation";
import {
  INITIAL_ROWS_PER_PAGE,
  ROWS_PER_PAGE_OPTIONS,
} from "@/conf/generalValues";
import { Category } from "@mui/icons-material";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<ICategory[]>([
    {
      id: 1,
      name: "Produto 1",
      description: "Description 1",
      products: [{ id: 1, name: "Produto 1" }],
    },
    {
      id: 2,
      name: "Produto 2",
      description: "Description 2",
      products: [{ id: 2, name: "Produto 2" }],
    },
  ]);

  const [actualPage, setActualPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(INITIAL_ROWS_PER_PAGE);

  const router = useRouter();

  const handleAddCategory = (): void => {
    router.push("/pages/products/new");
  };

  const handleViewProducts = (categoryId: number): void => {};

  const handleEditCategory = (categoryId: number): void => {
    router.push(`/pages/products/${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: number): void => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      setProducts(products.filter((product) => product.id !== categoryId));
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

  const paginatedProducts = products.slice(
    actualPage * rowsPerPage,
    actualPage * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Produtos
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
            <StyledTableCell>Categorias</StyledTableCell>
            <StyledTableCell>Ação</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.products.length}</TableCell>
              <TableCell sx={{ width: "20%" }}>
                <IconButton
                  color="default"
                  onClick={() => handleViewProducts(product.id)}
                >
                  <Category />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleEditCategory(product.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteCategory(product.id)}
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={actualPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
