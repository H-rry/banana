import React from 'react'

function NavBar() {

    const settingsButtonClicked = () => {
        alert("Settings button pressed!");
    }

    const profileButtonClicked = () => {
        alert("Profile button pressed!");
    }

    
    return (
        <nav className="nav bar">
            <div className="nav left">
                <div className="nav box logo">
                    <img src="logo.jpg" className="nav logoSymbol" alt="Logo" />
                </div>
                <div className="nav divider"></div>
                <div className="nav box title">The Bunch</div>
                <div className="nav divider"></div>
            </div>
            <div className="nav right">
                <div className="nav divider"></div>
                <button className="nav box button profile" onClick={profileButtonClicked}>
                    <img src="profileSymbol.png" className="nav profileSymbol" alt="profile" />
                </button>
                <button className="nav box button settings" onClick={settingsButtonClicked}>
                    <img src="settingsSymbol.png" className="nav settingsSymbol" alt="settings" />
                </button>
                
                
            </div>
        </nav>
    ) 
}

export default NavBar