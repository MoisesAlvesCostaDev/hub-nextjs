import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  colorVariant?: "blue" | "green" | "red";
}

const colors = {
  blue: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  green: "linear-gradient(45deg, #66BB6A 30%, #43A047 90%)",
  red: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  colorVariant = "blue",
}) => {
  return (
    <Card
      sx={{
        background: colors[colorVariant],
        color: "white",
        width: "250px",
        height: "150px",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
