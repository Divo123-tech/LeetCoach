import { useEffect, useState } from "react";
import "./App.css";
import AiInput from "./components/AiInput";
import { ChatMessage } from "./types";
import HelpButton from "./components/HelpButton/HelpButton";
import Chat from "./components/Chat";
import Logo from "./assets/Logo.png";
function App() {
  const [currentProblem, setCurrentProblem] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string | undefined>("");
  const [buttonDesc, setButtonDesc] = useState<string>("");
  const getUserCode = (className: string) => {
    // Select all div elements with the class 'view-line'
    const viewLineDivs = document.querySelectorAll(`div.${className}`);

    // Map over each div and extract the text content of all span elements inside it
    const spansContent = Array.from(viewLineDivs).map((div) => {
      const spans = div.querySelectorAll("span");
      const spansArray = Array.from(spans).map(
        (span) => span.innerText || span.textContent
      ); // Get the content of each span
      return spansArray[0];
    });

    return spansContent; // Return the array of spans content
  };

  // Function to send the message to the background script
  const getCurrentUrl = (): void => {
    chrome.runtime.sendMessage({ action: "getCurrentTabUrl" }, (response) => {
      if (response?.url) {
        const url = response.url;

        try {
          if (!url.includes("https://leetcode.com/problems")) {
            setError(true);
            return;
          }
          const problem = url.split("/")[4].split("-").join(" ");
          setCurrentProblem(problem);
          chrome.storage.local.get([problem], (result) => {
            console.log(result[problem]);
            if (result[problem]) {
              setChat(result[problem]);
              console.log("Chat history loaded from storage:", result[problem]);
            } else {
              console.log("No chat history found in storage");
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setError(true);
        }
      } else {
        setError(true);
      }
    });
  };

  const clearChat = () => {
    chrome.storage.local.set({ [`${currentProblem}`]: [] });
    setChat([]);
  };

  useEffect(() => {
    getCurrentUrl(); // Get the URL when the component mounts

    chrome.tabs
      .query({ active: true, lastFocusedWindow: true })
      .then(function (tabs) {
        const activeTab = tabs[0];
        const activeTabId = activeTab.id;
        if (activeTabId === undefined) {
          return;
        }
        return chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
          func: getUserCode,
          args: ["view-line"], // you can use this to target what element to get the html for
        });
      })
      .then(function (results) {
        console.log("results", results ? results[0].result?.join("\n") : []);
        setUserCode(results ? results[0].result?.join("\n") : "");
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [currentProblem]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold mb-2">LeetCoach</h2>
          {error ? (
            <>
              <p className="text-lg">
                Hi! it seems you're not on a leetcode problem!
              </p>
            </>
          ) : (
            <>
              <p className="text-md">
                {" "}
                Hi! I see you're doing the{" "}
                <span className="font-bold">{currentProblem} </span>problem, let
                me know if you would like some help!
              </p>
            </>
          )}
          {chat.length > 0 && (
            <div className="flex justify-end">
              <p
                className="underline text-gray-300 cursor-pointer hover:text-gray-400"
                onClick={clearChat}
              >
                Clear chat
              </p>
            </div>
          )}

          <Chat chat={chat} loading={loading} />

          {!error && (
            <div className="flex flex-col gap-2">
              <div className="h-4">
                <p>{buttonDesc}</p>
              </div>
              <div className="flex justify-around gap-2">
                <HelpButton
                  title="Data Structure"
                  setChat={setChat}
                  problem={currentProblem}
                  chat={chat}
                  message="Show me what data structure to use for this problem"
                  hint="what is the optimal data structure to use and why? 
                        Keep it concise in 3-4 sentences and respond like 
                        you're talking to the person one on one. Use HTML tags like <ul>, <li>, 
                        and <strong> to organize the content and make it readable. Here's the structure:

                        1. Data Structure explanation: Use <strong> for the title.
                        2. Time complexity explanation: Format the time complexity in <li> tags."
                  loading={loading}
                  setLoading={setLoading}
                  setButtonDesc={setButtonDesc}
                />
                <HelpButton
                  title="Step-by-Step"
                  setChat={setChat}
                  problem={currentProblem}
                  chat={chat}
                  message="Walk through a step-by-step process in plain English"
                  hint="walk me through step by step how to solve this and respond like 
                        you're talking to the person one on one. Only use one sentence explanations, and only explain the logic without any code examples.
                        Use HTML tags like <ul>, <li>, 
                        and <strong> to organize the content and make it readable Here's the structure:
                        
                        1.[First step here] 
                           - One sentence explanation.
                       2.[Second step here] 
                           - One sentence explanation.
                        make sure ITS NUMBERED "
                  loading={loading}
                  setButtonDesc={setButtonDesc}
                  setLoading={setLoading}
                />
                <HelpButton
                  title="Analyze My Code"
                  setChat={setChat}
                  problem={currentProblem}
                  chat={chat}
                  message="Can you analyze my code and explain where I need to go?"
                  hint={`this is my code ${userCode ? userCode : ""} 
                  1.Respond like  you're talking to the person one on one like a coach. 
                  2.Do so without giving me direct code solutions
                  instead only tell me what I'm doing wrong, right, and where I could go from here
                  Use HTML tags,  and <strong> to organize the content and make it readable, DONT USE MARKDOWN. 
                  3.For every section use a line break for readability.`}
                  loading={loading}
                  setLoading={setLoading}
                  setButtonDesc={setButtonDesc}
                />
              </div>
              <div className="flex items-center gap-4 py-2">
                <img src={Logo} className="w-12 rounded-full"></img>
                <p className="text-left">
                  <span className="font-bold">Struggling? </span>
                  I, Leet Coach, will do my best to help! Remember the best way
                  to get better is to work through the problem!
                </p>
              </div>

              <AiInput
                chat={chat}
                setChat={setChat}
                problem={currentProblem}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
