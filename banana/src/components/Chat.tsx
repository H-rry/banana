import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext.tsx'; // Import the hook

interface Message {
    username: string;
    data: string;
}

function Chat() {
    // 1. Get the shared socket instance
    const { socket } = useSocket(); 
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (!socket) return;

        // 2. Attach listeners just like before
        socket.on("message", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Cleanup listener only (do not disconnect the socket!)
        return () => {
            socket.off("message");
        };
    }, [socket]);

    const sendMessage = () => {
        if (socket && currentMessage.trim() !== "") {
            socket.emit("message", { data: currentMessage });
            setCurrentMessage("");
        }
    };

    return (
        <div className="contents chat">
             <div className="chat-window" style={{ height: '80%', overflowY: 'auto', padding: '10px' }}>
                 {messages.map((msg, index) => (
                     <div key={index} className="message">
                         <strong>{msg.username}: </strong>
                         <span>{msg.data}</span>
                     </div>
                 ))}
             </div>
             <div className="chat-input" style={{ display: 'flex', marginTop: '10px' }}>
                 <input
                     type="text"
                     value={currentMessage}
                     onChange={(e) => setCurrentMessage(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                     placeholder="Type a message..."
                     style={{ flexGrow: 1 }}
                 />
                 <button onClick={sendMessage}>Send</button>
             </div>
         </div>
    );
}

export default Chat;