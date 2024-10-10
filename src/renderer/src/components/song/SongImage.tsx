import "../../assets/css/song/song-image.css";
import defaultBackground from "../../assets/osu-default-background.jpg";
import { availableResource, getResourcePath } from "../../lib/tungsten/resource";
import { Accessor, Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";

const SET_SOURCE_EVENT = "set-source";
const GLOBAL_GROUP = "global-group";

const observers = new Map<string, IntersectionObserver>();

type SongImageProps = {
  src: string | undefined | Accessor<string | undefined>;
  group?: string;
  instantLoad?: boolean;
};

const SongImage: Component<SongImageProps> = (props) => {
  const [bg, setBg] = createSignal<string | undefined>();
  const [src, setSrc] = createSignal(defaultBackground);
  let image;

  const setSource = (evt) => {
    setSrc(evt.detail);
    delete image.dataset.eventHandler;
  };

  createEffect(async () => {
    const b = bg();

    if (props.instantLoad === true) {
      const resource = await getResourcePath(b);
      setSrc(await availableResource(resource, defaultBackground));
      return;
    }

    if (image.dataset.eventHandler !== "YEP") {
      image.dataset.eventHandler = "YEP";
      image.addEventListener(SET_SOURCE_EVENT, setSource, { once: true });
    }
  });

  onMount(async () => {
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
    image.removeEventListener(SET_SOURCE_EVENT, setSource);
  });

  const srcProp = props.src;

  if (typeof srcProp === "function") {
    createEffect(() => setBg(srcProp()));
  } else {
    setBg(srcProp);
  }

  return (
    <div
      ref={image}
      class="song-image"
      style={{
        "background-image": `url('${src().replaceAll("'", "\\'")}')`,
      }}
      data-url={bg() ?? ""}
    ></div>
  );
};

export default SongImage;
