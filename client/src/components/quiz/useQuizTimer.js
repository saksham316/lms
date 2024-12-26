import React, { useEffect, useState } from 'react'

const useQuizTimer = (time=2) => {
    const [minutes, setMinutes] = useState(time)
    const [seconds, setSeconds] = useState(0)
    const resestTimer = ()=>{
      setMinutes(time)
      setSeconds(0)
    }
    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
              setSeconds(seconds - 1);
            }
        
            if (seconds === 0) {
              if (minutes === 0) {
                clearInterval(interval);
              } else {
                setSeconds(59);
                setMinutes(minutes - 1);
              }
            }
          }, 1000);
        
          return () => {
            clearInterval(interval);
          };
    }, [seconds,minutes])
    

  return [minutes,seconds,resestTimer]
}

export default useQuizTimer