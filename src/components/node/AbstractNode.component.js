import React, { PropTypes } from 'react';
import { DraggableCore } from 'react-draggable';
import { Map } from 'immutable';
import { scaleLinear } from 'd3-scale';

import invariant from 'invariant';

import { NodeType } from '../../constants/flowdesigner.proptypes';
import { PositionRecord } from '../../constants/flowdesigner.model';


/**
 * calculate the position of each ports for a given node information
 * @param emitterPorts
 * @param sinkPorts
 * @param nodePosition
 * @param nodeSize
 */
const calculatePortPosition = (ports, nodePosition, nodeSize) => {
	let portsWithPosition = new Map();
	const emitterPorts = ports.filter(port => port.attributes.get('type') === 'EMITTER');
	const sinkPorts = ports.filter(port => port.attributes.get('type') === 'SINK');
	const range = [nodePosition.y, nodePosition.y + nodeSize.height];
	const scaleYEmitter = scaleLinear()
			.domain([0, emitterPorts.size + 1])
			.range(range);
	const scaleYSink = scaleLinear()
			.domain([0, sinkPorts.size + 1])
			.range(range);
	let emitterNumber = 0;
	let sinkNumber = 0;
	emitterPorts.forEach((port) => {
		emitterNumber += 1;
		const position = new PositionRecord({
			x: nodePosition.x + nodeSize.width,
			y: scaleYEmitter(emitterNumber),
		});
		portsWithPosition = portsWithPosition.set(port.id, port.set('position', position));
	});
	sinkPorts.forEach((port) => {
		sinkNumber += 1;
		const position = new PositionRecord({
			x: nodePosition.x,
			y: scaleYSink(sinkNumber),
		});
		portsWithPosition = portsWithPosition.set(port.id, port.set('position', position));
	});
	return portsWithPosition;
};


export class AbstractNode extends React.Component {
	static calculatePortPosition = calculatePortPosition;

	static propTypes = {
		node: NodeType.isRequired,
		moveNodeTo: PropTypes.func.isRequired,
		onDragStart: PropTypes.func,
		onDrag: PropTypes.func,
		onDragEnd: PropTypes.func,
		onClick: PropTypes.func,
		children: PropTypes.node,
	};

	constructor(props) {
		super(props);
		this.state = { dragged: false };
		this.onClick = this.onClick.bind(this);
		this.onClickCapture = this.onClickCapture.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps !== this.props;
	}

	onClick(event) {
		if (this.props.onClick) {
			this.props.onClick(event);
		}
	}

	onClickCapture(event) {
		if (this.state.dragged) {
			event.preventDefault();
			event.stopPropagation();
			this.setState({ dragged: false });
		}
	}

	onDragStart(event, data) {
		if (this.props.onDragStart) {
			this.props.onDragStart(event, data);
		}
	}

	onDrag(event, data) {
		if (!this.state.dragged) {
			this.setState({ dragged: true });
		}
		const { node } = this.props;
		this.props.moveNodeTo(
			this.props.node.id,
			{ x: node.position.x + data.deltaX, y: node.position.y + data.deltaY }
		);
		if (this.props.onDrag) {
			this.props.onDrag(event);
		}
	}

	onDragEnd(event, data) {
		if (this.props.onDragEnd) {
			this.props.onDragEnd(event, data);
		}
	}

	renderContent() {
		if (this.props.children) {
			return this.props.children;
		}
		invariant(false, '<AbstractNode /> should not be used without giving it a children' +
			'ex: <AbstractNode><rect /></AbstractNode>');
		return null;
	}

	render() {
		const { node } = this.props;
		return (
			<DraggableCore
				onStart={this.onDragStart}
				onDrag={this.onDrag}
				onStop={this.onDragEnd}
			>
				<g
					onClick={this.onClick}
					onClickCapture={this.onClickCapture}
					transform={`translate(${node.position.x},${node.position.y})`}
				>
					{this.renderContent()}
				</g>
			</DraggableCore>
		);
	}
}


export default AbstractNode;
