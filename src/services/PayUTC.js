/**
 * Service se connectant à PayUTC et affichant le solde.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import Api from './Api';
import CASAuth from './CASAuth';
import Storage from './Storage';
import { PAYUTC_API_URL, PAYUTC_KEY, PAYUTC_SYSTEM_ID } from '../../config';

const ACCOUNT_SERVICE = 'MYACCOUNT';
const TRANSFER_SERVICE = 'TRANSFER';
const REFILL_SERVICE = 'RELOAD';

const LOGIN_APP_URI = 'loginApp';
const LOGIN_URI = 'login2';
const LOGIN_CAS_URI = 'loginCas2';
const AUTH_QUERIES = {
	system_id: PAYUTC_SYSTEM_ID,
	app_key: PAYUTC_KEY,
};

export class PayUTCApi extends Api {
	TYPE = 'payutc';

	CAS_AUTH_TYPE = 'cas';

	EMAIL_AUTH_TYPE = 'email';

	constructor() {
		super(PAYUTC_API_URL);
	}

	call(service, request, method, queries, body, headers, validStatus, json = true) {
		return super.call(`${service}/${request}`, method, queries, body, headers, validStatus, json);
	}

	mustCall(service, request, method, queries, body, headers, validStatus, json = true) {
		return this.call(service, request, method, queries, body, headers, validStatus, json, false);
	}

	connectApp() {
		return this.mustCall(ACCOUNT_SERVICE, LOGIN_APP_URI, Api.POST, AUTH_QUERIES, { key: PAYUTC_KEY });
	}

	connectWithCas(login, password) {
		return this.connectApp().then(() => {
			return CASAuth.getServiceTicket(PAYUTC_API_URL).then(([ticket]) => {
				if (!ticket) {
					throw 'No tickets !';
				}

				return this.mustCall(ACCOUNT_SERVICE, LOGIN_CAS_URI, Api.POST, AUTH_QUERIES, {
					service: PAYUTC_API_URL,
					ticket,
				})
					.then(() => {
						this.connected = true;

						return this.setData({
							login,
							password,
							ticket: CASAuth.getTicket(),
							type: this.CAS_AUTH_TYPE,
						});
					})
					.catch(() => {
						this.connected = false;

						throw false;
					});
			});
		});
	}

	connectWithEmail(login, password) {
		return this.connectApp().then(() => {
			return this.mustCall(ACCOUNT_SERVICE, LOGIN_URI, Api.POST, AUTH_QUERIES, {
				login,
				password,
			})
				.then(() => {
					this.connected = true;

					return this.setData({
						login,
						password,
						type: this.EMAIL_AUTH_TYPE,
					});
				})
				.catch(() => {
					this.connected = false;

					throw false;
				});
		});
	}

	// eslint-disable-next-line class-methods-use-this
	setData(data) {
		return Storage.setData('auth', data);
	}

	// eslint-disable-next-line class-methods-use-this
	getData() {
		return Storage.getData('auth');
	}

	// eslint-disable-next-line class-methods-use-this
	forget() {
		return Storage.removeData('auth');
	}

	isConnected() {
		return this.connected;
	}

	getUserDetails() {
		return this.connectedCall(
			ACCOUNT_SERVICE,
			'getUserDetails',
			Api.GET,
			AUTH_QUERIES,
			{},
			Api.HEADERS_JSON
		);
	}

	getWalletDetails() {
		return this.connectedCall(
			ACCOUNT_SERVICE,
			'getWalletDetails',
			Api.POST,
			AUTH_QUERIES,
			{},
			Api.HEADERS_JSON
		);
	}

	getHistory() {
		return this.connectedCall(
			ACCOUNT_SERVICE,
			'historique',
			Api.POST,
			AUTH_QUERIES,
			{},
			Api.HEADERS_JSON
		);
	}

	getLockStatus() {
		return this.connectedCall(
			ACCOUNT_SERVICE,
			'isBlockedMe',
			Api.POST,
			AUTH_QUERIES,
			{},
			Api.HEADERS_JSON
		);
	}

	setLockStatus(lock) {
		return this.connectedCall(
			ACCOUNT_SERVICE,
			'setSelfBlock',
			Api.POST,
			AUTH_QUERIES,
			{ blocage: lock },
			Api.HEADERS_JSON
		);
	}

	getUserAutoComplete(queryString) {
		return this.connectedCall(
			TRANSFER_SERVICE,
			'userAutocomplete',
			Api.POST,
			AUTH_QUERIES,
			{ queryString },
			Api.HEADERS_JSON
		);
	}

	transfer(amount, user_id, message) {
		return this.connectedCall(
			TRANSFER_SERVICE,
			'transfer',
			Api.POST,
			AUTH_QUERIES,
			{ amount, userID: user_id, message },
			Api.HEADERS_JSON
		);
	}

	getRefillLimits() {
		return this.connectedCall(REFILL_SERVICE, 'info', Api.POST, AUTH_QUERIES, {}, Api.HEADERS_JSON);
	}

	getRefillUrl(amount, callbackUrl) {
		return this.connectedCall(
			REFILL_SERVICE,
			'reload',
			Api.POST,
			AUTH_QUERIES,
			{
				amount,
				callbackUrl,
				mobile: 1,
			},
			Api.HEADERS_JSON
		);
	}

	checkRefill(query) {
		return this.connectedCall(
			REFILL_SERVICE,
			'returnQuery',
			Api.POST,
			AUTH_QUERIES,
			{
				query,
			},
			Api.HEADERS_JSON
		);
	}
}

export default new PayUTCApi();
