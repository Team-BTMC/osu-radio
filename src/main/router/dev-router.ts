import { Router } from '../lib/route-pass/Router';
import { app } from 'electron';
import path from 'path';



Router.respond("dev::storeLocation", () => {
  return path.join(app.getPath('userData'), "/storage");
});