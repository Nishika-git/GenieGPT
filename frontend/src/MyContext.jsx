// import { createContext } from "react";

// export const MyContext= createContext("");

import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [mode, setMode] = useState("dark");
    const [allThreads, setAllThreads] = useState([]); // for Sidebar

    const toggleMode = () => {
        setMode(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <MyContext.Provider value={{
            prompt,
            setPrompt,
            reply,
            setReply,
            prevChats,
            setPrevChats,
            newChat,
            setNewChat,
            mode,
            toggleMode,
            allThreads,
            setAllThreads, // ✅ Make sure this is here
        }}>
            {children}
        </MyContext.Provider>
    );
}
