let websocket = undefined;
export async function getWebsocket(url) {
  console.log("websocket client", websocket);
  if (!websocket) {
    websocket = new WebSocket(url);
  }
  return websocket;
}

export async function getMessage(ws, action) {
  ws.on("open", () => {
    console.log("连接:" + ws.connected);
  });

  ws.on("message", message => {
    const data = {
      title: `服务端:${new Date().toLocaleString()}`,
      data: message.toString()
    };
    action(data);
  });
}

export async function send(ws, data) {
  // console.log("send", data);
  ws.sendMessage(JSON.stringify(data));
}
