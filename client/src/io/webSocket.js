module.exports= function webSocket(injected){
    const io = injected("io");
    const socketURI = injected("socketURI");

    return io.connect(socketURI);
}