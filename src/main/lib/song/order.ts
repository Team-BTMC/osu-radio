import { OrderType, Result, Song } from "../../../@types";
import { ok } from "../rust-like-utils-backend/Result";
import { averageBPM, msToBPM } from "./average-bpm";

export default function order(ordering: OrderType): Result<(a: Song, b: Song) => number, string> {
  const { prop, mode } = ordering;
  const sortDirection = mode === "asc" ? 1 : -1;

  switch (prop) {
    case "dateAdded":
      return ok((a: Song, b: Song) => {
        return (new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()) * sortDirection;
      });

    case "title":
    case "artist":
    case "creator":
      return ok((a: Song, b: Song) => {
        if (a[prop] === "") {
          return 1;
        }

        if (b[prop] === "") {
          return -1;
        }

        return a[prop].localeCompare(b[prop]) * sortDirection;
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
        if (a[prop] === "") {
          return 1;
        }

        if (b[prop] === "") {
          return -1;
        }

        return a.title.localeCompare(b.title) * sortDirection;
      });
  }
}
