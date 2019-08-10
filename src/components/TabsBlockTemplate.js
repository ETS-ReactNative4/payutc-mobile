/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default class TabsBlockTemplate extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { selected: 0 };
	}

	onTabChange(index) {
		this.setState({ selected: index });
	}

	render() {
		const { tabs, style, roundedTop, roundedBottom, shadow, disabled, tintColor } = this.props;
		const { selected } = this.state;

		return (
			<BlockTemplate
				roundedTop={roundedTop}
				roundedBottom={roundedBottom}
				shadow={shadow}
				style={[{ padding: 0 }, style]}
			>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						flexGrow: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
						backgroundColor: colors.backgroundBlock,
						paddingHorizontal: 10,
						paddingBottom: 10,
						paddingTop: 10,
						borderTopLeftRadius: roundedTop ? 10 : 0,
						borderTopRightRadius: roundedTop ? 10 : 0,
						borderBottomLeftRadius: roundedBottom ? 10 : 0,
						borderBottomRightRadius: roundedBottom ? 10 : 0,
					}}
				>
					{tabs.map((tab, index) => (
						<BlockTemplate
							roundedTop
							roundedBottom
							shadow
							key={tab.title}
							disabled={disabled}
							customBackground={selected === index && !disabled ? tintColor : null}
							style={index + 1 === tabs.length ? {} : { marginRight: 10 }}
							onPress={() => this.onTabChange(index)}
						>
							<Text
								style={{
									fontSize: 14,
									fontWeight: 'bold',
									color: disabled
										? colors.disabled
										: selected === index
										? colors.backgroundBlock
										: tintColor,
								}}
							>
								{tab.title}
							</Text>
						</BlockTemplate>
					))}
				</ScrollView>
				<View style={{ borderBottomWidth: 1, borderBottomColor: colors.backgroundLight }} />
				{tabs[selected].children()}
			</BlockTemplate>
		);
	}
}