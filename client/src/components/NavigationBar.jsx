import React, { useState } from 'react';


import { Navbar, Nav, Form, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.mjs';
import { useToast } from './context/ToastContext';
import lotteryIcon from '../assets/lottery.png';
import PropTypes from "prop-types";
//The NavigationBar component is the navigation bar of the app
export default function NavigationBar({ setIsLoggedIn, setUser,setNotifiedOn }) {
  const { isLoggedIn, user } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const HandleLogout = async () => {
    try {
      await API.logout();
      setIsLoggedIn(false);
      setUser({ name: "", points: 0 });
      setNotifiedOn("");
      navigate("/");
    }
    catch (error) {
      showToast(error.message || "Error during logout", "danger");
    }

  }

  return (
    <Navbar bg="dark" variant="dark" expand="sm" >
      <Container fluid className="p-1 ">
        <Navbar.Brand >Instant lottery<img
          src={lotteryIcon}
          alt="Instant lottery logo"
          style={{ height: '40px' }}
        /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && <Nav.Link as={Link} to="/lottery" >Play</Nav.Link>} {/* uses link to use navigate */}
            {isLoggedIn && <Nav.Link as={Link} to="/leaderboard">Leaderboard</Nav.Link>}
          </Nav>
          {isLoggedIn && (
            <>
              <span className="text-white me-4">User: <b>{user.name}</b></span>
              <span className="text-white me-4">Points:<b> {user.points}</b></span>

              <button
                className="btn btn-outline-warning me-3"
                type="submit"
                onClick={HandleLogout}
              >
                Logout
              </button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>

  )
}

NavigationBar.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  setNotifiedOn: PropTypes.func.isRequired
}