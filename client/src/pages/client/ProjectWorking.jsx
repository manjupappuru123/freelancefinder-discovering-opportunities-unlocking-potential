import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../../styles/client/ProjectWorking.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState();
  
  // Removed unused state variables clientId and projectId
  console.log(params.id);

  const fetchProject = useCallback(async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const joinSocketRoom = useCallback(async () => {
    await socket.emit("join-chat-room", { projectId: params.id, freelancerId: "" });
  }, [socket, params.id]);

  useEffect(() => {
    fetchProject(params.id);
    joinSocketRoom();
  }, [fetchProject, joinSocketRoom, params.id]);

  const handleApproveSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/approve-submission/${params.id}`);
      fetchProject(params.id);
      alert("Submission approved!!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/reject-submission/${params.id}`);
      fetchProject(params.id);
      alert("Submission rejected!!");
    } catch (err) {
      console.log(err);
    }
  };

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState();

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-chats/${params.id}`);
      setChats(response.data);
    } catch (err) {
      console.log(err);
    }
  }, [params.id]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const handleMessageFromUser = () => {
      fetchChats();
    };

    socket.on("message-from-user", handleMessageFromUser);
    return () => {
      socket.off("message-from-user", handleMessageFromUser);
    };
  }, [socket, fetchChats]);

  const handleMessageSend = async () => {
    socket.emit("new-message", {
      projectId: params.id,
      senderId: localStorage.getItem("userId"),
      text: message,
      time: new Date()
    });
    setMessage("");
    fetchChats();
  };

  return (
    <>
      {project && (
        <div className="project-data-page">
          <div className="project-data-container">
            <div className="project-data">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span>
                <h5>Required skills</h5>
                <div className="required-skills">
                  {project.skills.map((skill) => (
                    <p key={skill}>{skill}</p>
                  ))}
                </div>
              </span>
              <span>
                <h5>Budget</h5>
                <h6>&#8377; {project.budget}</h6>
              </span>
            </div>

            {project.freelancerId && project.freelancerId !== "" && (
              <div className="project-submissions-container">
                <h4>Submission</h4>
                <div className="project-submissions">
                  {project.submission ? (
                    <div className="project-submission">
                      <span>
                        <h5>Project Link: </h5>
                        <a href={project.projectLink} target='_blank' rel="noreferrer">
                          {project.projectLink}
                        </a>
                      </span>
                      <span>
                        <h5>Manual Link: </h5>
                        <a href={project.manualLink} target='_blank' rel="noreferrer">
                          {project.manualLink}
                        </a>
                      </span>
                      <h5>Description for work</h5>
                      <p>{project.submissionDescription}</p>
                      {project.submissionAccepted ? (
                        <h5 style={{ color: "green" }}>project completed!!</h5>
                      ) : (
                        <div className="submission-btns">
                          <button className='btn btn-success' onClick={handleApproveSubmission}>
                            Approve
                          </button>
                          <button className='btn btn-danger' onClick={handleRejectSubmission}>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>No submissions yet!!</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="project-chat-container">
            <h4>Chat with the Freelancer</h4>
            <hr />
            {project.freelancerId ? (
              <div className="chat-body">
                {chats && (
                  <div className="chat-messages">
                    {chats.messages.map((message) => (
                      <div
                        className={message.senderId === localStorage.getItem("userId") ? "my-message" : "received-message"}
                        key={message.id}
                      >
                        <div>
                          <p>{message.text}</p>
                          <h6>{message.time.slice(5, 10)} - {message.time.slice(11, 19)}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <hr />
                <div className="chat-input">
                  <input
                    type="text"
                    className='form-control'
                    placeholder='Enter something...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button onClick={handleMessageSend}>Send</button>
                </div>
              </div>
            ) : (
              <i style={{ color: '#938f8f' }}>Chat will be enabled if the project is assigned to you!!</i>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectWorking;