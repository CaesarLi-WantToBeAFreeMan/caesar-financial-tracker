export type CurrencyCode = "usd" | "twd" | "cny";

export const isValidPriceRange = (priceLow: number, priceHigh: number | null) =>
    priceLow >= 0 && (priceHigh === null || (priceHigh >= 0 && priceLow <= priceHigh));

export function priceFormat(
    price: number | null,
    currency: CurrencyCode = "usd",
    place: number = 2,
    decimalPoint: string = ".",
    thousandsSeparator: string = ",",
    thousandthsSeparator: string = " ",
    separatorNumber: number = 3
): string {
    if (price == null) return "∞";
    let symbol = "$";
    switch (currency) {
        case "twd":
            separatorNumber = separatorNumber ?? 4;
            place = 0;
            symbol = "$";
            break;
        case "cny":
            separatorNumber = separatorNumber ?? 4;
            symbol = "¥";
            break;
    }
    let [integer, fractional] = Math.abs(price).toFixed(place).split(".");
    integer = integer.replace(new RegExp(`\\d(?=(\\d{${separatorNumber}})+$)`, "g"), `$&${thousandsSeparator}`);
    fractional = fractional.replace(new RegExp(`(\\d{${separatorNumber}})`, "g"), `$1${thousandthsSeparator}`).trim();
    return `${symbol}${price < 0 ? "-" : ""}${integer}${place > 0 ? `${decimalPoint}${fractional}` : ""}`;
}

export function parsePrice(price: string, decimalPoint: string = "."): number | null {
    if (price === "∞") return null;
    return parseFloat(
        price
            .replace(new RegExp(`[^0-9\\-${decimalPoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`, "g"), "")
            .replace(decimalPoint, ".")
    );
}
