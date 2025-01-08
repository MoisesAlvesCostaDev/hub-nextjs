"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter, useParams } from "next/navigation";

interface IProduct {
  _id: string;
  name: string;
}

interface IFormData {
  name: string;
  products: IProduct[];
}

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setIsLoading(true);
    try {
      const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      if (!productsResponse.ok) {
        throw new Error("Erro ao buscar produtos disponíveis");
      }
      const productsData = await productsResponse.json();

      const categoryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
      );
      if (!categoryResponse.ok) {
        throw new Error("Erro ao buscar dados da categoria");
      }
      const categoryData = await categoryResponse.json();

      setValue("name", categoryData.name);
      setSelectedProducts(categoryData.products);

      const remainingProducts = productsData.data.filter(
        (product: IProduct) =>
          !categoryData.products.find(
            (selectedProduct: IProduct) => selectedProduct._id === product._id
          )
      );

      setAvailableProducts(remainingProducts);
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
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

  const onSubmit = async (data: IFormData) => {
    const selectedProductsFormated = selectedProducts.map(
      (product) => product._id
    );

    const finalData = {
      ...data,
      products: selectedProductsFormated,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        router.push("/pages/categories");
      } else {
        alert("Erro ao atualizar a categoria");
      }
    } catch (error) {
      alert("Erro ao atualizar a categoria");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>
        Editar Categorias
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
          <CircularProgress size={30} />
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
              style={{
                padding: "10px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
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
              style={{
                padding: "10px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
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
