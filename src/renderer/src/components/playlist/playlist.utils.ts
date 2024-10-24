import { CircleXIcon } from "lucide-solid";
import { addNotice } from "../notice/NoticeContainer";

export function noticeError(error: string) {
  addNotice({
    title: "Error",
    description: error,
    variant: "error",
    icon: CircleXIcon({ size: 20 }),
  });
}
