const app = require("express")();
const server = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.set('view engine', 'ejs')/*
app.use(express.static('public'))*/
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});



io.on("connection", (socket) => {
      socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });



	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});
    socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
		console.log("updateMyMedia");
		socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
	  });
	
	  socket.on("msgUser", ({ name, to, msg, sender }) => {
		io.to(to).emit("msgRcv", { name, msg, sender });
	  });
	socket.on("answerCall", (data) => {
		socket.broadcast.emit("updateUserMedia", {
			type: data.type,
			currentMediaStatus: data.myMediaStatus,
		  });
		io.to(data.to).emit("callAccepted", data.signal)
	});
    socket.on('message', ({name, message}) => {
        io.emit('message',{name,message})
    });
    	
	
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
