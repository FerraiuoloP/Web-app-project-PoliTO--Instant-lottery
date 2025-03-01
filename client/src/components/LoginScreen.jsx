import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useToast } from './context/ToastContext';
import API from '../api/api.mjs';
import { useNavigate } from 'react-router-dom';
import RulesModal from './RulesModal';
import PropTypes from "prop-types";

//LoginScreen component is the first screen the user sees when he opens the app.
export default function LoginScreen({ setIsLoggedIn, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModalRules, setShowModalRules] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleShowRules = () => setShowModalRules(true);
  const handleCloseRules = () => setShowModalRules(false);

  //OLD: now i use protectedRoute with allow=Allowed.LoggedOut
  // useEffect(() => {

  //     if(isLoggedIn){
  //         navigate("/lottery");
  //     }
  // }, [isLoggedIn])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      if (username === "" || password === "") {
        showToast("Please fill in all fields", "warning");
        return;
      }
      await API.login(username, password);
      setIsLoggedIn(true);
      const userAndPoints = await API.getCurrentUser();
      setUser({
        name: userAndPoints.username,
        points: userAndPoints.points,
      });
      showToast("Login successful", "success");
      navigate("/lottery");
    }
    catch (error) {
      showToast(error.message || "Error during login", "danger");
    }


  };

  return (
    <Container fluid  >
      <Row className="justify-content-center pt-3" >
        <Col xs={10} md={9} className='main-body-border-black pb-5' style={{ maxWidth: "800px" }}>
          <Row>
            <Col className="text-center mt-3">
              <p className='h3 pb-2'>Welcome to the instant lottery, login to play.</p>
              <span className='h5'><b>Want to know how to play? <Button variant="link" onClick={handleShowRules} className='p-0 m-0 text-align-center'>Check the rules here.</Button></b></span>
              <RulesModal show={showModalRules} handleClose={handleCloseRules} />
            </Col>
          </Row>
          <Row className="justify-content-center  mt-4">
            <Col xs={9} md={7} className="col-box-shadow-white pb-4 pt-2 ">
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="usernameForm">
                  <Form.Label><h5>Username</h5></Form.Label>
                  <Form.Control
                    placeholder="Your username"
                    value={username}
                    onChange={(user) => setUsername(user.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="pswForm">
                  <Form.Label ><h5>Password</h5></Form.Label>
                  <Form.Control
                    placeholder="Your password"
                    type="password"
                    value={password}
                    onChange={(psw) => setPassword(psw.target.value)}
                  />
                </Form.Group>

                <Button className="w-100" type="submit" >
                  Login
                </Button>
              </Form>
            </Col>
          </Row>


        </Col>
      </Row>
    </Container>
  );

};

LoginScreen.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
};



