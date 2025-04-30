import { useState } from 'react';
import axios from 'axios';

export default function PromptEditor() {
  const [name, setName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [parameters, setParameters] = useState('');
  const [responseFormat, setResponseFormat] = useState('json');

  const handleSave = async () => {
    await axios.post('/api/prompts', {
      name,
      promptText,
      parameters: JSON.parse(parameters),
      responseFormat,
    });
    alert('Prompt saved successfully!');
  };

  return (
    <div>
      <input type="text" placeholder="Prompt Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Prompt Text" value={promptText} onChange={(e) => setPromptText(e.target.value)} />
      <textarea placeholder='Parameters ({"var1": "value"})' value={parameters} onChange={(e) => setParameters(e.target.value)} />
      <select value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)}>
        <option value="json">JSON</option>
        <option value="text">Text</option>
      </select>
      <button onClick={handleSave}>Save Prompt</button>
    </div>
  );
}