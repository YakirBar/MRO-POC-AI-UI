import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/ask_chatbot';

function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inFlight = useRef(false);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function send(e) {
    e?.preventDefault();
    const text = question.trim();
    if (!text || inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      });
      if (!response.ok) throw new Error(`Server returned HTTP ${response.status}`);
      const data = await response.json();
      const answer = typeof data === 'string' ? data : data.answer ?? data.response ?? data.message;
      if (typeof answer !== 'string') throw new Error('API response did not include a text answer.');
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', text: `Request failed: ${error.message}` }]);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return <div className="app">
    <header className="header"><div className="logo">✦</div><div><strong>MRO AI Assistant</strong><small>Maintenance manual Q&A</small></div></header>
    <main className="chat" aria-live="polite">
      {messages.length === 0 && <section className="empty"><div className="empty-icon">✦</div><h1>How can I help?</h1><p>Ask a technical question about your maintenance manuals.</p></section>}
      <div className="messages">{messages.map((message, index) => <div key={index} className={`message ${message.role}`}><div className="message-label">{message.role === 'user' ? 'You' : message.role === 'error' ? 'Error' : 'MRO Assistant'}</div><div className="message-text">{message.text}</div></div>)}
        {loading && <div className="message assistant"><div className="message-label">MRO Assistant</div><div className="dots" role="status" aria-label="Waiting for response"><span/><span/><span/></div></div>}
        <div ref={endRef}/></div>
    </main>
    <div className="composer-wrap"><form className="composer" onSubmit={send}><textarea aria-label="Your question" placeholder={loading ? 'Waiting for the answer…' : 'Ask a technical question…'} value={question} disabled={loading} rows={2} onChange={e => setQuestion(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}/><button type="submit" disabled={loading || !question.trim()} aria-label="Send question">➤</button></form><div className="hint">{loading ? 'Please wait for the current response' : 'Enter to send · Shift + Enter for a new line'}</div></div>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
