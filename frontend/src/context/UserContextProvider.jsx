import React, { useState, useEffect } from 'react';
import UserContext from './createContext';

const UserContextProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [broadCast, setBroadCast] = useState([]);
  
  const allBroadCasts = async () => {
    const response = await fetch('http://localhost:2000/broadcast/render', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });

    const json = await response.json();
    if (json.success) {
      setBroadCast(json.broadcasts);
    }
  };
  const deleteNote=async(id)=>{
    const response=await fetch(`${host}/notes/deletenote/${id}`,{

      method: 'DELETE',
      headers:{
        "auth-token": localStorage.getItem('token')
      }
}
    )
    //TO DO ADD API
    const newNote=notes.filter((note)=>{
        return note._id!==id
    })
    setNotes(newNote)
  }

  const getRole = async () => {
    const response = await fetch('http://localhost:2000/broadcast/role', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });

    const json = await response.json();
    setRole(json.role);
  };

  // Fetch role only once on mount
  useEffect(() => {
    getRole();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <UserContext.Provider value={{ role, allBroadCasts, setBroadCast, broadCast }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
