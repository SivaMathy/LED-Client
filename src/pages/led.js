import React, { useState, useEffect } from "react";
import On from "../assets/on.png";
import Off from "../assets/off.png";

export default function Led() {
  const [ledStates, setLedStates] = useState(Array(5).fill(false));
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const userRole = localStorage.getItem("userRole");

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:7890/ledcontrol");
    setWs(socket);

    socket.onopen = function (event) {
      console.log("WebSocket connection established.");
      setConnectionStatus("Connected");
      // Fetch initial LED states from the server when the connection is established
      socket.send("getInitialStates");
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("Received LED States:", data);
      // Update the LED states in the frontend with the data fetched from the server
      const newLedStates = Array(5).fill(false);
      data.forEach((led) => {
        newLedStates[led.Id] = led.Status;
      });
      setLedStates(newLedStates);
    };

    socket.onerror = function (error) {
      console.error("WebSocket error: ", error);
      setConnectionStatus("Error");
    };

    socket.onclose = function (event) {
      console.log("WebSocket connection closed.");
      setConnectionStatus("Disconnected. Reconnecting...");
      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    return socket;
  };

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const socket = connectWebSocket();

    // Close WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const toggleLed = (index) => {
    const newLedStates = [...ledStates];
    newLedStates[index] = !newLedStates[index];
    setLedStates(newLedStates);

    // Send the changed LED state and user role to the server
    if (ws) {
      const message = `status:${index}:${userRole}`; // Adding user role to the message
      ws.send(message);
    }
  };

  return (
    <div>
      <div>Status: {connectionStatus}</div>
      {ledStates.map((state, index) => (
        <div key={index}>
          <img src={state ? On : Off} alt={`LED ${index}`} />
          {userRole == "Admin" && (
            <button onClick={() => toggleLed(index)}>
              {state ? "On" : "Off"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
