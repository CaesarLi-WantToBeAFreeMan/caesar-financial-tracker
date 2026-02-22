export const isValidPriceRange = (priceLow: number, priceHigh: number | null) =>
    priceLow >= 0 && (priceHigh === null || (priceHigh >= 0 && priceLow <= priceHigh));

export const priceFormat = (price: number) => {
    if (price === null) return "∞";
    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(price);
};
