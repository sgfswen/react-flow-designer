import React, { PropTypes } from 'react';
import invariant from 'invariant';
import { mapOf } from 'react-immutable-proptypes';

import { NodeType } from '../../constants/flowdesigner.proptypes';

export default function NodesRenderer({ nodes, nodeTypeMap, moveNodeTo, moveNodeToEnd }) {
	function renderNode(node) {
		const ConcreteComponent = nodeTypeMap[node.nodeType].component;
		if (!ConcreteComponent) {
			invariant(
				false,
				`<NodesRenderer />  the defined node type in your graph model hasn't been mapped into
				the dataflow configuration, check NodeType documentation`
			);
		}
		return (
			<ConcreteComponent
				node={node}
				moveNodeTo={moveNodeTo}
				moveNodeToEnd={moveNodeToEnd}
				key={node.id}
			/>
		);
	}
	return (
		<g>
			{nodes.map(renderNode)}
		</g>
	);
}

NodesRenderer.propTypes = {
	nodes: mapOf(NodeType).isRequired,
	nodeTypeMap: PropTypes.object.isRequired,
	moveNodeTo: PropTypes.func.isRequired,
	moveNodeToEnd: PropTypes.func.isRequired,
};
