import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const notesInitial = [
    {
      _id: "note-1",
      user: "6a74882265001e465966bd0e",
      title: "My title",
      description: "Wake up early",
      tag: "General",
      date: "2026-08-07T11:03:14.966Z",
      __v: 0,
    },
    {
      _id: "note-2",
      user: "6a74882265001e465966bd0e",
      title: "My title",
      description: "Wake up early",
      tag: "General",
      date: "2026-08-07T11:03:15.983Z",
      __v: 0,
    },
    {
      _id: "note-3",
      user: "6a74882265001e465966bd0e",
      title: "My title",
      description: "Wake up early",
      tag: "General",
      date: "2026-08-07T11:03:14.966Z",
      __v: 0,
    },
    {
      _id: "note-4",
      user: "6a74882265001ed465966bd0e",
      title: "My title",
      description: "Wake up early",
      tag: "General",
      date: "2026-08-07T11:03:15.983Z",
      __v: 0,
    },
    {
      _id: "note-5",
      user: "6a74882265001e465966bd0e",
      title: "My title",
      description: "Wake up early",
      tag: "General",
      date: "2026-08-07T11:03:14.966Z",
      __v: 0,
    },
    {
      _id: "note-6",
      user: "6a74882265001e465966bd0e",
      title: "My title",
      description: "Wake up early",
      tag: "General",
      date: "2026-08-07T11:03:15.983Z",
      __v: 0,
    },
  ];

  const [notes, setNotes] = useState(notesInitial);

  //Add a note
  const addnote = (title, description, tag) => {
    const note = {
      _id: `note-${Date.now()}`,
      user: "6a74882265001e465966bd0e",
      title: title,
      description: description,
      tag: tag,
      date: new Date().toISOString(),
      __v: 0,
    };
    setNotes((prevNotes) => prevNotes.concat(note));
  };
  //Delete a note
  const deletenote = (id) => {
    console.log("delete", id);
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
  };
  //edit a note
  const editnote = (id) => {};
  return (
    <NoteContext.Provider value={{ notes, addnote, deletenote, editnote }}>
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
