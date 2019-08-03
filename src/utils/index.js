/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { Words as t } from './i18n';

export const floatToEuro = float => {
	return `${float < 0 ? '- ' : ''}${Math.abs(float)
		.toFixed(2)
		.toString()
		.replace('.', ',')} €`;
};

export const forceTextLength = (text, length = 2, remplacement = '0') => {
	text = `${text}`;

	while (text.length < length) {
		text = remplacement + text;
	}

	return text;
};

export const beautifyDate = dateText => {
	const date = new Date(dateText);

	return (
		`${forceTextLength(date.getDate())}/${forceTextLength(date.getMonth() + 1)}/${forceTextLength(
			date.getFullYear()
		)}` +
		` ${t('at')} ` +
		`${forceTextLength(date.getHours())}h${forceTextLength(date.getMinutes())}m${forceTextLength(
			date.getSeconds()
		)}`
	);
};

export default {
	floatToEuro,
	beautifyDate,
};
