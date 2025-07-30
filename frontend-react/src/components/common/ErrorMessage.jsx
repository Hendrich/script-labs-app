import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
	if (!message) return null;

	return (
		<div className="error-container">
			<div className="error-message">
				Something went wrong
			</div>
			<div className="error-details">
				{message}
			</div>
			{onRetry && (
				<div className="error-actions">
					<button className="retry-button" onClick={onRetry}>
						🔄 Try Again
					</button>
				</div>
			)}
		</div>
	);
};

export default ErrorMessage;
