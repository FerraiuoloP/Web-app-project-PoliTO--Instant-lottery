import React from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useToast } from './context/ToastContext';
import API from '../api/api.mjs';
import { useEffect, useState } from 'react';
import { useUser } from './context/UserContext';
import { TrophyFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';


//The Leaderboard component displays the top 3 users with the highest points.
export default function Leaderboard() {
  const { showToast } = useToast();
  const { refreshUser } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [updateTimer, setUpdateTimer] = useState(10);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const response = await API.fetchLeaderboard();
      setLeaderboard(response);

    } catch (error) {
      showToast(`Error during leaderboard fetch: ${error.message}`, "danger");
      refreshUser();
    }
  }

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 10000);
    const countdown = setInterval(() => {
      setUpdateTimer((prev) => (prev > 1 ? prev - 1 : 10));
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  const medalIcon = (index) => {
    switch (index) {
      case 0:
        return <TrophyFill className="text-warning" />; //used bootstrap colors for gold and silver
      case 1:
        return <TrophyFill className="text-secondary" />;
      case 2:
        return <TrophyFill style={{ color: "#CD7F32" }} />; //i picked a bronze color for the third place
      default:
        return null;
    }
  };

  const goToLottery = (e) => {
    navigate("/lottery");
  };


  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-center pt-3">
        <Col xs={10} md={9} className='main-body-border-black' style={{ maxWidth: "800px" }}>
          <Row className="justify-content-center mt-3">
            <Col xs={10} md={9} className=" pb-4 pt-2">
              <h1 className="text-center mb-4">Leaderboard</h1>

              <div className="d-flex justify-content-between border-bottom mb-2 me-2 ms-2">
                <span className="fw-bold h5">Username</span>
                <span className="fw-bold h5">Points</span>
              </div>

              <ul className="list-group">
                {leaderboard.map((user, index) => ( //display the top 3 users with their points
                  <li
                    key={user.username}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ height: '75px' }}
                  >
                    <span className="d-flex align-items-center">
                      {medalIcon(index)}
                      <span className="ms-2 fw-bold">{index + 1}° {user.username}</span>
                    </span>
                    <span className="fw-bold">{user.points}</span>
                  </li>
                ))}
              </ul>
              <p className="text-center text-muted">Next update in {updateTimer} seconds</p>
            </Col>
          </Row>
          <Row className="text-center mt-0">
            <Col> <b>Want to play? </b> <br />
              <Button variant="primary" onClick={goToLottery}>
                Go to the Lottery
              </Button>
            </Col>

          </Row>
        </Col>
      </Row>
    </Container>
  )
}












