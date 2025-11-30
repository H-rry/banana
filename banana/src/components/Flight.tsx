import React from 'react'

const TravelButtonPressed = () => {
    alert("travel button pressed");
}

function Flight() {
    return (
        <div className="flight container ">
            <div className="flight top">
                <div className="flight title">
                    [airport, city]
                </div>
                <button className="flight button" onClick={TravelButtonPressed}>Travel

                </button>
            </div>
            
            <div className="flight details">
                [country]
            </div>
            
        </div>
    )
}

export default Flight