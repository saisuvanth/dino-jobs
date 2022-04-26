const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const output = document.getElementById("output")
localVideo.muted = true;

jar.onUpdate(code => {
  console.log(code)
  let cursor = jar.save();
  console.log(cursor)
})

currUser = {};
currUser.roomId = ROOM_ID;
currUser.initiated = false;

socket.on("connect", () => {
  currUser.userId = socket.id;
  currUser.username = user.name;
  document.getElementById("userIdHeader").innerText =
    currUser.username + " (Connecting)";
  socket.emit("join-room", currUser.roomId, socket.id, currUser.username);
});

socket.on("user-connected", ({ users }) => {
  console.log(users);
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId !== currUser.userId) {
      currUser.secondUser = users[i].userId;
      currUser.secondUserName = users[i].username;
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

    jar.onUpdate(code => {
      console.log(code)
      currUser.peer.send(JSON.stringify({ type: "code", data: code }));
    })

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
      let oldCursor = jar.save()
      jar.updateCode(recData.data)
      console.log(oldCursor)
      if (oldCursor.end < recData.data.length) {
      }
      else {
        oldCursor.end = recData.data.length
      }
      jar.restore(oldCursor)
    }
    if (recData.type == "chat") {
      addMessage(recData.data, currUser.secondUserName);
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

const evalCode = () => {
  let code = jar.toString()
  console.log(code)
  let url = `/interview/${currUser.roomId}/compile`
  console.log(url)
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      language: "cpp"
    })
  }).then(res => res.json())
    .then(res => {
      output.innerHTML = res.toString()
    })
}
