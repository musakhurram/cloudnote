import React, { useContext, useState } from "react";
import NoteContext from "../../context/notes/NoteContext";

const Addnote = () => {
  const context = useContext(NoteContext);
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const { addnote } = context;

  const handleClick = (e) => {
    e.preventDefault();
    if (note.title.trim().length < 3 || note.description.trim().length < 5) {
      console.error("Title must be at least 3 chars and description at least 5 chars.");
      return;
    }
    addnote(note.title.trim(), note.description.trim(), note.tag.trim());
    setNote({ title: "", description: "", tag: "General" });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const canSubmit = note.title.trim().length >= 3 && note.description.trim().length >= 5;

  return (
    <section className="addnote-card" aria-label="Add a note">
      <h2 className="addnote-title">
        <i className="fa-solid fa-plus" aria-hidden="true"></i>
        Add a Note
      </h2>

      <form onSubmit={handleClick}>
        <div className="field-grid">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              placeholder="What is this note about?"
              value={note.title}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              placeholder="General"
              value={note.tag}
              onChange={onChange}
            />
          </div>
          <div className="form-group field-full">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Write your thoughts..."
              value={note.description}
              onChange={onChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
          <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
          Add Note
        </button>
      </form>
    </section>
  );
};

export default Addnote;
