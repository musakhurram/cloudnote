import React, { useState, useCallback } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  const getnotes = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmE3NDg4MjI2NTAwMWU0NjU5NjZiZDBlIn0sImlhdCI6MTc4NjA5Njk1Nn0.jssWg0qbG2g8W-ySS8OOclYbM9c4XUVHvauUunJb_mo",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error("getnotes failed:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }, [host]);

  const addnote = useCallback(
    async (title, description, tag) => {
      const note = {
        _id: `note-${Date.now()}`,
        user: "demo-user",
        title,
        description,
        tag,
        date: new Date().toISOString(),
        __v: 0,
      };

      setNotes((prevNotes) => [note, ...prevNotes]);

      try {
        await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "demo-token",
          },
          body: JSON.stringify({ title, description, tag }),
        });
      } catch (error) {
        console.error("Failed to add note:", error);
      }
    },
    [host]
  );

  const deletenote = useCallback(
    async (id) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));

      try {
        await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "demo-token",
          },
        });
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    },
    [host]
  );

  const editnote = useCallback(
    async (id, title, description, tag) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? { ...note, title, description, tag } : note))
      );

      try {
        await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": "demo-token",
          },
          body: JSON.stringify({ title, description, tag }),
        });
      } catch (error) {
        console.error("Failed to edit note:", error);
      }
    },
    [host]
  );

  return (
    <NoteContext.Provider value={{ notes, addnote, deletenote, editnote, getnotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
