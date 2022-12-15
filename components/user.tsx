import styles from "../styles/Home.module.css";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { lightGreen } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme, color }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: color === "success" ? "#44b700" : "red",
    color: color === "success" ? "#44b700" : "red",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const User = ({
  name,
  isReady,
  votedFor,
}: {
  name: string;
  isReady: boolean;
  votedFor?: number | string;
}) => {
  return (
    <div className={styles.user}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        color={isReady ? "success" : "error"}
      >
        <Avatar sx={{ bgcolor: lightGreen[400] }}>{name.charAt(0)}</Avatar>
      </StyledBadge>

      <div className={styles.userName}>{name}</div>
      <div className={styles.userVote}>{votedFor}</div>
    </div>
  );
};
