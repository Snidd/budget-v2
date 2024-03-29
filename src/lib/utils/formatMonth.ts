import { format } from 'date-fns';
import sv from 'date-fns/locale/sv/index.js';

export const formatMonth = (year: number | undefined, month: number | undefined): string => {
	if (year === undefined || month === undefined) return '';
	const date = new Date(year, month, 1);

	return format(date, 'MMM yyyy', { locale: sv });
};
