import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1525333",
  key: "f9307b3b77efa448cb8b",
  secret: "43a0fbc315e98099ae6d",
  cluster: "eu",
});
export const PusherHandler = (req: any, res: any) => {
  const webhook = pusher.webhook(req);

  const data = webhook.getData();

  console.log(data);
};
