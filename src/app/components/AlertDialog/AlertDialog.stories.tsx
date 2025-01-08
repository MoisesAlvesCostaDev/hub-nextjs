import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import AlertDialog, { IAlertDialogProps } from "./AlertDialog";

const meta = {
  title: "Components/Modal",
  component: AlertDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>;

export default meta;

const Template: StoryFn<IAlertDialogProps> = (args) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button onClick={handleOpen}>Abrir Modal</button>
      <AlertDialog {...args} open={open} onClose={handleClose} />
    </div>
  );
};

export const Modal = Template.bind({});
Modal.args = {
  title: "Modal Title",
  text: "Modal text",
};
