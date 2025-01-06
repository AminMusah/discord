import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  // useEffect(() => {
  //   // Create a new socket connection
  //   const newSocket = io(url);
  //   socketRef.current = newSocket;

  //   // Handle connection events
  //   newSocket.on("connect", () => {
  //     setConnected(true);
  //     console.log("Connected to socket server");
  //   });

  //   newSocket.on("disconnect", () => {
  //     setConnected(false);
  //     console.log("Disconnected from socket server");
  //   });

  //   // Example of handling incoming messages
  //   newSocket.on("message", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   // Clean up on unmount
  //   return () => {
  //     socketRef.current.close();
  //     newSocket.disconnect();
  //   };
  // }, [url]);

  // Function to send messages
  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit("message", message);
    }
  };

  return { socket, connected, messages, sendMessage };
};

export default useSocket;
