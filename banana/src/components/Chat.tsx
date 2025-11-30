import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext.tsx'; // Import the hook

interface Message {
    username: string;
    data: string;
    color?: string;
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
        <div className="chat border">
            <div className='chat container'>
                <div className="chat playerCount">
                    
                </div>
                <div className="chat window">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.username}: </strong>
                            <span>{msg.data}</span>
                        </div>
                    ))}
                </div>
                <div className="chat input">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="chat inputBar"
                    />
                    <button onClick={sendMessage} className="chat button">Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;