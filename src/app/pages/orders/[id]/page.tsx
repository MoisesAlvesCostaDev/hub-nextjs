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
import { useParams, useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface IProductData {
  data: Product[];
}

interface Order {
  _id: string;
  products: Product[];
}

export default function EditOrderForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrderAndProducts();
  }, []);

  const fetchOrderAndProducts = async () => {
    setIsLoading(true);
    try {
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`
      );
      if (!orderResponse.ok) {
        throw new Error("Erro ao buscar pedido");
      }
      const orderData: Order = await orderResponse.json();

      const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      if (!productsResponse.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const productsData: IProductData = await productsResponse.json();

      setOrder(orderData);
      setSelectedProducts(orderData.products);
      setAvailableProducts(
        productsData.data.filter(
          (product) =>
            !orderData.products.some((selected) => selected._id === product._id)
        )
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const newTotal = selectedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
    setTotal(newTotal);
  }, [selectedProducts]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        router.push("/pages/orders");
      } else {
        throw new Error("Erro ao atualizar pedido");
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      alert("Erro ao atualizar pedido.");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Box marginBottom={3}>
        <Typography variant="h6">
          ID do Pedido: {order ? order._id : "Carregando..."}
        </Typography>
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
                    primary={`${product.name} - R$ ${product.price.toFixed(2)}`}
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
                    primary={`${product.name} - R$ ${product.price.toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
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
