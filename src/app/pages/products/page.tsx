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
  Snackbar,
  Alert,
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
import AlertDialog from "@/app/components/AlertDialog/AlertDialog";

interface ICategory {
  _id: string;
  name: string;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  categories: ICategory[];
}

export default function ProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actualPage, setActualPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(INITIAL_ROWS_PER_PAGE);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const snackBarAlertDurationInMilisecounds = 3000;

  const handleConfirm = () => {
    handleDeleteProduct(selectedId);
  };

  async function handleDeleteProduct(selectedId: string | null) {
    if (!selectedId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Erro ao excluir o produto");
        if (response.status === 409) {
          setSnackbarMessage(
            "Produto vinculado a um pedido e não pode ser excluído"
          );
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error("Erro ao excluir o produto", error);
      setSnackbarMessage("Erro inesperado ao tentar excluir o produto.");
      setSnackbarOpen(true);
    }
  }

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [actualPage, rowsPerPage]);

  async function fetchProducts() {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?page=${
        actualPage + 1
      }&limit=${rowsPerPage}`
    );
    if (response.ok) {
      const data = await response.json();
      setProducts(data.data);
      setTotalItems(data.total);
    } else {
      console.error("Erro ao buscar os dados do dashboard");
    }
    setIsLoading(false);
  }

  const handleAddCategory = (): void => {
    router.push("/pages/products/new");
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
    setRowsPerPage(parseInt(event.target.value));
    setActualPage(0);
  };

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
            <StyledTableCell>Preço</StyledTableCell>
            <StyledTableCell>Categorias</StyledTableCell>
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
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{`R$ ${product.price}`}</TableCell>
                <TableCell>{product.categories.length}</TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      router.push(`/pages/products/${product._id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedId(product._id);
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
        title="Excluir produto"
        text="Deseja realmente excluir o produto?"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackBarAlertDurationInMilisecounds}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
