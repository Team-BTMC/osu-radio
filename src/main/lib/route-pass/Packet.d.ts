import type { PacketType, Packet } from "../../../@types";
export declare function cratePacket<T>(channel: string, token: string, data: T, type?: PacketType): Packet<T>;
