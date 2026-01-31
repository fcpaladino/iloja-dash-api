import app from "./app";
import "./bootstrap";
import {initSocketIO} from "./utils/socketIO";

const server = app.listen(process.env.PORT, async () => {
  console.log('SERVER INIT', process.env.PORT);
});

initSocketIO(server);
