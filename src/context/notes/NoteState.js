import React, { useState } from 'react'
import NoteContext from './NoteContext';


const NoteState = (props) => {
    const notesInitial=[
        {
    "_id": "6a75bb728fc2bac98b7dd2da",
    "user": "6a74882265001e465966bd0e",
    "title": "My title",
    "description": "Wake up early",
    "tag": "General",
    "date": "2026-08-07T11:03:14.966Z",
    "__v": 0
  },
  {
    "_id": "6a75bb738fc2bac98b7dd2db",
    "user": "6a74882265001e465966bd0e",
    "title": "My title",
    "description": "Wake up early",
    "tag": "General",
    "date": "2026-08-07T11:03:15.983Z",
    "__v": 0
  },
  {
    "_id": "6a75bb728fc2bac98b7dd2da",
    "user": "6a74882265001e465966bd0e",
    "title": "My title",
    "description": "Wake up early",
    "tag": "General",
    "date": "2026-08-07T11:03:14.966Z",
    "__v": 0
  },
  {
    "_id": "6a75bb738fc2bac98b7dd2db",
    "user": "6a74882265001e465966bd0e",
    "title": "My title",
    "description": "Wake up early",
    "tag": "General",
    "date": "2026-08-07T11:03:15.983Z",
    "__v": 0
  },
  {
    "_id": "6a75bb728fc2bac98b7dd2da",
    "user": "6a74882265001e465966bd0e",
    "title": "My title",
    "description": "Wake up early",
    "tag": "General",
    "date": "2026-08-07T11:03:14.966Z",
    "__v": 0
  },
  {
    "_id": "6a75bb738fc2bac98b7dd2db",
    "user": "6a74882265001e465966bd0e",
    "title": "My title",
    "description": "Wake up early",
    "tag": "General",
    "date": "2026-08-07T11:03:15.983Z",
    "__v": 0
  }
    ]
    const [notes, setNotes] =useState(notesInitial);
    return(
   <NoteContext.Provider value={{notes,setNotes}}>
    {props.children}
   </NoteContext.Provider>
    )
}
export default NoteState;