import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import DashboardCard, { DashboardCardProps } from "./DashBoardCard";

const meta = {
  title: "Components/DashboardCard",
  component: DashboardCard,
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardCard>;

export default meta;

const Template: StoryFn<DashboardCardProps> = (args) => (
  <DashboardCard {...args} />
);

export const Blue = Template.bind({});
Blue.args = {
  title: "Total Sales",
  value: "R$ 1,200",
  colorVariant: "blue",
};
Blue.parameters = {
  docs: {
    description: {
      story: "This is the Blue variant of the DashboardCard.",
    },
  },
};

export const Green = Template.bind({});
Green.args = {
  title: "Total Sales",
  value: "350",
  colorVariant: "green",
};

export const Red = Template.bind({});
Red.args = {
  title: "Total Sales",
  value: "12",
  colorVariant: "red",
};
