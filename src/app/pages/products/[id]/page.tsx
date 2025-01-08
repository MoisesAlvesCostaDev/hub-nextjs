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
import { useParams, useRouter } from "next/navigation";

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

export default function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

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

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const productResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      if (!productResponse.ok) {
        throw new Error("Erro ao buscar dados do produto");
      }
      const productData = await productResponse.json();

      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("price", productData.price);
      setImagePreview(productData.imageUrl);
      setSelectedCategories(productData.categories);

      const categoriesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      if (!categoriesResponse.ok) {
        throw new Error("Erro ao buscar categorias");
      }
      const categoriesData = await categoriesResponse.json();

      setAvailableCategories(
        categoriesData.data.filter(
          (cat: ICategories) =>
            !productData.categories.find(
              (sel: ICategories) => sel._id === cat._id
            )
        )
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
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
      JSON.stringify(selectedCategories.map((c) => c._id))
    );
    if (data.imageUrl) {
      formData.append("file", data.imageUrl);
    }

    console.log("formData", formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o produto");
      }

      router.push("/pages/products");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto");
    }
  };

  return isLoading ? (
    <Box display="flex" justifyContent="center" marginTop={4}>
      <CircularProgress />
    </Box>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>
        Editar Produto
      </Typography>
      <Box display="flex" gap={2} marginBottom={3}>
        <Box flex={1}>
          <Typography variant="caption">Nome do Produto</Typography>
          <input
            {...register("name", { required: "Nome é obrigatório" })}
            style={{ width: "100%" }}
          />
          {errors.name && (
            <Typography color="error">{errors.name.message}</Typography>
          )}
        </Box>

        <Box flex={2}>
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

        <Box flex={1}>
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

      <Box marginBottom={3}>
        <Typography variant="caption">Imagem do Produto</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "block" }}
        />
        {imagePreview && (
          <Box marginTop={2}>
            <img
              src={imagePreview}
              alt="Imagem do Produto"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </Box>
        )}
      </Box>

      <Box display="flex" gap={4}>
        <Box flex={1}>
          <Paper elevation={2}>
            <Typography variant="subtitle2" textAlign="center">
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
            <Typography variant="subtitle2" textAlign="center">
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
