import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Noteitem from "./Noteitem";
import Addnote from "./Addnote";
import NoteContext from "../context/notes/NoteContext";
import { useNavigate } from "react-router-dom";

const ALL_KEY = "__all__";
const UNTAGGED_KEY = "__untagged__";

const Notes = () => {
  const context = useContext(NoteContext);
  const { notes, getnotes, editnote } = context;
  const [note, setNote] = useState({
    id: "",
    title: "",
    description: "",
    tag: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(ALL_KEY);
  const [query, setQuery] = useState("");
  const titleRef = useRef(null);
  const navigate = useNavigate();

  const updatenote = (currentNote) => {
    setNote({
      id: currentNote._id,
      title: currentNote.title,
      description: currentNote.description,
      tag: currentNote.tag,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (note.title.trim().length < 3 || note.description.trim().length < 5) {
      console.error(
        "Title must be at least 3 chars and description at least 5 chars.",
      );
      return;
    }
    const success = await editnote(
      note.id,
      note.title,
      note.description,
      note.tag,
    );
    if (success) {
      closeModal();
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Focus the title input once the modal opens
  useEffect(() => {
    if (modalOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [modalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [modalOpen]);

  // Fetch notes on mount (include getnotes in deps for lint safety)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getnotes();
    } else {
      navigate("/login");
    }
  }, [getnotes, navigate]);

  const canSave =
    note.title.trim().length >= 3 && note.description.trim().length >= 5;

  // Build the tag list for the sidebar, with a note count for each.
  const tagCounts = useMemo(() => {
    const counts = new Map();
    notes.forEach((n) => {
      const tag = n.tag && n.tag.trim() ? n.tag.trim() : null;
      const key = tag || UNTAGGED_KEY;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries())
      .filter(([key]) => key !== UNTAGGED_KEY)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [notes]);

  const untaggedCount = useMemo(
    () => notes.filter((n) => !n.tag || !n.tag.trim()).length,
    [notes],
  );

  // Apply the active sidebar filter, then the search query, on top of the raw notes.
  const visibleNotes = useMemo(() => {
    let list = notes;

    if (activeTag === UNTAGGED_KEY) {
      list = list.filter((n) => !n.tag || !n.tag.trim());
    } else if (activeTag !== ALL_KEY) {
      list = list.filter((n) => (n.tag || "").trim() === activeTag);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          (n.tag || "").toLowerCase().includes(q),
      );
    }

    return list;
  }, [notes, activeTag, query]);

  const isFiltering = activeTag !== ALL_KEY || query.trim().length > 0;

  // If the selected tag no longer has any notes (e.g. its last note was
  // deleted or renamed), fall back to "All notes" instead of showing a
  // permanently empty filter.
  useEffect(() => {
    if (activeTag === ALL_KEY) return;
    if (activeTag === UNTAGGED_KEY) {
      if (untaggedCount === 0 && notes.length > 0) setActiveTag(ALL_KEY);
      return;
    }
    const stillExists = tagCounts.some(([tag]) => tag === activeTag);
    if (!stillExists && notes.length > 0) setActiveTag(ALL_KEY);
  }, [tagCounts, untaggedCount, notes.length, activeTag]);

  return (
    <div className="page">
      <div className="notes-workspace">
        <aside className="notes-sidebar" aria-label="Filter notes">
          <span className="sidebar-label">Library</span>
          <button
            type="button"
            className={`sidebar-item ${activeTag === ALL_KEY ? "active" : ""}`}
            onClick={() => setActiveTag(ALL_KEY)}
          >
            <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
            All notes
            <span className="sidebar-count">{notes.length}</span>
          </button>
          {untaggedCount > 0 && (
            <button
              type="button"
              className={`sidebar-item ${activeTag === UNTAGGED_KEY ? "active" : ""}`}
              onClick={() => setActiveTag(UNTAGGED_KEY)}
            >
              <i className="fa-solid fa-file-lines" aria-hidden="true"></i>
              Untagged
              <span className="sidebar-count">{untaggedCount}</span>
            </button>
          )}

          {tagCounts.length > 0 && (
            <>
              <div className="sidebar-divider" role="separator"></div>
              <span className="sidebar-label">Tags</span>
              <div className="sidebar-tags">
                {tagCounts.map(([tag, count]) => (
                  <button
                    key={tag}
                    type="button"
                    className={`sidebar-item ${activeTag === tag ? "active" : ""}`}
                    onClick={() => setActiveTag(tag)}
                  >
                    <i className="fa-solid fa-tag" aria-hidden="true"></i>
                    {tag}
                    <span className="sidebar-count">{count}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        <div className="notes-main">
          <Addnote />

          <div className="notes-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search notes by title, content, or tag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search notes"
            />
          </div>

          <div className="notes-header">
            <div>
              <h1 className="notes-title">
                {activeTag === ALL_KEY
                  ? "Your notes"
                  : activeTag === UNTAGGED_KEY
                    ? "Untagged notes"
                    : activeTag}
              </h1>
              <p className="notes-subtitle">
                Everything you've saved, secured in the cloud.
              </p>
            </div>
            <span className="notes-count">
              <span>{visibleNotes.length}</span>{" "}
              {visibleNotes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fa-solid fa-note-sticky" aria-hidden="true"></i>
              </div>
              <h2 className="empty-title">No notes yet</h2>
              <p className="empty-text">
                Create your first note above and it will appear here.
              </p>
            </div>
          ) : visibleNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i
                  className="fa-solid fa-magnifying-glass"
                  aria-hidden="true"
                ></i>
              </div>
              <h2 className="empty-title">No matching notes</h2>
              <p className="empty-text">
                {isFiltering
                  ? "Try a different tag or search term."
                  : "Create your first note above and it will appear here."}
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {visibleNotes.map((item) => (
                <Noteitem key={item._id} updatenote={updatenote} note={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editModalTitle"
          >
            <div className="modal-header">
              <h2 className="modal-title" id="editModalTitle">
                <i className="fa-solid fa-pen" aria-hidden="true"></i>
                Edit Note
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
            <form onSubmit={handleClick}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="edit-title" className="form-label">
                    Title
                  </label>
                  <input
                    ref={titleRef}
                    type="text"
                    className="form-control"
                    id="edit-title"
                    name="title"
                    value={note.title}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="edit-description"
                    name="description"
                    value={note.description}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-tag"
                    name="tag"
                    value={note.tag}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canSave}
                >
                  <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
