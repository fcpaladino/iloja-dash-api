import { Server as SocketIO } from "socket.io";
import { Server } from "http";

let _io: SocketIO;

const Redis = require("ioredis");
const redisClient = new Redis();

export const initSocketIO = (httpServer: Server = null): SocketIO => {
  _io = new SocketIO(httpServer,{
    cors: {
      origin: process.env.FRONTEND_URL
    },
    adapter: require("socket.io-redis")({
      pubClient: redisClient,
      subClient: redisClient.duplicate(),
    }),
  });

  _io.on("connection", async socket => {
    const { userId, companyId } = socket.handshake.query;
    if (userId && userId !== "undefined" && userId !== "null") {
      // await User.update({online: true}, {where: {id:userId}});
    }

    try{
      (async()=>{
        // await UserSocket.create({userId, companyId, event: 'connection', log: '', sId: socket?.id});
      })();
    } catch (e){}


    socket.join(`roomCompany${companyId}`);

    socket.on(`roomCompany${companyId}`, () => {
      socket.emit(`company ${companyId} conectado.`)
    });

    socket.on("error", (error) => {
      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'error', log: JSON.stringify(error)});
        })();
      } catch (e){}
    });
    socket.on("ping", (error) => {
      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'ping', log: JSON.stringify(error)});
        })();
      } catch (e){}
    });
    socket.on('reconnect', (error) => {
      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'reconnect', log: JSON.stringify(error)});
        })();
      } catch (e){}
    });
    socket.on('reconnect_attempt', (error) => {
      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'reconnect_attempt', log: JSON.stringify(error)});
        })();
      } catch (e){}
    });
    socket.on('reconnect_error', (error) => {
      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'reconnect_error', log: JSON.stringify(error)});
        })();
      } catch (e){}
    });
    socket.on('reconnect_failed', (error) => {
      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'reconnect_failed', log: JSON.stringify(error)});
        })();
      } catch (e){}
    });




    socket.on('disconnect', async(error) => {
      if (userId && userId !== "undefined" && userId !== "null") {
        // await User.update({online: false}, {where: {id: userId}});
      }

      try{
        (async()=>{
          // await UserSocket.create({userId, companyId, sId: socket?.id, event: 'disconnect', log: JSON.stringify(error)});
        })();
      } catch (e){}

    });

  });
  return _io;
};

export const getIO = (): SocketIO => {
  if (!_io) {
    return null;
  }
  return _io;
};
