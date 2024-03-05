import React, { useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserContext} from '../context/userContext'

function Logout() {
  const {setCurrentUser} = useContext(UserContext);
  const navigate = useNavigate();
  setCurrentUser(null)
  navigate('/login')
  return (
   <>
   </>
  )
}

export default Logout