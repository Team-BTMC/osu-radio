# Current status: Pre-Alpha

Roadmap | Alpha Features & Issues: https://github.com/orgs/Team-BTMC/projects/2
<br>
Main Figma Design: [https://www.figma.com/design/tNBJr7TlEsoWsWdAewqoUg](https://www.figma.com/design/tNBJr7TlEsoWsWdAewqoUg/osu!-radio?node-id=0-1&t=aIuThZAj00HcSjM5-1)

# What is osu!radio

It's an application that plays your osu! songs!

![Song Tab](https://github.com/user-attachments/assets/da67b906-1429-4cc1-9087-76026e94b98a "The screen show a UI with all the buttons (Play, Pause, Forward and Rewind, as well as a Seek bar, with 4 songs on the left")

### Download Guide

> [!NOTE]
> To use `git` and `npm`, you need to have [git](https://git-scm.com/) & [node.js](https://nodejs.org/en) installed

`1` | Open the terminal in the directory in which you want to download osu!radio. Then run the 2 following commands,

```sh
git clone https://github.com/Team-BTMC/osu-radio.git
```

```sh
cd osu-radio
```

`2` | Next, install the necessary files to run osu!radio,

```sh
npm install
```

`A` | For a production (User) startup,

```
npm run start
```

`B` | For a hot reloading (Dev) launch,

```
npm run dev
```

> [!WARNING]
> If you're planning on reinstalling it
>
> Windows: Be sure to go to `%appdata%` (`Win + R`, then type that in) and remove the folder `osu-radio-solidjs`
>
> Linux: Be sure to go to `~/.config/` and delete `osu-radio` directory

### Contribution

> [!TIP]
> To get started, it's highly recommended to make a [fork](https://github.com/Team-BTMC/osu-radio/fork) of this repository

If you're new to contributing, consider checking out [How to Contribute to an Open Source](https://opensource.guide/how-to-contribute/). It's the best and simplest guide to understand what contributing really is

If you're more interested in the coding side of things, be sure to read [Good Manners of a PR & Best Practices](https://medium.com/deliveryherotechhub/good-manners-of-a-pull-request-some-best-practices-cb2de3c3aea1), as well as [How to write a perfect PR](https://github.blog/developer-skills/github/how-to-write-the-perfect-pull-request/)

If you're more interested in contributing as a designer, check out the [Figma](https://www.figma.com/design/tNBJr7TlEsoWsWdAewqoUg/osu!-radio?node-id=0-1&t=aIuThZAj00HcSjM5-1)

Remember! Contributions come in all shapes and sizes.

# The Vision

Technologies:

- Electron
- Solid JS
- TypeScript

The main discussion is in the [BTMC TALENT SERVER](https://discord.gg/mefjfMjV), #prj-osu-radio
<br>
We'll be staying on Electron for the time being. As for UI, it will stay web-based for ease of use & cost of being web-based :)
<br>
For anything **code** related (Discussion, PR, Suggestions), contact **@CaptSiro**
<br>

For anything **design** related (UI / UX, Ideas, Suggestions), contact **@Dudu**

###### Animations are subject to change (the very few osu!radio has).
