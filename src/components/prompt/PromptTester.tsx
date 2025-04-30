import React, { useState } from 'react';
import axios from 'axios';

const PromptTester = ({ promptId }: { promptId: string }) => {
  const [testInput, setTestInput] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`/api/prompts/test`, {
        promptId,
        parameters: testInput
      });
      setResponse(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-2">Test Prompt</h2>
      <textarea
        className="border p-1 rounded w-full mb-2"
        placeholder="JSON Input"
        value={JSON.stringify(testInput, null, 2)}
        onChange={(e) => {
          try {
            setTestInput(JSON.parse(e.target.value));
          } catch {
            // do nothing
          }
        }}
      />
      <button className="border rounded px-3 py-1 shadow" onClick={handleTest}>Test</button>
      {loading && <div className="mt-2">Testing...</div>}
      {error && <div className="mt-2 text-red-500">Error: {error}</div>}
      {response && (
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default PromptTester;