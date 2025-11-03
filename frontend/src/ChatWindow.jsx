import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { AuthContext } from "./context/AuthContext.jsx";
import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";


function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, mode, toggleMode } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(null);

    const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
    // const navigate = useNavigate();



    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        console.log("message", prompt, "threadId", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://geniegpt-7v7s.onrender.com/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prev chat
    useEffect(
        () => {
            if (prompt && reply) {
                setPrevChats(prevChats => (
                    [...prevChats, {
                        role: "user",
                        content: prompt
                    },
                    {
                        role: "assistant",
                        content: reply
                    }]
                ));
            }
            setPrompt(" ");
        }, [reply]
    )

    const toggleDropdown = (e) => {
        e.stopPropagation(); // prevent li click
        setIsOpen(prev => !prev);
    };


    return (
        <div className={`chatWindow ${mode}`}>
            <div className="navbar">
                <span>GenieGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={(e) => toggleDropdown(e)} >
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
                {isOpen && (
                    <div className="dropDown1">
                        <div className="dropDownItem1"><i className="fa-solid fa-star"></i>&nbsp;Upgrade Plan</div>

                        <div className="dropDownItem1" onClick={toggleMode}>
                            <i className="fa-solid fa-adjust"></i>&nbsp;
                            {mode === "dark" ? "Light Mode" : "Dark Mode"}
                        </div>
                        <div className="dropDownItem1"><i className="fa-solid fa-circle-radiation"></i>&nbsp;Settings</div>
                        <hr />
                        <div className="dropDownItem1"><i className="fa-solid fa-life-ring"></i>&nbsp;Help</div>

                        <div>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    
                                    <p className="text-white">&nbsp;&nbsp;&nbsp;<i className="fa-solid fa-user"></i>&nbsp;{user?.email}</p>

                                    
                                    <button
                                        onClick={() =>
                                            logout({ logoutParams: { returnTo: window.location.origin } })
                                        }
                                        className="text-white bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600"
                                    >  &nbsp;&nbsp;&nbsp;
                                        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                                        &nbsp;
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => loginWithRedirect()}
                                    className="text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-500"
                                >&nbsp;&nbsp;&nbsp;
                                    <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                                    Login
                                </button>
                            )}
                        </div>


                    </div>
                )
                }
            </div>

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    ></input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-circle-arrow-up"></i></div>
                </div>
                <p className="info">GenieGPT can make mistakes. Check important info. See <span>Cookie Preferences.</span></p>
            </div>
        </div>
    )
}
export default ChatWindow;
