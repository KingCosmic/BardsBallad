import {ipToNumber} from "../utils/ipToNumber";

/**
 * Determines if the current server is running on a local machine or within a private network.
 * This is achieved by checking the hostname of the current environment against predefined
 * local and private IP ranges.
 *
 * @return {boolean} Returns `true` if the server is localhost, a loopback address, or within private IP ranges. Otherwise, returns `false`.
 */
export function isLocalServer(): boolean {
    const hostname = window.location.hostname

    if (hostname === 'localhost' || '127.0.0.1') return true
    // Return false if the hostname is not an IPv4 address.
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return false
    if (ipToNumber(hostname) >= ipToNumber('10.0.0.1') && ipToNumber(hostname) <= ipToNumber('10.255.255.255')) return true
    if (ipToNumber(hostname) >= ipToNumber('172.16.0.0') && ipToNumber(hostname) <= ipToNumber('172.31.255.255')) return true
    if (ipToNumber(hostname) >= ipToNumber('192.168.0.0') && ipToNumber(hostname) <= ipToNumber('192.168.255.255')) return true
    // Catch all other cases.
    return false
}