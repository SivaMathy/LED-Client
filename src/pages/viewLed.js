import React, { useEffect, useState } from "react";

export default function ViewLed() {
  const [ledStatus, setLedStatus] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    let websocket;

    const connectWebSocket = () => {
      websocket = new WebSocket("ws://localhost:7890/ledcontrol");

      websocket.onopen = () => {
        setConnectionStatus("Connected");
        // Request LED status when the connection is established
        websocket.send("getInitialStates");
      };

      websocket.onmessage = (message) => {
        // Parse the received message data
        try {
          const ledArray = JSON.parse(message.data);
          // Map the LED states to a binary string with IDs
          const statusWithId = ledArray.map((led) => ({
            id: led.Id,
            status: led.Status ? "1" : "0",
          }));
          setLedStatus(statusWithId);
        } catch (error) {
          console.error("Error parsing LED status:", error);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
        setConnectionStatus("Error");
      };

      websocket.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("Disconnected. Reconnecting...");
        setTimeout(() => {
          connectWebSocket();
        }, 3000); // Attempt to reconnect every 3 seconds
      };
    };

    connectWebSocket();

    // Cleanup the WebSocket connection on component unmount
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>LED Status</h1>
      <div>Connection Status: {connectionStatus}</div>
      <div>
        {ledStatus.map((led) => (
          <div key={led.id}>
            LED {led.id}: {led.status}
          </div>
        ))}
      </div>
    </div>
  );
}
