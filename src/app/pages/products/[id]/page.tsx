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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";

interface ICategories {
  id: string;
  name: string;
}

interface IFormData {
  name: string;
  description: string;
  categories: ICategories[];
  price: number;
  imageUrl: string | File;
}

export default function EditProductForm({
  productId,
}: {
  readonly productId: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  const [availableCategories, setAvailableCategories] = useState<ICategories[]>(
    [
      { id: "1", name: "Categoria 1" },
      { id: "2", name: "Categoria 2" },
      { id: "3", name: "Categoria 3" },
    ]
  );

  const [selectedCategories, setSelectedCategories] = useState<ICategories[]>(
    []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = {
        name: "Produto Exemplo",
        description: "Descrição do Produto Exemplo",
        price: 99.99,
        imageUrl: "https://via.placeholder.com/100",
        categories: [
          { id: "1", name: "Categoria 1" },
          { id: "3", name: "Categoria 3" },
        ],
      };

      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("price", productData.price);
      setImagePreview(productData.imageUrl);

      setSelectedCategories(productData.categories);

      setAvailableCategories((prev) =>
        prev.filter(
          (category) =>
            !productData.categories.find(
              (selected) => selected.id === category.id
            )
        )
      );
    };

    fetchProductData();
  }, [productId, setValue]);

  const handleAddCategory = (category: ICategories) => {
    setAvailableCategories(
      availableCategories.filter((c) => c.id !== category.id)
    );
    setSelectedCategories([...selectedCategories, category]);
  };

  const handleRemoveCategory = (category: ICategories) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.id !== category.id)
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

  const onSubmit = (data: IFormData) => {
    const finalData = {
      ...data,
      categories: selectedCategories,
    };
    console.log("Produto atualizado:", finalData);
    alert("Produto atualizado com sucesso!");
    router.push("/pages/products");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        marginBottom={3}
      >
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
              alt="Imagem"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </Box>
        )}
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
              Categorias Disponíveis
            </Typography>
          </Paper>
          <Paper
            elevation={2}
            style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
          >
            <List>
              {availableCategories.map((category) => (
                <ListItem
                  key={category.id}
                  secondaryAction={
                    <IconButton
                      color="primary"
                      onClick={() => handleAddCategory(category)}
                    >
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={category.name}
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
                  key={category.id}
                  secondaryAction={
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={category.name}
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
