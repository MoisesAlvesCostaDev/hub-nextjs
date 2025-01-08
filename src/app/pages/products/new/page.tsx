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
import { useForm } from "react-hook-form";

interface ICategories {
  _id: string;
  name: string;
}

interface IFormData {
  name: string;
  description: string;
  categories: string[];
  price: number;
  imageUrl: File | null;
}

export default function ProductForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  const [availableCategories, setAvailableCategories] = useState<ICategories[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<ICategories[]>(
    []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }
      const data = await response.json();
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = (category: ICategories) => {
    setAvailableCategories(
      availableCategories.filter((c) => c._id !== category._id)
    );
    setSelectedCategories([...selectedCategories, category]);
  };

  const handleRemoveCategory = (category: ICategories) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c._id !== category._id)
    );
    setAvailableCategories([...availableCategories, category]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("imageUrl", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: IFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append(
      "categories",
      JSON.stringify(selectedCategories.map((category) => category._id))
    );
    if (data.imageUrl) {
      formData.append("file", data.imageUrl);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar o produto");
      }
      router.push("/pages/products");
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      alert("Erro ao criar o produto");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>
        Adicionar Produto
      </Typography>
      <Box display="flex" gap={2} marginBottom={3}>
        <Box>
          <Typography variant="caption">Nome do Produto</Typography>
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

        <Box>
          <Typography variant="caption">Preço</Typography>
          <input
            type="number"
            {...register("price", { required: "Preço é obrigatório" })}
            style={{ width: "100%" }}
          />
          {errors.price && (
            <Typography color="error">{errors.price.message}</Typography>
          )}
        </Box>
      </Box>

      <Box display={"flex"} alignItems={"center"} marginBottom={3}>
        <Box>
          <Typography variant="caption">Imagem do Produto</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "block" }}
          />
        </Box>

        {imagePreview && (
          <Box marginTop={2}>
            <img
              src={imagePreview}
              alt="Pré-visualização da imagem"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </Box>
        )}
      </Box>

      {isLoading ? (
        <CircularProgress />
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
                Categorias Disponíveis
              </Typography>
            </Paper>
            <Paper
              elevation={2}
              style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
            >
              <List>
                {availableCategories.length > 0 ? (
                  availableCategories.map((category) => (
                    <ListItem
                      key={category._id}
                      secondaryAction={
                        <IconButton
                          color="primary"
                          onClick={() => handleAddCategory(category)}
                        >
                          <AddIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={category.name} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>Nenhuma categoria</Typography>
                )}
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
                Categorias Selecionadas
              </Typography>
            </Paper>
            <Paper
              elevation={3}
              style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
            >
              <List>
                {selectedCategories.map((category) => (
                  <ListItem
                    key={category._id}
                    secondaryAction={
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={category.name} />
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
            router.push("/pages/products");
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
