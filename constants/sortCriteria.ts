import { Nutrients } from '@/types/types';

export const sortCriteria = [
    'Kalorien',
    'Proteine',
    'Fette',
    'Gesättigte Fettsäuren',
    'Kohlenhydrate',
    'Zucker',
    'Nahrungsfasern',
    'Salz',
    'Menge',
];

export const sortCriteriaMap: { [key: string]: keyof Nutrients } = {
    Kalorien: 'kcal',
    Proteine: 'proteins',
    Fette: 'fats',
    'Gesättigte Fettsäuren': 'saturatedFats',
    Kohlenhydrate: 'carbohydrates',
    Zucker: 'sugars',
    Nahrungsfasern: 'fibres',
    Salz: 'salt',
};
