import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deletenote } = context;
  const { note,updatenote } = props;

  const handleDelete = () => {
    deletenote(note._id);
  };

  return (
    <div className="col-md-3 ">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <button
              type="button"
              className="btn btn-link p-0 mx-2"
              onClick={handleDelete}
              aria-label="Delete note"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <button
              type="button"
              className="btn btn-link p-0"
              aria-label="Edit note"
              onClick={() => updatenote(note)}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
