import { fail, ok } from '../rust-like-utils-backend/Result';
import { Song } from '../../../@types';
import { averageBPM } from '../osu-file-parser/song';



export default function order(o: string) {
  const [prop, mode] = o.split(":");
  const sortDirection = mode === "asc" ? 1 : -1;

  if (prop === undefined || mode === undefined) {
    return fail(`Bruh, this ordering '${o}' won't work... And you should know...`);
  }

  switch (prop) {
    case "dateAdded":
      return ok((a: Song, b: Song) => {
        return (new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()) * sortDirection
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
        const bpmA = Math.round(60_000 / (averageBPM(a.bpm, a.duration * 1_000)));
        const bpmB = Math.round(60_000 / (averageBPM(b.bpm, b.duration * 1_000)));

        if (isNaN(bpmA)) {
          return 1;
        }

        if (isNaN(bpmB)) {
          return -1;
        }

        return (bpmA - bpmB) * sortDirection;
      });

    case "duration":
      return ok((a: Song, b: Song) =>
        (a.duration - b.duration) * sortDirection);

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