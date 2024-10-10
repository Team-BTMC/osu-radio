import { Component, onCleanup } from 'solid-js';



type SongContextMenuItemProps = {
  onClick: (event: MouseEvent) => any,
  children: any,
}



const SongContextMenuItem: Component<SongContextMenuItemProps> = props => {
  let item: HTMLElement | undefined;



  const divAccessor = (div: HTMLElement) => {
    div.addEventListener("click", props.onClick);
    item = div;
  }

  onCleanup(() => {
    item?.removeEventListener("click", props.onClick);
  });



  return (
    <button ref={divAccessor}>{props.children}</button>
  );
};



export default SongContextMenuItem;