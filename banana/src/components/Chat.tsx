// import React from 'react'

// function Chat() {
//     return (
//         <div className="contents chat">
                
//         </div>
//     )
// }

// export default Chat
// import React, { useState, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';

// // Define the structure of a message
// interface Message {
//     username: string;
//     data: string;
// }

// function Chat() {
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [currentMessage, setCurrentMessage] = useState("");

//     useEffect(() => {
//         // 1. Initialize the socket connection
//         // We don't need to specify a URL because the proxy handles it
//         const newSocket = io(); 
//         setSocket(newSocket);

//         // 2. Listen for incoming messages from the backend
//         // Your backend emits a "message" event
//         newSocket.on("message", (msg: Message) => {
//             console.log("Message recieved");
//             setMessages((prevMessages) => [...prevMessages, msg]);
//         });

//         // Cleanup on unmount
//         return () => {
//             newSocket.disconnect();
//         };
//     }, []);

//     const sendMessage = () => {
//         if (socket && currentMessage.trim() !== "") {
//             // 3. Send message to backend
//             // Your backend expects a dictionary with a key 'data'
//             console.log("Message sent");
//             socket.emit("message", { data: currentMessage });
//             setCurrentMessage("");
//         }
//     };

//     return (
//         <div className="contents chat">
//             <div className="chat-window" style={{ height: '80%', overflowY: 'auto', padding: '10px' }}>
//                 {messages.map((msg, index) => (
//                     <div key={index} className="message">
//                         <strong>{msg.username}: </strong>
//                         <span>{msg.data}</span>
//                     </div>
//                 ))}
//             </div>
//             <div className="chat-input" style={{ display: 'flex', marginTop: '10px' }}>
//                 <input
//                     type="text"
//                     value={currentMessage}
//                     onChange={(e) => setCurrentMessage(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                     placeholder="Type a message..."
//                     style={{ flexGrow: 1 }}
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// }

// export default Chat;
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
        <div className="contents chat">
             <div className="chat-window" style={{ height: '80%', overflowY: 'auto', padding: '10px' }}>
                 {messages.map((msg, index) => (
                     <div key={index} className="message">
                         <strong style={{ color: msg.color || 'inherit' }}>{msg.username}: </strong>
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