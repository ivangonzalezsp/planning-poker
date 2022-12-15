import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { PlanningPokerCard } from "../components/poker-card";
import { User } from "../components/user";
import { YourNameDialog } from "../components/name-dialog";
import { socketInitializer } from "../socketio/clientEvents";
import { initPusher } from "../pusher/clientEvents";

import * as PusherTypes from "pusher-js";

// Creates a dialog with a input to know the user name

let socket: PusherTypes.Channel;
export default function Home() {
  const [name, setName] = useState("");
  const [listOfUsers, setListOfUsers] = useState<
    { name: string; ready: boolean; votedFor: string }[]
  >([]);
  const [nameDialogOpen, setNameDialogOpen] = useState(true);
  const [selectedCard, setSelectedCard] = useState<number | string>("-");
  const [mode, setMode] = useState<"number" | "tshirt">("number");
  const planningPokerNumbers = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, "?"];
  const planningTShirts = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "?"];

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
    //socket = socketInitializer({ setListOfUsers, setMode, setSelectedCard });
    socket = initPusher({ setListOfUsers, setMode, setSelectedCard });
  }, []);

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
