import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";
import Noteitem from "./Noteitem";
const Notes = () => {
   const context=useContext(NoteContext);
   const {notes} =context;
  return (
    <div className="row my-3">
      <h2>Your Note</h2>
      {notes.map((note)=>{
        return <Noteitem note={note}/>;
      })}
      </div>
  )
}

export default Notes;
