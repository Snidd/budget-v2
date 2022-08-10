export enum PaymentTypes {
	NORMAL,
	CREDIT,
	AUTO
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
