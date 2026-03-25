//ISO-4217 codes for supported currency
export type CurrencyCode = "USD" | "CAD" | "GBP" | "EUR" | "TWD" | "JPY" | "CNY";

//currency display options
export const CURRENCY_DISPLAY_OPTIONS: Record<CurrencyCode, string[]> = {
    USD: ["$", "US$", "USD"],
    CAD: ["$", "CA$", "CAD"],
    GBP: ["£", "GB£", "GBP"],
    EUR: ["€", "EU€", "EUR"],
    TWD: ["$", "NT$", "TWD"],
    JPY: ["¥", "JP¥", "JPY"],
    CNY: ["¥", "CN¥", "CNY"]
};

//all currency code orders
export const CURRENCY_CODES: CurrencyCode[] = ["USD", "CAD", "GBP", "EUR", "TWD", "JPY", "CNY"];

//national flag emojis for currency codes
export const CURRENCY_FLAGS: Record<CurrencyCode, String> = {
    USD: "us",
    CAD: "ca",
    GBP: "gb",
    EUR: "eu",
    TWD: "tw",
    JPY: "jp",
    CNY: "cn"
};

//price format options
export interface PriceFormatOptions {
    /*currency symbol that is displayed before price*/
    currencySymbol: string;
    /*number of group*/
    /*0: no grouping; 3: western style; 4: cjk style*/
    separatorPlaces: 0 | 1 | 2 | 3 | 4 | 5;
    /*character that is displayed between integers*/
    /*default is comma (,)*/
    thousandsSeparator: string;
    /*number of displayed decimal digits*/
    /*0 for new taiwan dollar, 2 for otherwise*/
    decimalPlaces: 0 | 1 | 2;
    /*decimal point character, default is "."*/
    decimalSeparator?: string;
}

//convert a numeric price into a localized display price
export function formatPrice(price: number | null, options: PriceFormatOptions): string {
    if (price == null) return "∞";

    const {currencySymbol, separatorPlaces, thousandsSeparator, decimalPlaces, decimalSeparator} = options;
    const decimalChar = decimalSeparator ?? ".";

    //split the price
    let [integer, fractional] = Math.abs(price).toFixed(decimalPlaces).split(".");

    //insert thousandths separator if enabled
    if (separatorPlaces > 0)
        integer = integer.replace(new RegExp(`\\d(?=(\\d{${separatorPlaces}})+$)`, "g"), `$&${thousandsSeparator}`);

    const sign = price < 0 ? "-" : "";
    if (fractional === undefined) return `${currencySymbol}${sign}${integer}`;
    return `${currencySymbol}${sign}${integer}${decimalChar}${fractional}`;
}

//parse a formatted price string back to a number
export function parsePrice(formatted: string): number | null {
    if (formatted === "∞") return null;
    const price = parseFloat(formatted.replace(/[^0-9.\-]/g, ""));
    return isNaN(price) ? null : price;
}

//validate the price range is logically consistent
export function isValidPriceRange(priceLow: number, priceHigh: number | null): boolean {
    return priceLow >= 0 && (priceHigh === null || (priceHigh >= 0 && priceLow <= priceHigh));
}
