import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { LockFill } from 'react-bootstrap-icons';
import API from '../../api/api.mjs';
import { useToast } from '../context/ToastContext';
import { CircleNumbers } from './PlayLottery';
import dayjs from 'dayjs';
import PropTypes from "prop-types";

//The LastBetResult component displays the last bet the user placed and the result of that bet (even if it is an old one)
export default function LastBetResult({ drawDate }) {
    const { showToast,notifiedOn,setNotifiedOn } = useToast();
    const [lastBet, setLastBet] = useState({});

    const fetchLastUserBet = async () => {
        try {
            const response = await API.getUserLastBet();

            if(response.length===0) //user has not placed a bet yet
                return;

            response.guess_numbers = response.guess_numbers.filter((el) => el != null); //remove null values so that the circles are not displayed
            response.correct_numbers = response.correct_numbers.filter((el) => el != null);
            const points_gained = response.right_numbers * 10;
            const points_spent = response.guess_numbers.length * 5;

            setLastBet({ ...response, points_spent: points_spent, points_gained: points_gained });
            
            //check if the last bet was the last draw and the notification has never been shown
            if (dayjs(Number(response.timestamp)).format() == drawDate && notifiedOn!=drawDate) {
                //setNotified to last date so that the notification is not shown again
                setNotifiedOn(drawDate)
                //show a different message based on the number of correct numbers
                if (response.right_numbers == response.guess_numbers.length) {
                    showToast(`Last round you have guessed all the numbers in your bet! Points gained: ${points_gained}`, "success");
                } else if (response.right_numbers > 0) {
                    showToast(`Last round you guessed ${response.right_numbers} out of 3 numbers. Points gained: ${points_gained}`, "success");
                }
                else {
                    showToast(`Last round no numbers were guessed correctly. Better luck next time!`, "info");
                }

            }
        } catch (error) {
            showToast(`Error while retrieving last bet: ${error.message}`, "danger");
        }
    };

    useEffect(() => {
        fetchLastUserBet();
    }, [drawDate]);

    return (
        <Row className="justify-content-center mt-4 "  >
            <Col xs="auto" className=" pt-3 pb-3 col-place-your-bet pe-5 ps-5">
                <Row className="text-center">
                    <h4> Your last bet </h4>
                    {lastBet.timestamp && <h6>{dayjs(Number(lastBet.timestamp)).format('DD/MM/YYYY [at] HH:mm:s')}</h6>}
                </Row>
                <Row className="justify-content-center mt-1 text-center">
                    {!lastBet.correct_numbers && <Col xs="auto">
                        It seems that you have not placed a bet yet. <br />
                        It will be displayed here once you do.
                    </Col>}
                </Row>
                <Row className="justify-content-center  text-center    g-2 ">
                    <Col xs="auto ">
                        {lastBet.correct_numbers && <h5>Drawn numbers:</h5>}
                    </Col>
                    {lastBet.correct_numbers && lastBet.correct_numbers.map((number, index) => (
                        <Col xs="auto" key={index}>
                            <CircleNumbers number={number} size={"small"} bgcolor={lastBet.guess_numbers.includes(number) ? "green" : "white"} color={lastBet.guess_numbers.includes(number) ? "white" : "black"} />
                        </Col>
                    ))}
                    {(lastBet.correct_numbers && lastBet.correct_numbers.length == 0) && "Numbers were not drawn due to a server error (shutting down before the draw)"}
                </Row>
                <Row className="justify-content-center  text-center align-items-center g-2 ">
                    <Col xs="auto ">
                    {lastBet.guess_numbers && <h5>Your numbers:</h5>}
                    </Col>
                    {lastBet.guess_numbers && lastBet.guess_numbers.map((number, index) => (
                        <Col xs="auto" key={index}>
                            <CircleNumbers number={number} size={"small"} bgcolor={lastBet.correct_numbers.includes(number) ? "green" : "white"} color={lastBet.correct_numbers.includes(number) ? "white" : "black"} />
                        </Col>
                    ))}
                </Row>

                <Row className="text-center justify-content-center mt-2  ">
                    <Col xs="auto ">
                        {lastBet.points_spent && <h5>Won: {lastBet.points_gained} points</h5>}
                        {lastBet.points_spent &&  <h5>Bet cost: {lastBet.points_spent} points</h5>}
                    </Col>

                </Row>


            </Col>

        </Row>);
}

LastBetResult.propTypes = {
    drawDate: PropTypes.string.isRequired,
};