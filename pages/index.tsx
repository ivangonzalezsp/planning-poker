import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { lightGreen } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import io from "socket.io-client";

interface User {
  name: string;
  ready: boolean;
  votedFor: string;
}

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

// Creates a dialog with a input to know the user name
const YourNameDialog = ({
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

const PlanningPokerCard = ({
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

const User = ({
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
let socket: any;
export default function Home() {
  const [name, setName] = useState("");
  const [listOfUsers, setListOfUsers] = useState<
    { name: string; ready: boolean; votedFor: string }[]
  >([]);
  const [nameDialogOpen, setNameDialogOpen] = useState(true);
  const [selectedCard, setSelectedCard] = useState<number | string>("-");
  const [mode, setMode] = useState<"number" | "tshirt">("number");
  const handleOnName = (userName: string) => {
    setName(userName);
    setNameDialogOpen(false);
    socket.emit("userConnected", {
      name: userName,
      ready: false,
      votedFor: "-",
    });
  };

  const handleOnVote = (value: number | string) => {
    setSelectedCard(value);
    socket.emit("userVoted", {
      name,
      ready: true,
      votedFor: value,
    });
  };

  const handleOnFlipCards = () => {
    setSelectedCard("-");
    socket.emit("flipCards");
  };
  const handleResetRound = () => {
    setSelectedCard("-");
    socket.emit("resetVotes");
  };
  const handleMode = (mode: string) => {
    setMode(mode as "number" | "tshirt");
    socket.emit("cardMode", mode);
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("userConnected", (listOfUsers: User[]) => {
      console.log("user connected", listOfUsers);
      setListOfUsers(listOfUsers);
    });
    socket.on("userVoted", (listOfUsers: User[]) => {
      setListOfUsers(listOfUsers);
    });
    socket.on("flipCards", (listOfUsers: User[]) => {
      setSelectedCard("-");
      setListOfUsers(listOfUsers);
    });
    socket.on("resetVotes", (listOfUsers: User[]) => {
      setSelectedCard("-");
      setListOfUsers(listOfUsers);
    });
    socket.on("cardMode", (mode: string) => {
      setMode(mode as "number" | "tshirt");
    });
  };

  const planningPokerNumbers = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, "?"];
  const planningTShirts = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "?"];

  return (
    <div className={styles.container}>
      <Head>
        <title>Planning Poker App</title>
        <meta name="description" content="Planning Poker App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <YourNameDialog
          isOpen={nameDialogOpen}
          handleOnSubmitName={handleOnName}
        />
        <div className={styles.appContainer}>
          <div className={styles.boardOfCards}>
            {mode === "number"
              ? planningPokerNumbers.map((number) => (
                  <PlanningPokerCard
                    key={number}
                    value={number}
                    onClick={() => handleOnVote(number)}
                    isSelected={selectedCard === number}
                  />
                ))
              : planningTShirts.map((tShirt) => (
                  <PlanningPokerCard
                    key={tShirt}
                    value={tShirt}
                    onClick={() => handleOnVote(tShirt)}
                    isSelected={selectedCard === tShirt}
                  />
                ))}
          </div>
          <div className={styles.listOfUsers}>
            {listOfUsers.map((user) => (
              <User
                key={user.name}
                name={user.name}
                isReady={user.ready}
                votedFor={user.votedFor}
              />
            ))}
            <Button onClick={handleOnFlipCards} className={styles.flipButton}>
              Flip Cards
            </Button>
            <Button onClick={handleResetRound} className={styles.flipButton}>
              Reset Round
            </Button>
            {mode === "number" ? (
              <Button
                onClick={() => handleMode("tshirt")}
                className={styles.flipButton}
              >
                Change to TSHIRT Sizes
              </Button>
            ) : (
              <Button
                onClick={() => handleMode("number")}
                className={styles.flipButton}
              >
                Change to Numbers
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
