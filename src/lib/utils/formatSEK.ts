export const formatSEK = (input: unknown | null): string => {
	if (input === null || input === undefined) return '';
	return Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(Number(input));
};
