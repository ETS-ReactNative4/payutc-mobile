/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import LinkButton from '../../components/LinkButton';
import List from '../../components/List';
import BlockTemplate from '../../components/BlockTemplate';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import { beautifyDateTime } from '../../utils';
import { _, Profile as t } from '../../utils/i18n';
import { Config, PayUTC } from '../../redux/actions';

class ProfileScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.onLockChange = this.onLockChange.bind(this);
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { rightsFetching, hasRightsFetching, detailsFetching, dispatch } = this.props;

		if (!detailsFetching) {
			dispatch(PayUTC.getWalletDetails());
		}

		if (!rightsFetching) {
			dispatch(PayUTC.getUserRights());
		}

		if (!hasRightsFetching) {
			dispatch(PayUTC.hasRights());
		}
	}

	onLockChange(value) {
		const { dispatch, detailsFetching } = this.props;

		if (detailsFetching) {
			return;
		}

		dispatch(
			Config.spinner({
				visible: true,
				textContent: value ? t('locking') : t('unlocking'),
			})
		);

		PayUTC.setLockStatus(value).payload.then(([status]) => {
			dispatch(
				Config.spinner({
					visible: false,
				})
			);

			if (status !== true && status !== false) {
				Alert.alert(
					_('error'),
					value ? t('lock_error') : t('unlock_error'),
					[{ text: _('ok') }],
					{}
				);
				return;
			}

			this.onRefresh();
		});
	}

	static renderDetail({ title, value }, index, roundedBottom = false) {
		return (
			<BlockTemplate
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				roundedBottom={roundedBottom}
			>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>{title}</Text>
				<Text style={{ fontSize: 12, color: colors.secondary }}>{value}</Text>
			</BlockTemplate>
		);
	}

	getUserDetails() {
		const { hasRights, rights, details, detailsFetching } = this.props;
		const types = [];

		if (detailsFetching) {
			return [];
		}

		if (rights.includes('ADMINRIGHT')) {
			types.push(_('admin'));
		} else if (rights.length) {
			types.push(_('manager'));
		} else if (hasRights) {
			types.push(_('staff'));
		}

		types.push(details.user.username.includes('@') ? _('ext') : _('cas'));

		return [
			{ title: _('firstname'), value: details.user.first_name },
			{ title: _('lastname'), value: details.user.last_name },
			{ title: _('email'), value: details.user.email },
			{ title: _('login'), value: details.user.username },
			{ title: _('type'), value: types.join(' / ') },
			{ title: _('status'), value: details.force_adult ? _('adult') : _('minor') },
			{ title: _('creation_date'), value: beautifyDateTime(details.created) },
		];
	}

	signOut() {
		const { navigation, dispatch } = this.props;

		dispatch(Config.wipe());

		PayUTC.forget().payload.then(() => navigation.navigate('Auth'));
	}

	render() {
		const { details, detailsFetching } = this.props;

		return (
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={detailsFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
				style={{ backgroundColor: colors.backgroundLight }}
			>
				<View style={{ margin: 15 }}>
					<List
						loading={detailsFetching}
						title={
							detailsFetching
								? _('loading_text_replacement')
								: `${details.user.first_name} ${details.user.last_name}`
						}
						renderItem={ProfileScreen.renderDetail}
						items={this.getUserDetails()}
						keyExtractor={item => item.title}
					/>
				</View>

				<SwitchBlockTemplate
					roundedTop
					roundedBottom
					shadow
					value={detailsFetching ? false : details.blocked}
					onValueChange={this.onLockChange}
					tintColor={colors.less}
					disabled={detailsFetching}
					style={{ margin: 15, marginTop: 0 }}
				>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: detailsFetching ? colors.disabled : colors.secondary,
							}}
						>
							{t('lock')}
						</Text>
						<Text
							style={{
								fontSize: 13,
								color: detailsFetching ? colors.disabled : colors.secondary,
							}}
						>
							{t('lock_info')}
						</Text>
					</View>
				</SwitchBlockTemplate>

				<LinkButton
					text={t('sign_out')}
					color={colors.less}
					onPress={() => this.signOut()}
					style={{ margin: 15, marginTop: 0 }}
				/>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc, config: { lang } }) => {
	const hasRights = payutc.hasRights();
	const rights = payutc.getUserRights();
	const details = payutc.getWalletDetails();

	return {
		lang,
		hasRights: hasRights.getData(false),
		hasRightsFetching: hasRights.isFetching(),
		rights: rights.getData([]),
		rightsFetching: rights.isFetching(),
		rightsFetched: rights.isFetched(),
		details: details.getData({}),
		detailsFetching: details.isFetching(),
		detailsFetched: details.isFetched(),
	};
};

export default connect(mapStateToProps)(ProfileScreen);