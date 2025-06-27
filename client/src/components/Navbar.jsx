import React, { useContext } from 'react';
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const userId = localStorage.getItem('userId');
  const usertype = localStorage.getItem('usertype');
  const navigate = useNavigate();
  const { logout } = useContext(GeneralContext);

  return (
    <>
      {usertype === 'freelancer' ? (
        <div className="navbar">
          <h3>SB Works</h3>
          <div className="nav-options">
            <p onClick={() => navigate('/freelancer')}>Dashboard</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <p onClick={() => navigate('/all-projects')}>All Projects</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <p onClick={() => navigate('/my-projects')}>My Projects</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <p onClick={() => navigate('/myApplications')}>Applications</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <p onClick={() => logout()}>Logout</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            
            {/* Display userId if needed */}
            <p>User ID: {userId}</p>
          </div>
        </div>
      ) : (
        ''
      )}

      {usertype === 'client' ? (
        <div className="navbar">
          <h3>SB Works</h3>
          <div className="nav-options">
            <p onClick={() => navigate('/client')}>Dashboard</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => navigate('/new-project')}>New Project</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => navigate('/project-applications')}>Applications</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => logout()}>Logout</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* Display userId if needed */}
            <p>User ID: {userId}</p>
          </div>
        </div>
      ) : (
        ''
      )}

      {usertype === 'admin' ? (
        <div className="navbar">
          <h3>SB Works (admin)</h3>
          <div className="nav-options">
            <p onClick={() => navigate('/admin')}>Home</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => navigate('/all-users')}>All users</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => navigate('/admin-projects')}>Projects</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => navigate('/admin-applications')}>Applications</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p onClick={() => logout()}>Logout</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* Display userId if needed */}
            <p>Admin ID: {userId}</p>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Navbar;