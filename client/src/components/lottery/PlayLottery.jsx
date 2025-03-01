
import React from "react";
import { useState, useEffect } from 'react'
import { Container, Row, Col } from "react-bootstrap";
import CountdownTimer from './CountDownTimer';
import API from '../../api/api.mjs';
import dayjs from 'dayjs';
import { useToast } from '../context/ToastContext';
import PlaceBet from './PlaceBet';
import { useUser } from '../context/UserContext';
import LastBetResult from "./LastBetResult";
import PropTypes from "prop-types";
//The PlayLottery component is the main component (wrap) for the lottery section
//It displays the last draw result, the next draw date, the place bet component and the last bet result component
export default function PlayLottery() {
  const [draws, setDraws] = useState([]);
  const [drawDate, setDrawDate] = useState("");
  const [nextDrawDate, setNextDrawDate] = useState();
  const { showToast } = useToast();
  const { refreshUser } = useUser();

  const fetchLastDraw = async () => {
    try {
      let response = await API.fetchLastLotteryDraw();

      if(response.length === 0) //first draw has no data
        return;

      setDraws([response.number_1, response.number_2, response.number_3, response.number_4, response.number_5]);

      const last_draw = dayjs(Number(response.timestamp));
      setDrawDate(last_draw.format());

      refreshUser();//refresh user points
    } catch (error) {
      showToast(`Error during last draw fetch: ${error.message}`, "danger");
      refreshUser();

    }

  };

  const fetchNextDraw = async () => {
    try {
      let response = await API.fetchNextLotteryDraw();
      const next_draw = dayjs(Number(response.timestamp));
      setNextDrawDate(next_draw.format());
    } catch (error) {
      showToast(`Error during next draw fetch: ${error.message}`, "danger");
      refreshUser();
    }
  };

  useEffect(() => {
    fetchLastDraw();
    fetchNextDraw();

  }, []);





  return (
    <Container fluid>
      <Row className="justify-content-center pt-3">
        <Col xs={11} md={10} className='main-body-border-black pb-5' style={{ maxWidth: "890px" }}>
          <Row className="text-center pt-4">

          {draws.length > 0 ? <span className="h2">Last numbers drawn</span> : <span className="h2">No draws yet</span>}

          </Row>

          <Row className="justify-content-center align-items-center pt-3">
            {draws.length > 0 && draws.map((draw, index) => (
              <Col xs="auto" key={index}>
                <CircleNumbers number={draw} />
              </Col>
            ))}

          </Row>
          <Row className="text-center mt-3">
           {draws.length > 0 && <h5>Last draw took place on: { dayjs(drawDate).format('DD/MM/YYYY [at] HH:mm:s')}</h5>} 
          </Row>
          <Row className="text-center mt-3">
            <span className="h3">Next draw in:</span>  <span className="h4"><CountdownTimer targetDate={nextDrawDate} fetchNextDraw={fetchNextDraw} fetchLastDraw={fetchLastDraw} /></span>
          </Row>



          <PlaceBet drawDate={drawDate} />
          <LastBetResult drawDate={drawDate} />

        </Col>
      </Row>


    </Container>
  )





}




export function CircleNumbers({ number, size = "big", bgcolor = "white", color = "black" }) {

  return (
    <div className="circular-text" style={size == "small" ? { width: "30px", height: "30px", fontSize: "1rem", backgroundColor: bgcolor, color: color } : { width: "100px", height: "100px", fontSize: "3.1rem", backgroundColor: bgcolor, color: color }} >
      {number}
    </div>
  )

}
CircleNumbers.propTypes = {
  number: PropTypes.number.isRequired,
  size: PropTypes.string,
  bgcolor: PropTypes.string,
  color: PropTypes.string
};





