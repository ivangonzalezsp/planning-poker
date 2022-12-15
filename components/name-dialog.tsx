import { ChangeEvent, useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

export const YourNameDialog = ({
  handleOnSubmitName,
  isOpen,
}: {
  handleOnSubmitName: (userName: string) => void;
  isOpen: boolean;
}) => {
  const [name, setName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    handleOnSubmitName(name);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <TextField
          onChange={handleNameChange}
          id="standard-basic"
          label="What's your name?"
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
