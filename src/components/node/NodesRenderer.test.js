import React from 'react';
import renderer from 'react-test-renderer';
import { Map } from 'immutable';

import NodesRenderer from './NodesRenderer.component';
import { NodeRecord, NodeGraphicalAttributes } from '../../constants/flowdesigner.model';

const MockNode = () => (
	<span>MockLink</span>
);


describe('<NodesRenderer />', () => {
	it('renders correctly', () => {
		const nodes = new Map().set('id', new NodeRecord({
			id: 'id',
			type: 'id',
			graphicalAttributes: new NodeGraphicalAttributes({
				nodeType: 'id',
			}),
		}));
		const nodeTypeMap = {
			id: { id: 'id', component: MockNode },
		};
		const tree = renderer.create(
			<NodesRenderer nodes={nodes} nodeTypeMap={nodeTypeMap} />,
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
