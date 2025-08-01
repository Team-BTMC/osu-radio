import { Router } from "@main/lib/route-pass/Router";
import { Client, SetActivity } from "@xhayper/discord-rpc";

const client = new Client({ clientId: "1292942523425099826" });

client.on("ready", () =>
  client.user?.setActivity(defaultPresence).catch(catchDiscordActivityError),
);

client.login().catch(catchDiscordActivityError);

const defaultPresence: SetActivity = {
  details: "Idle",
  largeImageKey: "logo",
  type: 2, // listening
  buttons: [{ label: "Check out osu!radio", url: "https://github.com/Team-BTMC/osu-radio" }],
};
Router.respond("discord::play", async (_evt, song, length, position) => {
  const endTimestamp = new Date(new Date().getTime() + (length - position) * 1000);
  const startTimestamp = new Date(endTimestamp.getTime() - length * 1000);

  const response = await fetch(
    `https://assets.ppy.sh/beatmaps/${song.beatmapSetID}/covers/list@2x.jpg`,
    { method: "HEAD" },
  );

  let largeImageKey = `https://assets.ppy.sh/beatmaps/${song.beatmapSetID}/covers/list@2x.jpg`;
  if (response.status === 404) {
    largeImageKey = "logo";
  }

  const presence: SetActivity = {
    details: song.title,
    state: song.artist,
    type: 2, // listening
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    largeImageKey: largeImageKey,
    buttons: [{ label: "Check out osu!radio", url: "https://github.com/Team-BTMC/osu-radio" }],
  };

  if (song.beatmapSetID) {
    presence.buttons?.push({
      label: "Go to this map on osu!",
      url: `https://osu.ppy.sh/beatmapsets/${song.beatmapSetID}`,
    });
  }

  client.user?.setActivity(presence).catch(catchDiscordActivityError);
});

Router.respond("discord::pause", async (_evt, song) => {
  const response = await fetch(
    `https://assets.ppy.sh/beatmaps/${song.beatmapSetID}/covers/list@2x.jpg`,
    { method: "HEAD" },
  );

  let largeImageKey = `https://assets.ppy.sh/beatmaps/${song.beatmapSetID}/covers/list@2x.jpg`;
  if (response.status === 404) {
    largeImageKey = "logo";
  }
  const presence: SetActivity = {
    details: song.title,
    state: song.artist,
    type: 2, // listening
    largeImageKey: largeImageKey,
    largeImageText: "Paused",
    buttons: [{ label: "Check out osu!radio", url: "https://github.com/Team-BTMC/osu-radio" }],
  };

  if (song.beatmapSetID) {
    presence.buttons?.push({
      label: "Go to this map on osu!",
      url: `https://osu.ppy.sh/beatmapsets/${song.beatmapSetID}`,
    });
  }

  client.user?.setActivity(presence).catch(catchDiscordActivityError);
});

function catchDiscordActivityError(err: unknown) {
  console.error("Discord activity error:\n", err);
}
