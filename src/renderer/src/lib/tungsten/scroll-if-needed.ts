export default function scrollIntoViewIfNeeded (child: HTMLElement, parent: HTMLElement) {
  if ((child.offsetTop + child.offsetHeight) > (parent.scrollTop + parent.clientHeight)) {
    parent.scrollTo({
      top: (child.offsetTop + child.offsetHeight) - parent.clientHeight,
    });
  } else if ((child.offsetTop + child.offsetHeight) < parent.scrollTop) {
    parent.scrollTo({
      top: child.offsetTop,
    });
  }
}