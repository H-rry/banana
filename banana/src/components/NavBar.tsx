import React from 'react'

function NavBar() {
    return (
        <nav className="nav bar">
            <div className="nav left">
                <img src="logo.png" className="nav logo" alt="Logo" />
                <div className="nav divider"></div>
                <div className="nav button"></div>
            </div>
            <div className="nav right">
                <div className="nav button"></div>
                
            </div>
        </nav>
    )
}

export default NavBar