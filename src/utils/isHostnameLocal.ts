import {ipToNumber} from "@utils/ipToNumber";

/**
 * Defines the private IP address ranges according to RFC 1918.
 * These are IP addresses reserved for use in private networks.
 * @constant
 * @type {Object}
 */
const PRIVATE_IP_RANGES = {
    // 10.0.0.0 - 10.255.255.255
    CLASS_A: {
        MIN: (10 << 24),
        MAX: (10 << 24) | 0xFFFFFF
    },
    // 172.16.0.0 - 172.31.255.255
    CLASS_B: {
        MIN: (172 << 24) | (16 << 16),
        MAX: (172 << 24) | (31 << 16) | 0xFFFF
    },
    // 192.168.0.0 - 192.168.255.255
    CLASS_C: {
        MIN: (192 << 24) | (168 << 16),
        MAX: (192 << 24) | (168 << 16) | 0xFFFF
    }
};

/**
 * Determines if the current hostname is a local address.
 * 
 * This function checks if the current hostname is:
 * - Exactly "localhost" or "127.0.0.1"
 * - A valid IPv4 address that falls within private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
 * 
 * @returns {boolean} True if the hostname is local, false otherwise
 */
export function isHostnameLocal(): boolean {
    const hostname = window.location.hostname;

    // Check for localhost explicitly
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

    // Return false if the hostname is not an IPv4 address
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return false;

    try {
        const hostIpNumber = ipToNumber(hostname);

        // Check if IP is in any of the private ranges
        return (
            (hostIpNumber >= PRIVATE_IP_RANGES.CLASS_A.MIN && hostIpNumber <= PRIVATE_IP_RANGES.CLASS_A.MAX) ||
            (hostIpNumber >= PRIVATE_IP_RANGES.CLASS_B.MIN && hostIpNumber <= PRIVATE_IP_RANGES.CLASS_B.MAX) ||
            (hostIpNumber >= PRIVATE_IP_RANGES.CLASS_C.MIN && hostIpNumber <= PRIVATE_IP_RANGES.CLASS_C.MAX)
        );
    } catch (error) {
        // If IP conversion fails, it's not a valid IP address
        return false;
    }
}
