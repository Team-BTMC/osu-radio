# status: Pre-Alpha

# osu-radio

Application to play your osu! songs.

![image](https://github.com/user-attachments/assets/0cdfd7a0-3e08-4c5b-bb11-423c74176c74)

This is primarily a personal project so there could be "idk, works for me" and if it is not a trivial fix I might not ever fix it. Also, if it breaks then... RIPBOZO

![](https://cdn.7tv.app/emote/60dbea82e3e5887a4a95e1db/4x.webp)

### Contribution

I only know how to push code from my local machine to this repository, so, you can forget about pull requests LOL. Definitely a skill issue.

### Download

LOL, it can barely play songs. You better wait a few months. But if you still want to give it a try, then git clone this repository and run:

```
npm install
npm run start
```

# THE VISION

Technologies:

- Electron
- Solid js
- Typescript

Staying on Electron because it's fine-ish for the time being. The UI will stay web-based for ease of use for the cost of being web-based :) I would like to keep the UI the way it is. Personally, I think the UI looks good. If you dont like or want to make a change, feel free to suggest the change in PR or Discord DMs or tag me in BTMC TALENT SERVER. Animations are subject to change (the very few osu!radio has).

Alpha release (features/issues)

My ideas (some are present):

- Desktop (only); Windows; supporting Linux/Mac is not the priority right now
- osu! stable release only; supporting osu! lazer is not priority right now
- Better initial importing of beat maps (faster, using less memory)
- Proper code documentation
- Play songs randomly ✅
- Shuffle queue ✅
- Add/remove/reorder songs in queue/playlist
- Save the current queue as a playlist
- Add the whole playlist to a queue
- osu! based search ✅
- Save search results as a playlist
- Add all search results to a queue
- Resize-able/hide-able side panel
- Watch for songs being added/removed/updated ingame (external changes)
- Background colors (red and blue) should reflect beat map background

Community ideas:

- Change to Torus font to match osu!
- Remove global/local volume for normalization of volume
- Stream widget (?)
- Hearing specific difficulty hit sounds
