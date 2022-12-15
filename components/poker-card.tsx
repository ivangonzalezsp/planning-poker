import styles from "../styles/Home.module.css";
import { MouseEventHandler } from "react";
import Button from "@mui/material/Button";

export const PlanningPokerCard = ({
  value,
  onClick,
  isSelected,
}: {
  value: number | string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isSelected?: boolean;
}) => {
  return (
    <Button
      variant={isSelected ? "outlined" : "contained"}
      className={styles.pokerCard}
      onClick={onClick}
    >
      {value}
    </Button>
  );
};
