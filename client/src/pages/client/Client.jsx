import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../../styles/client/client.css';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      const pros = response.data.filter(pro => pro.clientId === localStorage.getItem('userId'));
      setProjects(pros);
      setDisplayProjects([...pros].reverse());
    } catch (err) {
      console.log(err);
      // Consider adding error handling or retry logic here
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (data) => {
    let filtered;
    switch (data) {
      case "":
        filtered = projects;
        break;
      case "Un Assigned":
        filtered = projects.filter((project) => project.status === "Available");
        break;
      case "In Progress":
        filtered = projects.filter((project) => project.status === "Assigned");
        break;
      case "Completed":
        filtered = projects.filter((project) => project.status === "Completed");
        break;
      default:
        filtered = projects;
    }
    setDisplayProjects([...filtered].reverse());
  };

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My projects</h3>
          <select 
            className='form-control' 
            placeholder='Project status' 
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">Choose project status</option>
            <option value="Un Assigned">Un Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <hr />

        {displayProjects.map((project) => (
          <div 
            className="listed-project" 
            key={project._id} 
            onClick={() => navigate(`/client-project/${project._id}`)}
          >
            <div className='listed-project-head'>
              <h3>{project.title}</h3>
              <p>{String(project.postedDate).slice(0, 25)}</p>
            </div>
            <h5>Budget - &#8377; {project.budget}</h5>
            <p>{project.description}</p>
            <div className="bids-data">
              <h6>Status - {project.status} </h6>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Client;