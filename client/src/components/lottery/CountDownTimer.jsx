import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import PropTypes from "prop-types";

//This component is used to show a countdown timer until the next draw
const CountdownTimer = ({ targetDate, fetchNextDraw, fetchLastDraw }) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const { showToast } = useToast();

  //calculate the time left until the next draw and update the state, if the time is up fetch the next draw (and the last draw)
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();

    if (difference > 0) {
      setTimeLeft(() => {
        const currTime = {
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
        return currTime;
      });

    }

    if (difference > 8000 && difference < 10000) {//show a notification when 10 seconds are left before the bets are closed (at least 1 time it will enter here since it has a 200 ms range and the interval is 100ms )
      showToast("10 seconds left until next draw", "info");
    }
    else if (difference <= -300) { //waiting a time between 300ms and 400ms before fetching the new draw, giving the server some time to update the draw (this is avoid a couple of wasted HTTP requests, can be removed  )
      fetchNextDraw();
      fetchLastDraw();
      // if(difference>=-500)
      // showToast("A new round has begun, bets are being processed","info");
    }

  };


  useEffect(() => {
    calculateTimeLeft();


    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 100);// we could reduce it (or increase it up to 1000) to make the timer more (or less) precise, but i think 100 is ok since we dont't need a very precise timer.


    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div style={{ color: (timeLeft.minutes == 0 && timeLeft.seconds <= 10) ? "red" : "black" }}>
      {timeLeft.minutes > 0 ? `${timeLeft.minutes} Minutes and` : ""} {timeLeft.seconds} Seconds

    </div>
  );
};

PropTypes.CountdownTimer = {
  targetDate: PropTypes.string.isRequired,
  fetchNextDraw: PropTypes.func.isRequired,
  fetchLastDraw: PropTypes.func.isRequired
};

export default CountdownTimer;