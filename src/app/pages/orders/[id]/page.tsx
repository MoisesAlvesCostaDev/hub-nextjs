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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  products: Product[];
}

export default function EditOrderForm({
  orderId,
}: {
  readonly orderId: string;
}) {
  const router = useRouter();

  const [availableProducts, setAvailableProducts] = useState<Product[]>([
    { id: "1", name: "Produto 1", price: 50.0 },
    { id: "2", name: "Produto 2", price: 30.0 },
    { id: "3", name: "Produto 3", price: 20.0 },
    { id: "4", name: "Produto 4", price: 40.0 },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      const mockOrder: Order = {
        id: orderId,
        products: [
          { id: "1", name: "Produto 1", price: 50.0 },
          { id: "2", name: "Produto 2", price: 30.0 },
        ],
      };

      setOrder(mockOrder);
      setSelectedProducts(mockOrder.products);

      const updatedAvailableProducts = availableProducts.filter(
        (product) =>
          !mockOrder.products.some((selected) => selected.id === product.id)
      );
      setAvailableProducts(updatedAvailableProducts);
    };

    fetchOrder();
  }, [orderId, order, availableProducts]);

  useEffect(() => {
    const newTotal = selectedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
    setTotal(newTotal);
  }, [selectedProducts]);

  const handleAddProduct = (product: Product) => {
    setAvailableProducts(availableProducts.filter((p) => p.id !== product.id));
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (product: Product) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    setAvailableProducts([...availableProducts, product]);
  };

  const onSubmit = () => {
    const finalData = {
      orderId: order?.id,
      products: selectedProducts,
      total,
    };
    console.log("Pedido atualizado:", finalData);
    alert("Pedido atualizado com sucesso!");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Box marginBottom={3}>
        <Typography variant="h6">
          ID do Pedido: {order ? order.id : "Carregando..."}
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
                    primary={`${product.name} - R$ ${product.price.toFixed(2)}`}
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
                    primary={`${product.name} - R$ ${product.price.toFixed(2)}`}
                    slotProps={{ primary: { fontSize: "small" } }}
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
