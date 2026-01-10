import { WSServerPubSub, WSServerError } from "wsmini";
import { origin_frontend, jwt_secret } from "../../config.js";
import jwt from "jsonwebtoken";

function authCallback(token) {
  try {
    console.log("Token:", token);

    if (!token) {
      throw new WSServerError("Authentication failed: No token provided");
    }

    const decoded = jwt.verify(token, jwt_secret || "dev-secret");

    if (!decoded.username) return false;

    const user = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role || "user",
    };

    return user;
  } catch (err) {
    console.error("WS Auth callback error:", err.message);
    return false;
  }
}

const wsServer = new WSServerPubSub({
  port: 8887,
  origins: origin_frontend,
  authCallback,
});

wsServer.addChannel("notifications", {
  hookSubPost: (client, wsServer) => {
    console.log("Subscribed client : ", client);
  },
});

wsServer.addRpc("like", (data, clientMetadata, client, wsServer) => {
  console.log("Like received:", data);

  //an user like a board, data is expected to have boardId and userId and username
  if (data.username) {
    throw new WSServerError("Invalid data");
  }

  const from = data.from || "unknown";
  const to = data.username;

  const allClients = wsServer.getChannelClients("notifications");
  const toClients = allClients.filter(
    (c) => wsServer.clients.get(c).username === to
  );

  if (toClients.length === 0) {
    throw new WSServerError("Recipient not found");
  }

  const fromClients = allClients.filter(
    (c) => wsServer.clients.get(c).username === username
  );

  const info = {
    type: "like",
    whoLiked: from,
  };

  //send like notification to all connected clients of the recipient
  for (const fromSocket of fromClients) {
    wsServer.sendCmd(fromSocket, "notification", info);
  }

  return { status: "ok", message: "Like processed" };
});

export { wsServer };
