import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = '📚 Loading your amazing books...', inline = false }) => {
	const sizeClass = `spinner-${size}`;
	const containerClass = inline ? 'loading-container-inline' : 'loading-container';

	return (
		<div className={containerClass}>
			<div className={`spinner ${sizeClass}`}></div>
			{message && !inline && <p className="loading-message">{message}</p>}
		</div>
	);
};

export default LoadingSpinner;
