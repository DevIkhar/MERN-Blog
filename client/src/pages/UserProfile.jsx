import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avtar from "../assets/avtar1.png"
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from '../context/userContext'
import axios from 'axios';


const UserProfile = ()=> {
  const[avtar, setAvtar]=useState('');
  const[name, setName]=useState('');
  const[email, setEmail]=useState('');
  const[currentPass, setCurrentPass]=useState('');
  const[newPass, setNewPass]=useState('');
  const[confirmNewPass, setConfirmNewPass]=useState('');
  const[isAvtarTouched, setIsAvtarTouched]=useState(false)
  const[error, setError]= useState('')

  
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate();

  // redirect to login page for any user who isn't logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  }, [])

  useEffect(()=>{
    const getUser = async ()=>{
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,{withCredentials: true, headers:{Authorization: `Bearer ${token}`}})
      const {name, email, avtar} = response.data;
      setName(name);
      setEmail(email);
      setAvtar(avtar);
    }
    getUser();
  }, [])

  const changeAvtarHandler= async ()=>{
    setIsAvtarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avtar', avtar);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avtar`,postData, {withCredentials: true, headers:{Authorization: `Bearer ${token}`}})
      setAvtar(response?.data.avtar)
    } catch (error) {
      console.log(error)
    }
  }

  const updateUserDetails= async (e)=>{
    e.preventDefault();

  try {
    const userData = new FormData();
    userData.set('name', name)
    userData.set('email', email)
    userData.set('currentPass', currentPass)
    userData.set('newPass', newPass)
    userData.set('confirmNewPass', confirmNewPass)

    const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`,{withCredentials: true, headers:{Authorization: `Bearer ${token}`}})
    if(response.status == 200){
      // Log user out
      navigate('/logout')
    }
  } catch (error) {
    // setError(error.response.data.message)
    console.log(error.response.data);
  }
  }

  return (
   <section className='profile'>
    <div className='container profile_container'>
      <Link to={`/myposts/${currentUser.id}`} className='btn'>My Posts</Link>
      <div className="profile_details">
        <div className="avtar_wrapper">
          <div className="profile_avtar">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avtar}`} alt="" />
          </div>

          {/* Form for updating profile */}
          <form className="avtar_form">
            <input type="file" name="avtar" id="avtar" onChange={e=>setAvtar(e.target.files[0])} accept='png, jpg, jpeg'/>
            <label htmlFor="avtar" onClick={()=>setIsAvtarTouched(true)}><FaEdit /></label>
          </form>
          {isAvtarTouched && <button className='profile_avtar-btn' onClick={changeAvtarHandler}><FaCheck /></button> }

        </div>
        <h1>{currentUser.name}</h1>

        {/* Form to update user details */}
        <form className='form profile_form' onSubmit={updateUserDetails}>
          {error && <p className='form_error-message'>{error}</p>}
          <input type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)} />
          <input type="text" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder='Current Password' value={currentPass} onChange={e=>setCurrentPass(e.target.value)} />
          <input type="password" placeholder='New Password' value={newPass} onChange={e=>setNewPass(e.target.value)} />
          <input type="password" placeholder='Confirm New Password' value={confirmNewPass} onChange={e=>setConfirmNewPass(e.target.value)} />
          <button type='submit' className='btn primary'>Update Details</button>
        </form>
      </div>
    </div>
   </section>
  )
}

export default UserProfile