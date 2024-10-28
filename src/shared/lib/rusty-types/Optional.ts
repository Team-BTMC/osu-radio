import { Optional } from "@shared/types/common.types";

export function none(): Optional<any> {
  return {
    isNone: true,
  };
}

export function some<V>(value: V): Optional<V> {
  return {
    value,
    isNone: false,
  };
}

export function orDefault<V>(opt: Optional<V>, def: V): V {
  if (opt.isNone) {
    return def;
  }

  return opt.value;
}
