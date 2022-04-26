
exports.initSockets = (io) => {
  const userData = {};
  io.on("connection", (socket) => {
    let roomIdtemp, userIdtemp;
    socket.on("join-room", (roomId, userId, username) => {
      let initiate = false;
      roomIdtemp = roomId;
      userIdtemp = userId;
      if (userData[roomId]) {
        if (userData[roomId].users.includes(userId)) {
        } else {
          userData[roomId].users.push({
            userId: userId,
            initiated: initiate,
            username: username,
          });
        }
      } else {
        userData[roomId] = {
          users: [
            {
              userId: userId,
              initiated: initiate,
              username: username
            },
          ],
        };
      }
      socket.join(roomId);
      if (userData[roomId].users.length == 2) {
        userData[roomId].users[0].initiated = true;
        let users = userData[roomId].users;
        io.to(roomId).emit("user-connected", {
          users: users,
        });
      }
    });

    socket.on("offerToServer", ({ data, receiverId, senderId }) => {
      socket.to(receiverId).emit("offerToClient", { data, senderId });
    });

    socket.on("ready-to-init", (userId) => {
      io.to(userId).emit("init-peer");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", userData[roomIdtemp]?.users);
      if (userData[roomIdtemp]) {
        if (userData[roomIdtemp].users.length >= 2) {
          userData[roomIdtemp].users = [];
        }
      }
    });
  });
};
