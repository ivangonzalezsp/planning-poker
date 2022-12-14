import { Server } from "Socket.IO";

interface User {
  name: string;
  ready: boolean;
  votedFor: string;
}
const listOfUsers: User[] = [];
let listOfVotes: { [key: string]: string } = {};

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("Client Socket connected");
      socket.on("userConnected", (user) => {
        listOfUsers.push(user);
        socket.broadcast.emit("userConnected", listOfUsers);
      });
      socket.on("userVoted", (user) => {
        const identifiedUser = listOfUsers.find((u) => u.name === user.name);
        if (!identifiedUser) return;
        identifiedUser.ready = true;
        console.log(user);
        listOfVotes = { ...listOfVotes, [user.name]: user.votedFor };
        socket.broadcast.emit("userVoted", listOfUsers);
        console.log(listOfVotes);
      });
      socket.on("flipCards", () => {
        listOfUsers.forEach((user: User) => {
          user.votedFor =
            user.name in listOfVotes ? listOfVotes[user.name] : "-";
        });
        socket.broadcast.emit("flipCards", listOfUsers);
        console.log(listOfUsers);
      });
    });
  }
  res.end();
};

export default SocketHandler;
