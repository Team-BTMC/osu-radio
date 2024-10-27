import { Order, Result, Song } from "@types";
import { ok } from "@shared/lib/rust-types/Result";
import { averageBPM, msToBPM } from "./average-bpm";

export default function order(ordering: Order): Result<(a: Song, b: Song) => number, string> {
  const { option, direction } = ordering;
  const sortDirection = direction === "asc" ? 1 : -1;

  switch (option) {
    case "dateAdded":
      return ok((a: Song, b: Song) => {
        return (new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()) * sortDirection;
      });

    case "title":
    case "artist":
    case "creator":
      return ok((a: Song, b: Song) => {
        if (a[option] === "") {
          return 1;
        }

        if (b[option] === "") {
          return -1;
        }

        return a[option].localeCompare(b[option]) * sortDirection;
      });

    case "bpm":
      return ok((a: Song, b: Song) => {
        const bpmA = msToBPM(averageBPM(a.bpm, a.duration * 1_000));
        const bpmB = msToBPM(averageBPM(b.bpm, b.duration * 1_000));

        if (!Number.isFinite(bpmA)) {
          return 1;
        }

        if (!Number.isFinite(bpmB)) {
          return -1;
        }

        return (bpmA - bpmB) * sortDirection;
      });

    case "duration":
      return ok((a: Song, b: Song) => (a.duration - b.duration) * sortDirection);

    default:
      return ok((a: Song, b: Song) => {
        if (a[option] === "") {
          return 1;
        }

        if (b[option] === "") {
          return -1;
        }

        return a.title.localeCompare(b.title) * sortDirection;
      });
  }
}
