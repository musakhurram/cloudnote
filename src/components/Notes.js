import React, { useContext } from "react";
import Noteitem from "./Noteitem";
import Addnote from "./Addnote";
import NoteContext from "../context/notes/NoteContext";

const Notes = () => {
  const context = useContext(NoteContext);
  const { notes } = context;

  return (
    <>
      <Addnote />
      <div className="row my-3">
        <h2>Your Note</h2>
        {notes.map((note) => {
          return <Noteitem key={note._id} note={note} />;
        })}
      </div>
    </>
  );
};

export default Notes;
