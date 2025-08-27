import { useState, useEffect, useRef } from "react";
const CHAT_URL = import.meta.env.VITE_CHAT_API;
function App() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào 👋, mình là Chatbot demo!" }
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        console.log(input);

        const userInput = input;
        setInput(""); // clear input
        setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

        try {
            const res = await fetch(CHAT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: userInput })
            });
            const data = await res.json();
            console.log(data);
            setMessages((prev) => [...prev, { sender: "bot", text: data.data?.bot_reply || "❌ Không có phản hồi" }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "❌ Lỗi kết nối server" }
            ]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* LEFT PANEL */}
            <div className="w-1/3 flex items-center justify-center bg-white shadow-lg">
                <h1 className="text-6xl font-extrabold text-blue-600 tracking-widest">
                    SENSEI
                </h1>
            </div>

            {/* RIGHT CHAT PANEL */}
            <div className="flex-1 flex flex-col p-6">
                {/* Khung chat */}
                <div className="flex-1 overflow-y-auto p-4 bg-white border rounded-lg shadow-lg space-y-2">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-2 rounded-lg max-w-xs whitespace-pre-wrap break-words ${
                                msg.sender === "user"
                                    ? "bg-blue-500 text-white self-end ml-auto"
                                    : "bg-gray-200 text-black mr-auto"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input box */}
                <div className="mt-3 flex items-end space-x-2">
    <textarea
        rows={1}
        className="flex-1 border rounded-lg px-3 py-2 resize-none overflow-y-auto whitespace-pre-wrap break-words"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Nhập tin nhắn..."
    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        onClick={handleSend}
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
