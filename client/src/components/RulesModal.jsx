import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import PropTypes from "prop-types";
//The RulesModal component displays the rules of the lottery game while toggled,since it is a modal
function RulesModal({ show, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title><span className="fw-bold">How to play</span><br /></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span style={{ fontSize: '1.1rem', color: "black" }}>
                    This is an instant lottery where numbers are drawn periodically. In each draw, <b>5 numbers are randomly selected</b> from a pool of 90 numbers.<br />
                    The user can place a bet with <b>1 to 3 numbers</b>; <b>each number costs 5 points.</b><br />
                    The user is allowed to place only one bet at a time and <b>can lock/unlock the bet</b> until the next draw takes place.<br />
                    <b>Every 2 minutes</b>, when a new drawing takes place, the user wins points if he has a winning bet, according to the following table:
                    <Table striped bordered hover className="mt-2">
                        <thead>
                            <tr>
                                <th>Numbers Guessed</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1 number guessed</td>
                                <td>10 points</td>
                            </tr>
                            <tr>
                                <td>2 numbers guessed</td>
                                <td>20 points</td>
                            </tr>
                            <tr>
                                <td>3 numbers guessed</td>
                                <td>30 points</td>
                            </tr>
                        </tbody>
                    </Table>
                </span>
            </Modal.Body>
        </Modal>
    );
}

RulesModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};
export default RulesModal;