import type { Category, Expense, PrismaPromise, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

console.log(`running seed script...`);

const categories: Prisma.CategoryCreateInput[] = [
	{
		name: 'Boende',
		color: '#5b49fc',
		isIncome: false
	},
	{
		name: 'Boende - Lån',
		color: '#8b7054',
		isIncome: false
	},
	{
		name: 'El / Transport',
		color: '#f49f00',
		isIncome: false
	},
	{
		name: 'Mat',
		color: '#04ca94',
		isIncome: false
	},
	{
		name: 'Försäkring',
		color: '#ee1116',
		isIncome: false
	},
	{
		name: 'Spar',
		color: '#5cc012',
		isIncome: false
	},
	{
		name: 'Mikaelas',
		color: '#d810d8',
		isIncome: false
	},
	{
		name: 'Magnus',
		color: '#5c5c5c',
		isIncome: false
	},
	{
		name: 'William',
		color: '#2fa9cc',
		isIncome: false
	},
	{
		name: 'TV / Musik / Tidningar',
		color: '#14cba2',
		isIncome: false
	},
	{
		name: 'Lyx',
		color: '#8805a9',
		isIncome: false
	},
	{
		name: 'Försäkringskassan',
		color: '#0971ae',
		isIncome: true
	},
	{
		name: 'Lön',
		color: '#0bc406',
		isIncome: true
	}
];

export const getExpenses = (categories: Category[]): Prisma.ExpenseCreateInput[] => {
	const findCategory = (name: string) => {
		let category = categories.find((cat) => cat.name === name);
		if (category === undefined) {
			console.log(`category ${name} was not found, using ${categories[0].name} instead.`);
			category = categories[0];
		}
		return {
			connect: {
				id: category.id
			}
		};
	};

	const expenses: Prisma.ExpenseCreateInput[] = [
		{
			description: 'Hyra',
			paymentType: 2,
			active: true,
			defaultValue: 4715,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Boende')
		},
		{
			description: 'Garage',
			paymentType: 2,
			active: true,
			defaultValue: 1447,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Boende')
		},
		{
			description: 'Ränta för lägenheten',
			paymentType: 2,
			active: true,
			defaultValue: 2810,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Boende - Lån')
		},
		{
			description: 'Ränta för tomten/huset',
			paymentType: 2,
			active: true,
			defaultValue: 9545,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Boende - Lån')
		},
		{
			description: 'Sälen',
			paymentType: 0,
			active: true,
			defaultValue: 2995,
			isIncome: false,
			repeatingMonths: 12,
			category: findCategory('Boende')
		},
		{
			description: 'Betalservice/Nyckelkund',
			paymentType: 2,
			active: true,
			defaultValue: 78,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Boende')
		},
		{
			description: 'Ica',
			paymentType: 0,
			active: true,
			defaultValue: 3500,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mat')
		},
		{
			description: 'Matkassar',
			paymentType: 1,
			active: true,
			defaultValue: 2676,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mat')
		},
		{
			description: 'Lunch / fika ute',
			paymentType: 2,
			active: true,
			defaultValue: 500,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mat')
		},
		{
			description: 'Kafferosteri',
			paymentType: 2,
			active: true,
			defaultValue: 119,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mat')
		},
		{
			description: 'Trygghansa',
			paymentType: 2,
			active: true,
			defaultValue: 700,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Försäkring')
		},
		{
			description: 'Bliwa',
			paymentType: 2,
			active: true,
			defaultValue: 729,
			isIncome: false,
			repeatingMonths: 3,
			category: findCategory('Försäkring')
		},
		{
			description: 'William',
			paymentType: 2,
			active: true,
			defaultValue: 2250,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Spar')
		},
		{
			description: 'Rör du så dör du',
			paymentType: 2,
			active: true,
			defaultValue: 2000,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Spar')
		},
		{
			description: 'Pension',
			paymentType: 2,
			active: true,
			defaultValue: 1000,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Spar')
		},
		{
			description: 'Mobil Mikaela',
			paymentType: 0,
			active: true,
			defaultValue: 269,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mikaelas')
		},
		{
			description: 'Unionen',
			paymentType: 2,
			active: true,
			defaultValue: 225,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mikaelas')
		},
		{
			description: 'A-kassan',
			paymentType: 2,
			active: true,
			defaultValue: 140,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mikaelas')
		},
		{
			description: 'Klippning',
			paymentType: 0,
			active: true,
			defaultValue: null,
			isIncome: false,
			repeatingMonths: 0,
			category: findCategory('Mikaelas')
		},
		{
			description: 'Folktandvården',
			paymentType: 2,
			active: true,
			defaultValue: 185,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('Mikaelas')
		},
		{
			description: 'Loveevery',
			paymentType: 1,
			active: true,
			defaultValue: 1022,
			isIncome: false,
			repeatingMonths: 2,
			category: findCategory('William')
		},
		{
			description: 'Goboken',
			paymentType: 2,
			active: true,
			defaultValue: 287,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('William')
		},
		{
			description: 'Spotify',
			paymentType: 1,
			active: true,
			defaultValue: 189,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'Netflix',
			paymentType: 1,
			active: true,
			defaultValue: 129,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'DobbTV',
			paymentType: 1,
			active: true,
			defaultValue: 79,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'AppleID',
			paymentType: 1,
			active: true,
			defaultValue: 29,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'Discoveryplus',
			paymentType: 1,
			active: true,
			defaultValue: 349,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'Hbo',
			paymentType: 0,
			active: true,
			defaultValue: 44.5,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'Viaplay / Cmore',
			paymentType: 0,
			active: true,
			defaultValue: 230,
			isIncome: false,
			repeatingMonths: 1,
			category: findCategory('TV / Musik / Tidningar')
		},
		{
			description: 'Barnbidrag',
			paymentType: 3,
			active: true,
			defaultValue: 1250,
			isIncome: true,
			repeatingMonths: 1,
			category: findCategory('Försäkringskassan')
		},
		{
			description: 'Föräldradagar',
			paymentType: 3,
			active: true,
			defaultValue: 8476,
			isIncome: true,
			repeatingMonths: 1,
			category: findCategory('Försäkringskassan')
		},
		{
			description: 'Magnus Lön',
			paymentType: 3,
			active: true,
			defaultValue: 0,
			isIncome: true,
			repeatingMonths: 1,
			category: findCategory('Lön')
		}
	];

	return expenses;
};

const prisma = new PrismaClient();

async function main() {
	const categoriesTxs: PrismaPromise<Category>[] = [];

	for (const data of categories) {
		categoriesTxs.push(prisma.category.create({ data }));
	}

	const cats = await prisma.$transaction(categoriesTxs);
	console.log(`Created ${cats.length} categories.`);

	const expensesTxs: PrismaPromise<Expense>[] = [];

	for (const data of getExpenses(cats)) {
		expensesTxs.push(prisma.expense.create({ data }));
	}

	const exps = await prisma.$transaction(expensesTxs);
	console.log(`Created ${exps.length} expenses`);
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		prisma.$disconnect;
		process.exit(1);
	});
