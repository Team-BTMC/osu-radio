export default function SongHint(): HTMLElement {
  return (
    <div class="flex items-center bg-opacity-80 bg-black p-2 rounded-md shadow-lg">
      <div class="w-12 h-12 bg-gray-700 rounded-md mr-3"></div>
      <div class="flex flex-col">
        <div class="w-32 h-4 bg-gray-700 rounded mb-2"></div>
        <div class="w-24 h-3 bg-gray-600 rounded"></div>
      </div>
    </div>
  ) as HTMLElement;
}
