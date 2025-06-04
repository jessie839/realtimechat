import { useState } from 'react'
import { useRef } from 'react';
import io from "socket.io-client";
import './index.css';

function App() {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const socketRef = useRef(null);
  const [users,setUsers] = useState([]);
  const [messages,setMessages] = useState([]);
  const [message,setMessage] = useState("");
  const joinChat = () =>{
    if(username.trim()){
      socketRef.current = io("http://localhost:5001");
      socketRef.current.emit("join",username);
      socketRef.current.on("users", handleUserUpdate);
      socketRef.current.on("message", handleNewMessage);
      setJoined(true);
    }

  };
  const handleUserUpdate=(userList)=>{
    setUsers(userList)

  };
  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
  };

  const sendMessage = ()=>{
    if(message.trim()){
      socketRef.current.emit("sendMessage",{ username, message});
      setMessage("");
    }
  };

  const logout = ()=>{
    if(socketRef.current){
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setUsername("");
    setJoined(false);
    setMessage("");
    setMessages([]);
  };



  return (
    <div className='chat-container'>
      {!joined ? (
        <div className='chat-header'>
          <h2>Enter your name</h2>
          <div className='username-input'>
            <input type="text" placeholder="username..." value={username} onChange={(e) => setUsername(e.target.value)}/>
            <button onClick={joinChat}>Join Chat</button>
            </div>
            <p style={{ color: "grey", fontSize: "10px" }}>copyrightsreserved@jessitahannahselvi</p>
          </div>
      ): (
        <>
        <div className='chat-header joined'>
          <div>Welcome,{username}!</div>
          <button onClick={logout}>Logout</button>
        </div>
        <div className='users'>
          <strong>Online users:</strong> {users.join(", ")}
        </div>
        <div className='message-list'>
          {messages.map((msg, index)=>(
            <div
            key={index}
            className={`message ${msg.username === username? "me": ""}${
              msg.message.includes("joined the chat")||
              msg.message.includes("has left the chat")? "system": ""
            }`}
            >
              <strong>{msg.username}:</strong>{msg.message}
              </div>
          ))}
        </div>
        <div className='chat-input'>
          <input
          type="text"
          placeholder="type a message..."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          
          
        </div>
        </>
      )}
    </div>
  )
}

export default App
