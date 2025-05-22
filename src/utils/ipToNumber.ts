/**
 * Converts an IPv4 address string into its equivalent numerical value.
 *
 * @param ip The IPv4 address in dot-decimal notation (e.g., "192.168.0.1").
 * @return The numeric representation of the given IPv4 address.
 */
export function ipToNumber(ip: string): number {
    const octets = ip.split('.').map(Number)
    return octets[0] * Math.pow(256, 3) + octets[1] * Math.pow(256, 2) + octets[2] * 256 + octets[3];
}