import React from "react";
import { Box, Typography, Grid2 } from "@mui/material";

import DashboardCard from "@/app/components/DashboardCard/DashBoardCard";
import DashBoardChart from "@/app/components/DashboardChart/DashBoardChart";

export default async function Dashboard() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`);

  if (!response.ok) {
    return <div>Erro ao carregar os dados.</div>;
  }

  const dashboardData = await response.json();

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
            value={dashboardData.totalOrders}
            colorVariant="blue"
          />
        </Grid2>
        <Grid2>
          <DashboardCard
            title="Valor Total"
            value={dashboardData.totalRevenue}
            colorVariant="green"
          />
        </Grid2>
        <Grid2>
          <DashboardCard
            title="Média por Pedido"
            value={dashboardData.averageOrderValue}
            colorVariant="red"
          />
        </Grid2>
      </Grid2>

      <DashBoardChart />
    </Box>
  );
}
