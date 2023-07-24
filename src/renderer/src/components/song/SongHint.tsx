import "../../assets/css/song/song-item-hint.css";



export default function SongHint(): HTMLElement {
  return (
    <div class={"song-item-hint"}>
      <div class={"image"}></div>
      <div class={"column"}>
        <div class={"heading"}></div>
        <div class={"text"}></div>
      </div>
    </div>
  ) as HTMLElement;
}