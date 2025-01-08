"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@mui/material/styles";

export default function DashBoardChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/dailysales`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados da API");
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box mt={4}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Vendas Diárias do mês
        </Typography>
        {isLoading ? (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <CircularProgress size={25}></CircularProgress>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
