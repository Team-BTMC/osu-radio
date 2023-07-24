const SCROLL_SPEED = 200;



export default function scrollAnimation(parent, velocity): () => void {
  let requestNext = true;
  let previous = performance.now() / 1_000;

  const frame = () => {
    const now = performance.now() / 1_000;
    parent.scrollBy(0, velocity * SCROLL_SPEED * (now - previous));
    previous = now;

    if (requestNext) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);

  return () => {
    requestNext = false;
  };
}