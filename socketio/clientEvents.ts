import io from "socket.io-client";
import { User } from "../interfaces";

export const socketInitializer = async ({
  setListOfUsers,
  setMode,
  setSelectedCard,
}: {
  setListOfUsers: (listOfUsers: User[]) => void;
  setMode: (mode: "number" | "tshirt") => void;
  setSelectedCard: (selectedCard: number | string) => void;
}) => {
  await fetch("/api/socket");
  const socket = io();

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
  return socket;
};
