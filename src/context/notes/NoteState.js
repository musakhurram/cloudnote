import React, { useState, useCallback } from "react";
import NoteContext from "./NoteContext";
import API_URL from "../../config";

const NoteState = (props) => {
  const host = API_URL;
  const [notes, setNotes] = useState([]);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("token"),
  });

  const getnotes = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: authHeaders(),
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
      try {
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ title, description, tag }),
        });
        const data = await response.json();
        if (response.ok) {
          // Only add the note the server actually saved for this user.
          setNotes((prevNotes) => [data, ...prevNotes]);
        } else {
          console.error("Add note rejected:", response.status, data);
        }
      } catch (error) {
        console.error("Failed to add note:", error);
      }
    },
    [host]
  );

  const deletenote = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        if (response.ok) {
          setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        } else {
          console.error("Delete note rejected:", response.status, await response.text());
        }
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    },
    [host]
  );

  const editnote = useCallback(
    async (id, title, description, tag) => {
      try {
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ title, description, tag }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes((prevNotes) =>
            prevNotes.map((note) => (note._id === id ? data : note))
          );
          return true;
        } else {
          console.error("Edit note rejected:", response.status, data);
          return false;
        }
      } catch (error) {
        console.error("Failed to edit note:", error);
        return false;
      }
    },
    [host]
  );

  return (
    <NoteContext.Provider value={{ notes, setNotes, addnote, deletenote, editnote, getnotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
