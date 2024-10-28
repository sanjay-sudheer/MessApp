import React from 'react'
import {Link} from 'react-router-dom';
import './adminEditingOptions.css'
import deleteIcon from '../assests/delete.png'
import addIcon from '../assests/add-user.png'
import editIcon from '../assests/editing.png'
import userProfilePic from '../assests/user-profile-icon-removebg-preview.png'
export default function AdminEditingOptions() {
  return (
    <div className='outerDiv'>
      <div className='adminEditingheader'>
        <span>Edit Members</span>
        <Link to='/AdminAddingSection'><img src={addIcon} alt="" title='add member'/></Link>
      </div>
      <div className="userListDiv">
        <div className="userDetail">
          <div className="userNamePictureDiv">
            <img src={userProfilePic} alt="" className='userProfilePic'/>
            <span className='userName'>Sanjay Sudheer 
              <br />
              <span className='userDescription'>11025-22</span>
            </span>
          </div>
          <div className="editingIconSections">
            <Link to='/adminEditSection'><img src={editIcon} alt="" title='edit member'/></Link>
            <Link to='/AdminEditing'><img src={deleteIcon} alt="" title='remove member'/></Link>
          </div>
        </div>
      </div>
    </div>
  )
}