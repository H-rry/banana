import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext.tsx'; // Import the hook

interface Message {
    username: string;
    data: string;
    color?: string;
}

interface Player {
    id: string;
    name: string;
    color: string;
}

interface ChatProps {
    players?: Player[];
}

function Chat({ players = [] }: ChatProps) {
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
                <div className="chat playerCount" style={{ padding: '10px', borderBottom: '1px solid #444', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#ccc' }}>Active Players ({players.length}):</div>
                    <div style={{ gap: '8px' }}>
                        {players.map(p => (
                            <div key={p.id} style={{ color: p.color, fontSize: '0.9em', marginBottom: '4px' }}>
                                ● {p.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chat window">
                    {messages.map((msg, index) => (
                        <div key={index} className="message" style={{ color: msg.color || 'white' }}>
                            <strong style={{ color: msg.color || 'white' }}>{msg.username}: </strong>
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