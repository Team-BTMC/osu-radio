export default function SongHint(): HTMLElement {
  return (
    <div class="flex items-center rounded-md bg-black bg-opacity-80 p-2 shadow-lg">
      <div class="mr-3 h-12 w-12 rounded-md bg-gray-700"></div>
      <div class="flex flex-col">
        <div class="mb-2 h-4 w-32 rounded bg-gray-700"></div>
        <div class="h-3 w-24 rounded bg-gray-600"></div>
      </div>
    </div>
  ) as HTMLElement;
}
