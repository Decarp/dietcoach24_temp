import { Basket, Baskets } from '@/types/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export const mapBasketsResponse = (basketsResponse: Basket[]): Baskets => {
    // Sort the basketsResponse by timestamp in descending order
    const sortedBasketsResponse = basketsResponse.sort((a: Basket, b: Basket) => b.timestamp - a.timestamp);

    // Reduce to group baskets by monthYear
    return sortedBasketsResponse.reduce((acc: Baskets, basket: Basket) => {
        const date = new Date(basket.timestamp * 1000);
        const monthYear = format(date, 'MMMM yyyy', { locale: de });

        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(basket);

        return acc;
    }, {});
};
