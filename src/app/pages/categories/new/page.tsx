"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  description: string;
  products: Product[];
};

export default function CategoryForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [availableProducts, setAvailableProducts] = useState<Product[]>([
    { id: "1", name: "Produto 1" },
    { id: "2", name: "Produto 2" },
    { id: "3", name: "Produto 3" },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleAddProduct = (product: Product) => {
    setAvailableProducts(availableProducts.filter((p) => p.id !== product.id));
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (product: Product) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    setAvailableProducts([...availableProducts, product]);
  };

  const onSubmit = (data: FormData) => {
    const finalData = {
      ...data,
      products: selectedProducts,
    };
    console.log("Categoria criada:", finalData);
    alert("Categoria criada com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <Box flex={1}>
          <Typography variant="caption">Descrição</Typography>
          <input
            {...register("description", {
              required: "Descrição é obrigatória",
            })}
            style={{ width: "100%" }}
          />
          {errors.description && (
            <Typography color="error">{errors.description.message}</Typography>
          )}
        </Box>
      </Box>

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
                  key={product.id}
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
                  key={product.id}
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
