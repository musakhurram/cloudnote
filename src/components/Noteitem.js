import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deletenote } = context;
  const { note, updatenote } = props;

  const handleDelete = () => {
    deletenote(note._id);
  };

  return (
    <article className="note-card">
      <div className="note-card-top">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            type="button"
            className="icon-btn edit"
            aria-label="Edit note"
            onClick={() => updatenote(note)}
          >
            <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className="icon-btn delete"
            onClick={handleDelete}
            aria-label="Delete note"
          >
            <i className="fa-solid fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      {note.tag && (
        <span className="note-tag">
          <i className="fa-solid fa-tag" aria-hidden="true"></i>
          {note.tag}
        </span>
      )}
      <p className="note-text">{note.description}</p>
    </article>
  );
};

export default Noteitem;
