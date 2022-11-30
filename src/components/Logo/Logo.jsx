import React from 'react';
import Tilt from 'react-parallax-tilt';
import faceBrain from './face-brain.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0 logo' style={{ height: '100px', width: '100px'}}>
			<Tilt className='br2 shadow-2' style={{height: '100%'}}>
	    		<div style={{ height: '100%', backgroundColor: 'darkgreen' }}>
	   				<img src={faceBrain} alt='logo'/>
	    		</div>
	    	</Tilt>
    	</div>
	);
}

export default Logo; 