import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { User } from "../interfaces";

let pusher: Pusher;
let channel: PusherTypes.Channel;
let listOfUsers: User[] = [];

export const initPusher = ({
  setListOfUsers,
  setMode,
  setSelectedCard,
}: {
  setListOfUsers: (listOfUsers: User[]) => void;
  setMode: (mode: "number" | "tshirt") => void;
  setSelectedCard: (selectedCard: number | string) => void;
}) => {
  if (!pusher || !channel) {
    pusher = new Pusher("544a83f3eb30bae28cde", {
      cluster: "eu",
    });

    Pusher.log = (msg) => {
      console.log(msg);
    };
    channel = pusher.subscribe("planner-poker"); // Hardcode for now, we should set a dialog to name the channel
    channel.bind("userConnected", (user: User) => {
      console.log("user connected", user);
      listOfUsers.push(user);
      setListOfUsers(listOfUsers);
    });
    channel.bind("userVoted", (listOfUsers: User[]) => {
      setListOfUsers(listOfUsers);
    });
    channel.bind("flipCards", (listOfUsers: User[]) => {
      setSelectedCard("-");
      setListOfUsers(listOfUsers);
    });
    channel.bind("resetVotes", (listOfUsers: User[]) => {
      setSelectedCard("-");
      setListOfUsers(listOfUsers);
    });
    channel.bind("cardMode", (mode: string) => {
      setMode(mode as "number" | "tshirt");
    });
  }

  return channel;
};
