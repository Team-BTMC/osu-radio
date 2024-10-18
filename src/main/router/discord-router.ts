import { Client, SetActivity } from "@xhayper/discord-rpc";
import { Router } from "../lib/route-pass/Router";

const client = new Client({ clientId: "1292942523425099826" });

client.on("ready", () => client.user?.setActivity(defaultActivity));
client.login();

const defaultActivity: SetActivity = {
  details: "Idle",
  largeImageKey: "logo",
  type: 2, // listening
  buttons: [{ label: "Check out osu!radio", url: "https://github.com/Team-BTMC/osu-radio" }],
};

//Made updateActivity function to lower repeated code.
async function updateActivity(song, duration) {
  const activity = { ...defaultActivity }; 
  
  //Adds common properties first.
  activity.details = song.title;
  activity.state = song.artist;
  activity.largeImageKey = await getLargeImageKey(song);

  //Adds different properties based on if it is paused or not.
  if (isPaused) {
    activity.largeImageText = "Paused";
  } else {
    const startTimestamp = new Date(Date.now() - (duration ? duration * 1000 : 0));
    const endTimestamp = startTimestamp.getTime() + song.duration * 1000;

    activity.startTimestamp = startTimestamp;
    activity.endTimestamp = endTimestamp;
  }

  if (song.beatmapSetID) {
    activity.buttons = [{ label: "Go to this map on osu!", url: `https://osu.ppy.sh/beatmapsets/${song.beatmapSetID}` }];
  }

  client.user?.setActivity(activity);
}

//Made getLargeImageKey to lower repeated code.
async function getLargeImageKey(song) {
  const response = await fetch(
    `https://assets.ppy.sh/beatmaps/${song.beatmapSetID}/covers/list@2x.jpg`,
    { method: "HEAD" },
  );
  return response.status === 404 ? "logo" : `https://assets.ppy.sh/beatmaps/${song.beatmapSetID}/covers/list@2x.jpg`;
}
//Adds timer to stop spamming the pause button from doing goofy stuff and when you are pause if you click on the seek bar it no longer shows the rpc playing (Unless you drag it around still haven't figured a fix for that.)
let skipTimer: NodeJS.Timeout | null = null;
const waitTime = 500;
let hasActivityStarted = false;
let isPaused = false;
let currentTime;
let previousTime;

Router.respond("discord::play", async (_evt, song, duration) => {
  //Lets the first activity change happen or else nothing works apparently.
  if (!hasActivityStarted) {
    hasActivityStarted = true;
    updateActivity(song, duration);
    return;
  }

  //This essentially makes it so as long as you continue to spam pause and unpause it will never change, once you stop it will let you after a small delay.
  if (skipTimer) {
    clearTimeout(skipTimer);
  }

  //Stores the previous time of the last play event and the current time of the play event to compare (This makes it so if you skip forward or backwards mor than 5 seconds in the seek bar while pause it stays paused. Not really sure how else to fix this honestly. Also still has issues if you take the bar and drag it across.)
  previousTime = currentTime;
  currentTime = duration;

  //Check if the previous state was paused
  if (isPaused) {
    //Compare  the last updated currentTime and previousTime
    const pauseDifference = Math.abs(currentTime - previousTime);

    //If the time difference is greater than 5 seconds it stays paused to fix the issue mentionned on line 72. If it is less than 5 it lets changes it (This is this way so that pausing and unpausing normally doesn't mess up. Again not really sure how else to do this.)
    if (pauseDifference > 5) {
      isPaused = true;
    } else {
      isPaused = false;
    }
  }

  //Updates the activity only after the specified waitTime. (This is to fix the issue of pause and unpause multiple times causing it to show the play activity if you land on pause.)
  skipTimer = setTimeout(() => {
    updateActivity(song, duration);
  }, waitTime);
});

Router.respond("discord::pause", async (_evt, song) => {
  isPaused = true;
  updateActivity(song, null);
});
