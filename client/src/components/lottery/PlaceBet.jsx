import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { LockFill, UnlockFill } from 'react-bootstrap-icons';
import API from '../../api/api.mjs';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import RulesModal from '../RulesModal';
import PropTypes from "prop-types";
//The PlaceBet component allows the user to place a bet for the next draw, or to remove the current bet if it is already placed.
export default function PlaceBet({ drawDate }) {
    const { showToast } = useToast();
    const { refreshUser, user } = useUser();
    const [betNumbers, setBetNumbers] = useState({
        number1: '',
        number2: '',
        number3: ''
    });
    const [betLocked, setBetLocked] = useState(false);
    const [showModalRules, setShowModalRules] = useState(false);


    //fetch the current bet if it exists. This is useful if the user refreshes/changes page
    const retreiveCurrentBet = async () => {
        try {
            const response = await API.getUserCurrentBet();
            if (response.guess_numbers && response.guess_numbers.length > 0) {
                setBetLocked(true);
                setBetNumbers({
                    number1: response.guess_numbers[0] ? response.guess_numbers[0] : '',
                    number2: response.guess_numbers[1] ? response.guess_numbers[1] : '',
                    number3: response.guess_numbers[2] ? response.guess_numbers[2] : '',
                });
            }
            else {
                setBetLocked(false);
                setBetNumbers({
                    number1: '',
                    number2: '',
                    number3: ''
                });
            }
        } catch (error) {
            showToast(`Error while retrieving current bet: ${error.message}`, "danger");
        }
    }

    useEffect(() => {
        retreiveCurrentBet();
    }, [drawDate]);

    const handleLockUnlockBet = async (e) => {
        e.preventDefault();
        if (!betLocked) {
            try {

                let numbers = [];
                for (let i = 1; i <= 3; i++) {
                    if (e.target[`number${i}`].value !== "") {
                        if (numbers.includes(Number(e.target[`number${i}`].value))) {
                            showToast("Please select different numbers", "warning");
                            return;
                        }
                        numbers.push(Number(e.target[`number${i}`].value));

                    }
                }
                if (numbers.length == 0) {
                    showToast("Please select at least one number", "warning");
                    return;
                }
                if (user.points < numbers.length * 5) {
                    showToast("You don't have enough points to place this bet", "warning");
                    return;
                }


                await API.placeBet(numbers);
                setBetLocked(true);
                showToast("Your bet has been placed, good luck!", "success", "bet");

            }
            catch (error) {
                console.error("Error placing bet:", error);
                showToast(`${error.message}: new bet has not been not placed`, "danger");

            }
            finally {
                refreshUser(); //if the bet has been placed it will just refresh the user points, otherwise it will also check if the user has been logged out (cause server restarted/session expired...)
            }
        } else {
            try {
                await API.deleteBet();
                setBetLocked(false);
                showToast("Your bet has been removed", "success", "bet");
            }
            catch (error) {
                showToast(`${error.message}: bet has not been removed`, "danger");
            }
            finally {
                refreshUser(); //if the bet has been removed it will just refresh the user points, otherwise it will also check if the user has been logged out (cause server restarted/session expired...)
            }

        }
    }

    const handleChangeNumbers = (e) => {
        //some validation (also done server side while placing/removing the bet)
        if (e.target.value.length > 2) { //max 2 digits!
            setBetNumbers(betNumbers => ({
                ...betNumbers,
                [e.target.name]: e.target.value.slice(0, 2),
            }));
        }
        else if (isNaN(e.target.value) || e.target.value < 1 || e.target.value > 90) { //only numbers between 1 and 90!
            setBetNumbers(betNumbers => ({
                ...betNumbers,
                [e.target.name]: e.target.value.slice(0, e.target.value.length - 1),
            }));
        }
        else {
            setBetNumbers(betNumbers => ({
                ...betNumbers,
                [e.target.name]: e.target.value,
            }));
        }
    }
    const button_style = {
        maxWidth: "200px",
        backgroundColor: betLocked ? "red" : "green",
    }

    const handleShowRules = () => setShowModalRules(true);
    const handleCloseRules = () => setShowModalRules(false);

    return (
        <Row className="justify-content-center mt-4 "  >
            <Col xs="auto" className=" pt-3 pb-3 col-place-your-bet pe-5 ps-5">
                <Row className="text-center ">
                    <span className='h4 p-0 m-0'> {betLocked ? "Placed bet" : "Place your bet"} </span>
                </Row>
                <Row className='justify-content-center'> <Button variant="link" onClick={handleShowRules} className='p-0' style={{ width: "auto" }}>
                    How to play?
                </Button></Row>
                <RulesModal show={showModalRules} handleClose={handleCloseRules} />
                <Row className="justify-content-center mt-1 text-center">
                    <Col xs="auto">
                        <span className='h6'>Your balance: <b> {user.points} points</b></span>
                    </Col>
                    <Col xs="auto">
                        <span className='h6'>Bet cost: <b>{Object.values(betNumbers).filter(num => num !== '').length * 5} points</b></span>
                    </Col>
                </Row>
                <Form onSubmit={handleLockUnlockBet}>
                    <Form.Group as={Row} className="mt-1 justify-content-center align-items-center" name="selectNumbers" >

                        <Form.Label column sm="auto" className="text-center"><h5>{betLocked ? "Your" : "Pick your"} numbers:</h5></Form.Label>
                        <Col xs="auto"  > {/* i added the column + (the next) row  to allow all tge input field to move down together while resizing the window*/}
                            <Row className="justify-content-center align-items-center">
                                <Col xs="auto">
                                    <input type="text" name="number1" readOnly={betLocked} className="input-only-bottom-line" onChange={handleChangeNumbers} placeholder="?" value={betNumbers.number1} />
                                </Col>
                                <Col xs="auto">
                                    <input type="text" name="number2" readOnly={betLocked} className="input-only-bottom-line" onChange={handleChangeNumbers} placeholder="?" value={betNumbers.number2} />
                                </Col>
                                <Col xs="auto">
                                    <input type="text" name="number3" readOnly={betLocked} className="input-only-bottom-line" onChange={handleChangeNumbers} placeholder="?" value={betNumbers.number3} />
                                </Col>
                            </Row>
                        </Col>
                    </Form.Group>
                    <Row className="text-center justify-content-center mt-2 ">
                        <Button type="submit" className="btn btn-dark" style={button_style} ><b> {betLocked ? <>Unlock my bet <UnlockFill /></> : <>Lock my bet <LockFill /></>} </b></Button>
                    </Row>
                </Form>

            </Col>

        </Row>
    )

}

PlaceBet.propTypes = {
    drawDate: PropTypes.string.isRequired,
}