import React, { useState } from 'react'
import './adminAdding.css'
export default function AdminAdding() {
      const [userData,SetUserData] = useState({
            name:"",
            room:"",
            admission:"",
            year:"",
            batch:""
      });
      const handleFormData = (e)=>{
            e.preventDefault();
            SetUserData({
                  name:"",
                  room:"",
                  admission:"",
                  batch:"",
                  year:""
            })
      }
  return (
    <div className='mainOuter'>
      <div className="adminEditing">
            <form className="editingSection" onSubmit={handleFormData}>
                  <label htmlFor="userName">Name</label>
                  <input 
                        type="text" 
                        placeholder='Enter your name' 
                        id='userName'
                        value={userData.name}
                        onChange={(e)=>{SetUserData({
                              ...userData,
                              name: e.target.value,
                            })}}
                        required
                  />
                  <label htmlFor="roomNumber">Room Number</label>
                  <input 
                        type="text" 
                        placeholder='Enter your Room Number' 
                        id='roomNumber'
                        value={userData.room}
                        onChange={(e)=>{SetUserData({
                              ...userData,
                              room: e.target.value,
                            })}}
                        required
                  />
                  <label htmlFor="admissionNumber">Admission Number</label>
                  <input 
                        type="text" 
                        placeholder='Enter your Admission Number' 
                        id='admissionNumber'
                        value={userData.admission}
                        onChange={(e)=>{SetUserData({
                              ...userData,
                              admission: e.target.value,
                            })}}
                        required
                  />
                  <label htmlFor="year">Year</label>
                  <input 
                        type="text" 
                        id="year" 
                        placeholder='Enter your year'
                        value={userData.year}
                        onChange={(e)=>{SetUserData({
                              ...userData,
                              year: e.target.value,
                            })}}
                        required
                  />
                  <label htmlFor="batch">Batch</label>
                  <input 
                        type="text" 
                        id="batch" 
                        placeholder='Enter your Batch'
                        value={userData.batch}
                        onChange={(e)=>{SetUserData({
                              ...userData,
                              batch: e.target.value,
                            })}}
                        required
                  />
                  <button type='submit'>Add Member</button>
            </form>
      </div>
    </div>
  )
}