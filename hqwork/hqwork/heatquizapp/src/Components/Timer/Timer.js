import React from 'react'
import { useEffect, useState } from "react";
import { convertSecondsToHHMMSS } from "../../services/Auxillary";

var timer;

export function Timer({className, stop}){
    const [time, setTime] = useState(0)

    useEffect(() => {
        if(stop){
            clearInterval(timer)
        }
    }, [stop])

    useEffect(() => {
        setTime(0)

        timer = setInterval(() => {
            setTime(seconds => seconds + 1);
          }, 1000);

          return () => clearInterval(timer);
    }, [])

    return(
        <div className={className}>
            <p>{convertSecondsToHHMMSS(time)}</p>
        </div>
    )
}