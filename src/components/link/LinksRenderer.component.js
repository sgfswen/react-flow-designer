import React, { PropTypes } from 'react';
import invariant from 'invariant';
import { mapOf } from 'react-immutable-proptypes';
import { LinkType, PortType } from '../../constants/flowdesigner.proptypes';

export default function LinksRender({ links, linkTypeMap, ports }) {
	function renderLink(link) {
		const ConcreteLink = linkTypeMap[link.linkType].component;
		const source = ports.get(link.sourceId);
		const target = ports.get(link.targetId);
		if (!ConcreteLink) {
			invariant(
				false,
				`<LinksRenderer />  the defined link type in your graph model hasn't been mapped into
				the dataflow configuration, check LinkType documentation`
			);
		}
		return (
			<ConcreteLink link={link} source={source} target={target} key={link.id} />
		);
	}
	return (
		<g>
			{links.map(renderLink)}
		</g>
	);
}

LinksRender.propTypes = {
	links: mapOf(LinkType).isRequired,
	ports: mapOf(PortType).isRequired,
	linkTypeMap: PropTypes.object.isRequired,
};
