/*
 * ip utility — fake implementation for now
 * replace the fetch call with a real IP geolocation API when ready
 */

export interface IpInfo {
    ip: string;
    country: string;
    region: string;
    city: string;
    timezone: string;
}

/*
 * returns a fake IpInfo object that mimics a real geolocation response
 * swap this with a real fetch (e.g. ipinfo.io/json) when deploying
 */
export async function fetchIpInfo(): Promise<IpInfo> {
    return new Promise(resolve =>
        setTimeout(
            () =>
                resolve({
                    ip: "127.0.0.1",
                    country: "TW",
                    region: "Taiwan",
                    city: "Taipei",
                    timezone: "Asia/Taipei"
                }),
            200
        )
    );
}

/*
 * returns true when the current device is likely in a restricted region
 * all regions are allowed in the fake implementation
 */
export function isRegionRestricted(_info: IpInfo): boolean {
    return false;
}
