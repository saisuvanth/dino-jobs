const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const localVideo = document.getElementById("localVideo");
console.log(localVideo);
const remoteVideo = document.getElementById("remoteVideo");
localVideo.muted = true;

currUser = {};
currUser.roomId = ROOM_ID;
currUser.initiated = false;

socket.on("connect", () => {
  currUser.userId = socket.id;
  currUser.username = user.name;
  document.getElementById("userIdHeader").innerText =
    currUser.username + " (Connecting)";
  socket.emit("join-room", currUser.roomId, socket.id);
});

socket.on("user-connected", ({ users }) => {
  console.log(users);
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId !== currUser.userId) {
      currUser.secondUser = users[i].userId;
    }
    if (users[i].userId == currUser.userId) {
      currUser.initiator = users[i].initiated;
    }
  }
  console.log(currUser);
  if (currUser.secondUser != undefined) {
    socket.emit("ready-to-init", currUser.userId);
  }
});

socket.on("init-peer", () => {
  console.log("initing");
  initPeer();
});

const initPeer = () => {
  currUser.peer = new SimplePeer({
    initiator: currUser.initiator,
    trickle: false,
  });
  currUser.peer.on("signal", (data) => {
    console.log(
      "Sending " +
        data.type +
        " to " +
        currUser.secondUser +
        " through server " +
        Date.now()
    );
    socket.emit("offerToServer", {
      data,
      receiverId: currUser.secondUser,
      senderId: currUser.userId,
    });
  });

  socket.on("offerToClient", ({ data, senderId }) => {
    console.log(
      "Received " + data.type + " from " + senderId + " " + Date.now()
    );
    // console.log("Sending answer... ");
    currUser.peer.signal(data);
    console.log(currUser.peer);
  });

  currUser.peer.on("connect", () => {
    document.getElementById("userIdHeader").innerText =
      currUser.username + "  (Connected)";
    currUser.peer.send("whatever" + Math.random());
    document.querySelector("#editor-code").addEventListener("input", (e) => {
      e.preventDefault();
      let message = editor.getValue();
      console.log(message);
      currUser.peer.send(JSON.stringify({ type: "code", data: message }));
    });
    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      let message = document.querySelector("#chat_message").value;
      currUser.peer.send(JSON.stringify({ type: "chat", data: message }));
      addMessage(message, currUser.username);
      document.querySelector("#chat_message").value = "";
    });
  });

  currUser.peer.on("data", (data) => {
    let recData = JSON.parse(data);
    console.log(recData);
    if (recData.type == "code") {
      let oldCursor = editor.getCursorPosition();
      editor.setValue(recData.data);
      editor.moveCursorToPosition(oldCursor);
    }
    if (recData.type == "chat") {
      addMessage(recData.data, currUser.secondUser);
    }
  });

  currUser.peer.on("stream", (stream) => {
    addVideoStream(remoteVideo, stream);
  });
};

const addMessage = (message, sender) => {
  document.querySelector(".messages").innerHTML += `
  <div class="message">
    <b>${sender}:</b>
    <span>${message}</span>
  </div>`;
};

const startVideo = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      currUser.peer.addStream(stream);
      addVideoStream(localVideo, stream);
    })
    .catch((err) => console.log(err));
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.muted = true;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const toggleMute = () => {
  let allVids = document.querySelectorAll("video");
  allVids.forEach((vid) => {
    vid.muted = !vid.muted;
  });
  localVideo.muted = true;
};
