import React from 'react';

interface PromptFormProps {
  promptData: { name: string; text: string };
  setPromptData: React.Dispatch<React.SetStateAction<{ name: string; text: string }>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const PromptForm: React.FC<PromptFormProps> = ({ promptData, setPromptData, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-2 p-2">
      <input
        className="border p-1 rounded"
        type="text"
        placeholder="Prompt Name"
        value={promptData.name}
        onChange={(e) => setPromptData({ ...promptData, name: e.target.value })}
      />
      <textarea
        className="border p-1 rounded"
        placeholder="Prompt Text"
        value={promptData.text}
        onChange={(e) => setPromptData({ ...promptData, text: e.target.value })}
      />
      <button className="border rounded px-3 py-1 shadow" type="submit">Save</button>
    </form>
  );
};