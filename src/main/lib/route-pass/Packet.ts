import type { PacketType, Packet } from "@shared/types/common.types";

export function cratePacket<T>(
  channel: string,
  token: string,
  data: T,
  type: PacketType = "DATA",
): Packet<T> {
  return {
    channel,
    token,
    data,
    type,
  };
}
