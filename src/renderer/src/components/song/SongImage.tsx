import defaultBackground from "@/assets/osu-default-background.jpg";
import { availableResource, getResourcePath } from "@/lib/tungsten/resource";
import { Accessor, Component, createEffect, createSignal, JSX, onCleanup, onMount } from "solid-js";

const SET_SOURCE_EVENT = "set-source";
const GLOBAL_GROUP = "global-group";

const observers = new Map<string, IntersectionObserver>();

type SongImageProps = {
  src: string | undefined | Accessor<string | undefined>;
  group?: string;
  instantLoad?: boolean;
  onImageLoaded?: (src: string) => void;
} & JSX.IntrinsicElements["div"];

const SongImage: Component<SongImageProps> = (props) => {
  const [src, setSrc] = createSignal(defaultBackground);
  let image: HTMLDivElement | undefined;

  const setSource = (evt: CustomEventInit<string>) => {
    if (!evt.detail) {
      return;
    }

    setSrc(evt.detail);
    props.onImageLoaded?.(evt.detail);
    delete image?.dataset.eventHandler;
  };

  createEffect(async () => {
    const b = typeof props.src === "function" ? props.src() : props.src;
    if (props.instantLoad) {
      const resource = await getResourcePath(b);
      const resolvedImagePath = await availableResource(resource, defaultBackground);
      setSrc(resolvedImagePath);

      return;
    }

    if (image && image.dataset.eventHandler !== "YEP") {
      image.dataset.eventHandler = "YEP";
      image.addEventListener(SET_SOURCE_EVENT, setSource, { once: true });
    }
  });

  onMount(async () => {
    if (!image) {
      return;
    }

    const group = props.group ?? GLOBAL_GROUP;
    let observer = observers.get(group);

    if (observer === undefined) {
      observer = new IntersectionObserver(
        async (entries) => {
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting === false) {
              return;
            }

            const resource = await getResourcePath(
              String(entries[i].target.getAttribute("data-url")),
            );

            entries[i].target.dispatchEvent(
              new CustomEvent(SET_SOURCE_EVENT, {
                detail: await availableResource(resource, defaultBackground),
              }),
            );

            observer?.unobserve(entries[i].target);
          }
        },
        { rootMargin: "50px" },
      );
      observers.set(group, observer);
    }

    observer.observe(image);
  });

  onCleanup(() => {
    image?.removeEventListener(SET_SOURCE_EVENT, setSource);
  });

  return (
    <div
      {...props}
      ref={image}
      style={{
        "background-image": `url('${src().replaceAll("'", "\\'")}')`,
      }}
      data-url={props.src ?? ""}
    />
  );
};

export default SongImage;
