import React, { useEffect, useRef, useState } from "react";
import { fetchChatHistory, sendChatMessage } from "../api/client";

const defaultMessage = {
  role: "assistant",
  content: "Hi! I'm MediCare, the virtual assistant for this Doctor Appointment Booking System. How can I help you today?"
};

const styles = {
  launcher: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 100,
    width: "60px",
    height: "60px",
    border: "none",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    boxShadow: "0 18px 34px rgba(37, 99, 235, 0.34)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  popup: {
    position: "fixed",
    right: "24px",
    bottom: "96px",
    zIndex: 100,
    width: "min(380px, calc(100vw - 32px))",
    height: "520px",
    maxHeight: "calc(100vh - 128px)",
    borderRadius: "22px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.24)",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "18px 20px"
  },
  title: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.2,
    fontWeight: 800
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    opacity: 0.86,
    fontWeight: 600
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "18px",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  row: {
    display: "flex"
  },
  bubble: {
    maxWidth: "82%",
    padding: "11px 13px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: 1.45,
    whiteSpace: "pre-wrap"
  },
  userBubble: {
    marginLeft: "auto",
    background: "#2563eb",
    color: "#ffffff",
    borderBottomRightRadius: "6px"
  },
  assistantBubble: {
    marginRight: "auto",
    background: "#e5e7eb",
    color: "#111827",
    borderBottomLeftRadius: "6px"
  },
  typing: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    fontStyle: "italic"
  },
  form: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    borderTop: "1px solid #e2e8f0",
    background: "#ffffff"
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "42px",
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    padding: "0 14px",
    outline: "none",
    fontSize: "14px"
  },
  sendButton: {
    height: "42px",
    padding: "0 16px",
    border: "none",
    borderRadius: "999px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer"
  }
};

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const getUserContext = () => {
  try {
    const user = getStoredUser();
    if (!user) return null;
    return `The user's name is ${user.firstName} ${user.lastName}, their email is ${user.email}, and their phone number is ${user.phone || "not provided"}.`;
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("medicare_auth_user") || localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const getUserId = (user) => String(user?._id || user?.id || "").trim();
const getStorageKey = (userId) => `medicare_chat_history_${userId || "guest"}`;

const MediCareChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState(() => getUserId(getStoredUser()));
  const [historyUserId, setHistoryUserId] = useState(() => getUserId(getStoredUser()));
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(getUserId(getStoredUser())));
      return saved ? JSON.parse(saved) : [defaultMessage];
    } catch {
      return [defaultMessage];
    }
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      const nextUserId = getUserId(getStoredUser());
      setActiveUserId((current) => (current === nextUserId ? current : nextUserId));
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    const timer = window.setInterval(syncUser, 1000);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadHistory = async () => {
      setHistoryUserId("");

      try {
        const saved = localStorage.getItem(getStorageKey(activeUserId));
        setMessages(saved ? JSON.parse(saved) : [defaultMessage]);
      } catch {
        setMessages([defaultMessage]);
      }

      if (!activeUserId) {
        setHistoryUserId(activeUserId);
        return;
      }

      try {
        const history = await fetchChatHistory(activeUserId);

        if (isActive && Array.isArray(history.messages)) {
          setMessages(history.messages.length ? history.messages : [defaultMessage]);
        }
      } catch (_error) {
        // Local history remains available if the backend is temporarily unreachable.
      } finally {
        if (isActive) {
          setHistoryUserId(activeUserId);
        }
      }
    };

    loadHistory();

    return () => {
      isActive = false;
    };
  }, [activeUserId]);

  useEffect(() => {
    if (historyUserId !== activeUserId) {
      return;
    }

    localStorage.setItem(getStorageKey(activeUserId), JSON.stringify(messages));
  }, [activeUserId, historyUserId, messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isLoading]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const content = input.trim();

    if (!content || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage({
        messages: nextMessages,
        userId: activeUserId,
        userContext: getUserContext()
      });

      setMessages(Array.isArray(data.messages) ? data.messages : (current) => [
        ...current,
        { role: "assistant", content: data.reply }
      ]);
    } catch (_error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <section style={styles.popup} aria-label="MediCare AI chat">
          <header style={styles.header}>
            <h2 style={styles.title}>MediCare</h2>
            <p style={styles.subtitle}>Doctor Appointment Assistant</p>
          </header>

          <div style={styles.messages}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} style={styles.row}>
                <div
                  style={{
                    ...styles.bubble,
                    ...(message.role === "user" ? styles.userBubble : styles.assistantBubble)
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && <p style={styles.typing}>MediCare is typing...</p>}
            <div ref={messagesEndRef} />
          </div>

          <form style={styles.form} onSubmit={sendMessage}>
            <input
              style={styles.input}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask MediCare..."
              aria-label="Message MediCare"
            />
            <button style={styles.sendButton} type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        style={styles.launcher}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close MediCare chat" : "Open MediCare chat"}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </>
  );
};

export default MediCareChat;
