import { useEffect, useRef } from 'react';
import { CHARACTERS } from '../data/dialogues';
import { playChat } from '../utils/sounds';

export default function TeamChat({ messages }) {
  const bottomRef = useRef(null);

  const prevCount = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > prevCount.current && prevCount.current > 0) {
      playChat();
    }
    prevCount.current = messages.length;
  }, [messages.length]);

  return (
    <div className="team-chat">
      <div className="team-chat__header">Team Chat</div>
      <div className="team-chat__messages">
        {messages.map((msg) => {
          const char = CHARACTERS[msg.character];
          if (!char) return null;
          return (
            <div key={msg.id} className="chat-message">
              <img
                className="chat-message__avatar"
                src={char.image}
                alt={char.name}
                style={{ borderColor: char.color }}
              />
              <div className="chat-message__body">
                <div className="chat-message__name" style={{ color: char.color }}>
                  {char.name} · {char.role}
                </div>
                <div className="chat-message__text">{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
