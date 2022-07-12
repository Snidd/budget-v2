export enum PaymentTypes {
	NORMAL,
	CREDIT,
	AUTO
}

export interface SelectElements {
	value: number;
	name: string;
}

export const paymentTypeSelect:SelectElements[] = [
	{
		value: 0,
		name: "Manuell - konto"
	},
	{
		value: 1,
		name: "Automatiskt - Remember"
	},
	{
		value: 2,
		name: "Automatisk - konto"
	},
]