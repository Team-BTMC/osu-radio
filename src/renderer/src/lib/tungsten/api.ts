import { none, some } from "./rust-like-utils-client/Optional.js";
import { APIClient, Optional } from "../../@types";



export const API_KEY = "api";

export function importAPI(): Optional<APIClient> {
    if (!(API_KEY in window)) {
        return none();
    }

    return some(window[API_KEY]);
}