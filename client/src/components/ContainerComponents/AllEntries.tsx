import React, { useEffect, useState } from 'react';

interface Entry {
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const AllEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/entry/entries', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('somewhereAIToken')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>All Entries</h1>
      <ul>
        {entries.map(entry => (
          <li key={entry._id}>
            <h2>{entry.title}</h2>
            <p>{entry.text}</p>
            <p>{new Date(entry.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllEntries;
