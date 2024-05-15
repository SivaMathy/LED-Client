import React, { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:7890/login");

    websocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    websocket.onmessage = (message) => {
      setMessage(message.data);
      if (message.data === "Admin") {
        localStorage.setItem("userRole", message.data); // Store user role
        window.location.href = "/light"; // Navigate to /light route for Admin
      } else if (message.data === "User") {
        localStorage.setItem("userRole", message.data); // Store user role
        window.location.href = "/view"; // Navigate to /view route for User
      } else {
        localStorage.removeItem("userRole");
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws) {
      ws.send(`login:${email},${password}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <b>Email</b>
        </label>
        <input type="email" value={email} onChange={handleEmailChange} />
        <br />
        <br />
        <label>
          <b>Password</b>
        </label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <br />
        <button type="submit">Login</button>
        <br />
        <br />
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}
