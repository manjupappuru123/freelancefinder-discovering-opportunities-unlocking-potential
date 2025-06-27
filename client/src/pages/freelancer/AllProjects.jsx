import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/AllProjects.css';

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      const projectData = response.data;
      setProjects(projectData);
      setDisplayProjects([...projectData].reverse());

      // Extract all unique skills
      const skills = new Set();
      projectData.forEach((project) => {
        project.skills.forEach((skill) => {
          skills.add(skill);
        });
      });
      setAllSkills(Array.from(skills));
    } catch (err) {
      console.log(err);
      // Consider adding error handling or retry logic
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(size => size !== value));
    }
  };

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        projects
          .filter(project => 
            categoryFilter.every(skill => project.skills.includes(skill))
          )
          .reverse()
      );
    } else {
      setDisplayProjects([...projects].reverse());
    }
  }, [categoryFilter, projects]);

  return (
    <>
      {projects.length > 0 ? (
        <div className="all-projects-page">
          <div className="project-filters">
            <h3>Filters</h3>
            <hr />
            <div className="filters">
              <h5>Skills</h5>
              {allSkills.length > 0 && (
                <div className="filter-options">
                  {allSkills.map((skill) => (
                    <div className="form-check" key={skill}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={skill}
                        id={`skill-${skill}`}
                        onChange={handleCategoryCheckBox}
                      />
                      <label className="form-check-label" htmlFor={`skill-${skill}`}>
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="projects-list">
            <h3>All projects</h3>
            <hr />
            {displayprojects.map((project) => (
              <div
                className="listed-project"
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="listed-project-head">
                  <h3>{project.title}</h3>
                  <p>{String(project.postedDate).slice(0, 24)}</p>
                </div>
                <h5>Budget &#8377; {project.budget}</h5>
                <p>{project.description}</p>
                <div className="skills">
                  {project.skills.map((skill) => (
                    <h6 key={skill}>{skill}</h6>
                  ))}
                </div>
                <div className="bids-data">
                  <p>{project.bids.length} bids</p>
                  <h6>
                    &#8377;{' '}
                    {project.bids.length > 0
                      ? project.bidAmounts.reduce(
                          (accumulator, currentValue) => accumulator + currentValue,
                          0
                        )
                      : 0}{' '}
                    (avg bid)
                  </h6>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading projects...</p>
      )}
    </>
  );
};

export default AllProjects;