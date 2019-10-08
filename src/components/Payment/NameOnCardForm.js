/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, TextInput } from 'react-native';
import colors from '../../styles/colors';
import BlockTemplate from '../BlockTemplate';

export default class NameOnCardForm extends React.PureComponent {
	constructor(props) {
		super(props);
		this.maxLength = 26;
		this.state = { name: null };
	}

	componentDidMount() {
		const { defaultValue } = this.props;
		this.onChange(defaultValue);
	}

	onChange(name) {
		const { onChange } = this.props;

		onChange(name);
		this.setState({ name });
	}

	render() {
		const { error } = this.props;
		const { name } = this.state;

		return (
			<BlockTemplate roundedTop roundedBottom shadow>
				<Text
					style={{
						fontSize: 14,
						fontWeight: 'bold',
						color: error ? colors.error : colors.secondary,
						marginBottom: 5,
					}}
				>
					Titulaire
				</Text>
				<TextInput
					style={{
						flexGrow: 1,
						fontSize: 18,
						color: error ? colors.error : colors.more,
						padding: 0,
						marginVertical: 0,
					}}
					keyboardType="default"
					keyboardAppearance={colors.generalAspect}
					placeholder="Votre super nom"
					placeholderTextColor={colors.disabled}
					clearButtonMode="always"
					maxLength={this.maxLength}
					onChangeText={name => this.onChange(name)}
					textContentType="name"
					autoCorrect={false}
					value={name}
				/>
			</BlockTemplate>
		);
	}
}
