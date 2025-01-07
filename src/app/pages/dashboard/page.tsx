"use client";
import React from "react";
import { Box, Typography, Grid2 } from "@mui/material";

import DashboardCard from "@/app/components/DashboardCard/DashBoardCard";
import DashBoardChart from "@/app/components/DashboardChart/DashBoardChart";

const metrics = {
  totalOrders: 45,
  totalValue: 10000,
  averageValue: 222.22,
};

export default function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard de Pedidos
      </Typography>
      <Grid2
        container
        spacing={3}
        marginTop={3}
        marginBottom={3}
        justifyContent={"space-between"}
      >
        <Grid2>
          <DashboardCard
            title="Total de Pedidos"
            value={"45"}
            colorVariant="blue"
          />
        </Grid2>
        <Grid2>
          <DashboardCard
            title="Valor Total"
            value="R$ 10,000"
            colorVariant="green"
          />
        </Grid2>
        <Grid2>
          <DashboardCard
            title="Média por Pedido"
            value="R$ 222.22"
            colorVariant="red"
          />
        </Grid2>
      </Grid2>

      <DashBoardChart />
    </Box>
  );
}
