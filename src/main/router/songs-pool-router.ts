import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import Global from '../lib/Global';



Router.respond("querySongsPool", (_evt, payload) => {
  if (payload.view.isAllSongs === true) {
    return some(Global.cache.get("songs"));
  }

  return none();
});