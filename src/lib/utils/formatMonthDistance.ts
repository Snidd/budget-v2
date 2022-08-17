export const formatMonthDistance = (repeatingMonths: number): string => {
	if (repeatingMonths === null || repeatingMonths === 0) {
		return '';
	}
	if (repeatingMonths === 1) {
		return 'varje månad';
	}
	if (repeatingMonths === 2) {
		return 'varannan månad';
	}

	return `var ${repeatingMonths}:e månad`;
};
