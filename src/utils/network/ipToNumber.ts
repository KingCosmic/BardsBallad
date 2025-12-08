/**
 * Converts an IPv4 address string to its numeric representation
 * @param ip - IPv4 address in string format (e.g., "192.168.0.1")
 * @returns The numeric representation of the IP address
 */
export function ipToNumber(ip: string): number {
    // Validate input format
    if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        throw new Error('Invalid IPv4 address format');
    }

    const octets = ip.split('.').map(Number);

    // Validate each octet is between 0-255
    if (octets.some(octet => octet < 0 || octet > 255)) {
        throw new Error('IP octets must be between 0 and 255');
    }

    // Use bitwise operations to calculate numeric representation of IPv4 address.
    return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
}
