/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation';
import HomeNavigator from './Home/HomeNavigator';
import colors from '../styles/colors';
import { Navigation as t } from '../utils/i18n';
import HistoryNavigator from './History/HistoryNavigator';
import StatsNavigator from './Stats/StatsNavigator';
import SettingsNavigator from './Settings/SettingsNavigator';

const ICON_SIZE = 22;

const focusableIoniconFactory = icon => {
	const focusedIcon = ({ focused }) => (
		<FontAwesomeIcon
			icon={icon}
			size={ICON_SIZE}
			color={focused ? colors.primary : colors.secondary}
			style={{ paddingTop: 3 }}
		/>
	);

	return focusedIcon;
};

const MainNavigator = createBottomTabNavigator(
	{
		Home: {
			screen: HomeNavigator,
			navigationOptions: () => ({
				title: t('home'),
				tabBarIcon: focusableIoniconFactory(['fas', 'home']),
			}),
		},

		History: {
			screen: HistoryNavigator,
			navigationOptions: () => ({
				title: t('history'),
				tabBarIcon: focusableIoniconFactory(['fas', 'list']),
			}),
		},

		Stats: {
			screen: StatsNavigator,
			navigationOptions: () => ({
				title: t('stats'),
				tabBarIcon: focusableIoniconFactory(['fas', 'chart-pie']),
			}),
		},

		Settings: {
			screen: SettingsNavigator,
			navigationOptions: () => ({
				title: t('settings'),
				tabBarIcon: focusableIoniconFactory(['fas', 'cogs']),
			}),
		},
	},
	{
		tabBarComponent: props => {
			const customProps = {
				activeTintColor: colors.primary,
				inactiveTintColor: colors.secondary,
				activeBackgroundColor: colors.backgroundBlock,
				inactiveBackgroundColor: colors.backgroundBlock,
				style: {
					borderTopColor: colors.border,
				},
			};

			return <BottomTabBar {...props} {...customProps} showLabel />;
		},
	}
);

export default MainNavigator;
