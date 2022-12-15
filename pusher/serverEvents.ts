import Pusher from "pusher";

const pusher = new Pusher({});
export const PusherHandler = (req: any, res: any) => {
  const webhook = pusher.webhook(req);

  const data = webhook.getData();
};
