import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export const formatMonth = (year: number, month: number): string => {
	const date = new Date(year, month, 1);
	return format(date, 'MMM yyyy', { locale: sv });
};
