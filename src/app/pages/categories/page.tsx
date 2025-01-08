"use client";
import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { StyledTableCell } from "@/app/components/StyledTitleCell/StyledTitleCell";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import {
  INITIAL_ROWS_PER_PAGE,
  ROWS_PER_PAGE_OPTIONS,
} from "@/conf/generalValues";
import AlertDialog from "@/app/components/AlertDialog/AlertDialog";

interface IProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ICategory {
  _id: string;
  name: string;
  description: string;
  products: IProduct[];
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actualPage, setActualPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(INITIAL_ROWS_PER_PAGE);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    handleDeleteProduct(selectedId);
  };

  async function handleDeleteProduct(selectedId: string | null) {
    if (!selectedId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchCategories();
      } else {
        console.error("Erro ao excluir a categoria");
      }
    } catch (error) {
      console.error("Erro ao excluir o categoria", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [actualPage, rowsPerPage]);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?page=${
          actualPage + 1
        }&limit=${rowsPerPage}`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
        setTotalItems(data.total);
      } else {
        console.error("Erro ao buscar os dados das categorias");
      }
    } catch (error) {
      console.error("Erro na chamada da API:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddCategory = (): void => {
    router.push("/pages/categories/new");
  };

  const handleEditCategory = (categoryId: string): void => {
    router.push(`/pages/categories/${categoryId}`);
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
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center" style={{ height: "200px" }}>
                <CircularProgress size={30} />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.products.length}</TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditCategory(category._id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedId(category._id);
                      setOpenDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <TablePagination
        labelRowsPerPage={"Itens por página"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={actualPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AlertDialog
        title="Excluir categoria"
        text="Deseja realmente excluir a categoria?"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
