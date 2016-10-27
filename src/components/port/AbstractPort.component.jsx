import React, { PropTypes } from 'react';
import { select, event } from 'd3-selection';

import { PortType } from '../../constants/flowdesigner.proptypes';

export default function AbstractPort({ children, port, onClick }) {
	function handleClick() {
		if (onClick) {
			onClick(event);
		}
	}

	if (port.position) {
		return (
			<g>
				<g
					onClick={handleClick}
					transform={`translate(${port.position.x},${port.position.y})`}
				>
					{children}
				</g>
			</g>
		);
	}
	return null;
}

AbstractPort.propTypes = {
	port: PortType,
	onClick: PropTypes.func,
};
