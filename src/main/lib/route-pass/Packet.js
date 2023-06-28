export function cratePacket(channel, token, data, type = "DATA") {
    return {
        channel, token, data, type
    };
}
