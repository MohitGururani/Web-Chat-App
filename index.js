// Node Server which will handle Socket IO connections
const io = require('socket.io')(8080, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
  });
  
  const user = {};
  
  io.on('connection', socket => {
    // If any new user joins, let others users connected to the server know!
    socket.on('new-user-joined', name => {
      //console.log("New user", name);
      user[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
    });
  
    // if someone sends a message, broadcast it to other people
    socket.on('send', message => {
      socket.broadcast.emit('receive', { message: message, name: user[socket.id] });
    });


    // if someone leaves the chat,let other know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', user[socket.id]);
        delete user[socket.id];
      });


  });
  
  