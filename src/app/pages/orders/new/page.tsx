"use client";
import React, { useState, useEffect } from "react";
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

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function OrderForm() {
  const router = useRouter();

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = selectedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
    setTotal(newTotal);
  }, [selectedProducts]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos.");
      }
      const data = await response.json();
      setAvailableProducts(data.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = (product: Product) => {
    setAvailableProducts(
      availableProducts.filter((p) => p._id !== product._id)
    );
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (product: Product) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    setAvailableProducts([...availableProducts, product]);
  };

  const onSubmit = async () => {
    const finalData = {
      products: selectedProducts.map((product) => product._id),
      total,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        router.push("/pages/orders");
      } else {
        alert("Erro ao criar pedido.");
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Box display="flex" gap={4}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
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
                        primary={`${product.name} - R$ ${product.price.toFixed(
                          2
                        )}`}
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
                        primary={`${product.name} - R$ ${product.price.toFixed(
                          2
                        )}`}
                        slotProps={{ primary: { fontSize: "small" } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </>
        )}
      </Box>

      <Box marginTop={3}>
        <Typography variant="h6" textAlign="right">
          Total: R$ {total.toFixed(2)}
        </Typography>
      </Box>

      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={() => {
            router.push("/pages/orders");
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
