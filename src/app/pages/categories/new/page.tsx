"use client";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";

interface IProduct {
  _id: string;
  name: string;
}

interface ResponseData {
  data: IProduct[];
}

interface IFormData {
  name: string;
  products: IProduct[];
}

export default function CategoryForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();
  const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const { data }: ResponseData = await response.json();
      setAvailableProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddProduct = (product: IProduct) => {
    setAvailableProducts(
      availableProducts.filter((p) => p._id !== product._id)
    );
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (product: IProduct) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    setAvailableProducts([...availableProducts, product]);
  };

  const onSubmit = (data: IFormData) => {
    const selectedProductsFormated = selectedProducts.map(
      (product) => product._id
    );
    const finalData = {
      ...data,
      products: selectedProductsFormated,
    };

    handleStoreCategory(finalData);
  };

  async function handleStoreCategory(finalData: {
    products: string[];
    name: string;
  }) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        await response.json();
        router.push("/pages/categories");
      } else {
        alert("Erro ao criar a categoria");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao criar a categoria");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>
        Adicionar Categorias
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={3}
      >
        <Box flex={1} marginRight={2}>
          <Typography variant="caption">Nome da Categoria</Typography>
          <input
            {...register("name", { required: "Nome é obrigatório" })}
            style={{ width: "100%" }}
          />
          {errors.name && (
            <Typography color="error">{errors.name.message}</Typography>
          )}
        </Box>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={30}></CircularProgress>
        </Box>
      ) : (
        <Box display="flex" gap={4}>
          <Box flex={1}>
            <Paper elevation={2}>
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Produtos Disponíveis
              </Typography>
            </Paper>
            <Paper
              elevation={2}
              style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
            >
              <List>
                {availableProducts.map((product) => (
                  <ListItem
                    key={product._id}
                    secondaryAction={
                      <IconButton
                        color="primary"
                        onClick={() => handleAddProduct(product)}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={product.name}
                      slotProps={{ primary: { fontSize: "small" } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          <Box flex={1}>
            <Paper elevation={2}>
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Produtos Selecionados
              </Typography>
            </Paper>
            <Paper
              elevation={3}
              style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
            >
              <List>
                {selectedProducts.map((product) => (
                  <ListItem
                    key={product._id}
                    secondaryAction={
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveProduct(product)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={product.name}
                      slotProps={{ primary: { fontSize: "small" } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      )}

      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={() => {
            router.push("/pages/categories");
          }}
        >
          Cancelar
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
      </Box>
    </form>
  );
}
