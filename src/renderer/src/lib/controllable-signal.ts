import { accessWith } from "./solid-utils";
import { Accessor, createMemo, createSignal } from "solid-js";

type createControllableSignalParams<T> = {
  value?: Accessor<T | undefined>;
  defaultValue: T;
  onChange?: (newValue: T) => void;
};

function createControllableSignal<T>(props: createControllableSignalParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = createSignal(props.defaultValue);
  const isControlled = createMemo(() => props.value?.() !== undefined);
  const value = createMemo(() => (isControlled() ? props.value?.() : uncontrolledValue()));

  const setValue = (next: T | ((prevValue: T) => T)) => {
    const nextValue = accessWith(next, value() as T);

    if (!Object.is(nextValue, value())) {
      if (!isControlled()) {
        setUncontrolledValue(nextValue as any);
      }

      props.onChange?.(nextValue);
    }
  };

  return [value, setValue] as const;
}

export default createControllableSignal;
