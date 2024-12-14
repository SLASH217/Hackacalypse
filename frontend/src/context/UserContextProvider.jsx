import React from 'react'
import NoteContext from './createContext';
const NoteContextProvider = ({children}) => {

  return (
    <NoteContext.Provider>
      {children}
    </NoteContext.Provider>
  )
}

export default NoteContextProvider