class SocketServices {
  connection(socket) {
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
    });

    socket.on('send-all-data', (data) => console.log(data));
    socket.on('new-data', (newData) => console.log(newData));
  }
}

module.exports = new SocketServices();
