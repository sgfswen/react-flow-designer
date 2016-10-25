import React, { PropTypes } from 'react';
import { orderedMapOf } from 'react-immutable-proptypes';

import { PortType } from '../../constants/flowdesigner.proptypes';

export default function PortsRenderer({ ports, portTypeMap }) {
	function renderPort(port) {
		const ConcretePort = portTypeMap[port.portType].component;
		return (<ConcretePort key={port.id} port={port} />);
	}
	return (
		<g>
			{ports.map(renderPort)}
		</g>
	);
}


PortsRenderer.propTypes = {
	ports: orderedMapOf(PortType).isRequired,
	portTypeMap: PropTypes.object.isRequired,
};
