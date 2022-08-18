export enum PaymentTypes {
	NORMAL,
	CREDIT,
	AUTO,
	INCOME_AUTO,
	INCOME_SWISH,
	INCOME_REFUND
}

export interface SelectElements {
	value: number;
	name: string;
}

export const getPaymentTypeString = (paymentType: PaymentTypes) => {
	switch (paymentType) {
		case PaymentTypes.NORMAL:
			return 'Manuell';
		case PaymentTypes.CREDIT:
			return 'Remember';
		case PaymentTypes.AUTO:
			return 'Autogiro';
		case PaymentTypes.INCOME_AUTO:
			return 'Automatisk';
		case PaymentTypes.INCOME_SWISH:
			return 'Swish';
		case PaymentTypes.INCOME_REFUND:
			return 'Återbetalning';
		default:
			return 'Okänt';
	}
};

export const paymentTypeSelect: SelectElements[] = [
	{
		value: 0,
		name: 'Manuell - konto'
	},
	{
		value: 1,
		name: 'Automatiskt - Remember'
	},
	{
		value: 2,
		name: 'Automatisk - konto'
	}
];

export const incomePaymentTypeSelect: SelectElements[] = [
	{
		value: 3,
		name: 'Automatisk'
	},
	{
		value: 4,
		name: 'Swish'
	},
	{
		value: 5,
		name: 'Återbetalning'
	}
];
