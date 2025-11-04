import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";


function sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(null);
    const { mode } = useContext(MyContext);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getAllThreads = async () => {

        try {
            const response = await ffetch(`${API_BASE_URL}/api/thread`);
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            // console.log(filteredData);
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    const toggleDropdown = (threadId, e) => {
        e.stopPropagation(); // prevent li click
        setIsOpen(isOpen === threadId ? null : threadId);
    };

    return (
        <section className={`sidebar ${mode}`}>
            <button onClick={createNewChat}>
                <img src="https://play-lh.googleusercontent.com/lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A=w240-h480-rw" alt="gpt logo" className="logo"></img>
            </button>

            <div className="buttons">
                <span onClick={createNewChat}><i className="fa-solid fa-pen-to-square"></i>&nbsp;New Chat</span><br />
                <span><i className="fa-solid fa-magnifying-glass"></i>&nbsp;Search Chats</span><br />
                <span><i className="fa-solid fa-photo-film"></i>&nbsp;Library</span><br />
                <span></span>
            </div>

            <div className="sora">
                <span><i className="fa-solid fa-circle-play"></i>&nbsp;Sora</span><br />
                <span><i className="fa-solid fa-braille"></i>&nbsp;GPTs</span>
            </div>

            <div className="gpt">
                <span><i className="fa-regular fa-folder-open"></i>&nbsp;Projects</span>
            </div>



            <ul className="history" >
                <span>Chats</span>
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={(e) => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted" : " "} >
                            {thread.title}&nbsp;
                            <span><i className="fa-solid fa-ellipsis" onClick={(e) => toggleDropdown(thread.threadId, e)}></i></span>

                            {
                                isOpen === thread.threadId && (
                                    <div className="dropDown">
                                        <div className="dropDownItem"><i class="fa-solid fa-arrow-up-from-bracket"></i>&nbsp;Share</div>
                                        <div className="dropDownItem"><i class="fa-solid fa-pencil"></i>&nbsp;Rename</div>
                                        <hr />
                                        <div className="dropDownItem"><i class="fa-solid fa-box-archive"></i>&nbsp;Archive</div>
                                        <div className="dropDownItem">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Delete<i className="fa-solid fa-trash-can" onClick={(e) => {
                                            e.stopPropagation();
                                            deleteThread(thread.threadId);
                                        }}></i></div>
                                    </div>
                                )
                            }



                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Nishika &hearts;</p>

            </div>

        </section>
    )
}

export default sidebar;