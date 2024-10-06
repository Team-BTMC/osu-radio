# Current status: Pre-Alpha

Roadmap | Alpha Features & Issues: https://github.com/orgs/Team-BTMC/projects/2
<br>
Main Figma Design: [https://www.figma.com/design/tNBJr7TlEsoWsWdAewqoUg](https://www.figma.com/design/tNBJr7TlEsoWsWdAewqoUg/osu!-radio?node-id=0-1&t=aIuThZAj00HcSjM5-1)

[//]: # (You can remove the ${\textsf{\color{#f462a3}osu!}}$ if you just want it be osu!radio instead. That color can only work if there's spaces on both side)

# What is osu!radio
It's an application that play your ${\textsf{\color{#f462a3}osu!}}$ songs!

![Song Tab](https://github.com/user-attachments/assets/da67b906-1429-4cc1-9087-76026e94b98a "The screen show a UI with all the buttons (Play, Pause, Forward and Rewind, as well as a Seek bar, with 4 songs on the left")

### Download Guide
> [!NOTE]
> To use `git` and `npm`, you need to have [git](https://git-scm.com/) & [node.js](https://nodejs.org/en) installed

`1` | Open the terminal in the directory you want to download osu!radio in. Then do the 2 following command,
```
git clone https://github.com/Team-BTMC/osu-radio.git
```
```
cd osu-radio
```

`2` | Next, install the necessary files to run osu!radio,
```
npm ci
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
> If you're planning on reinstalling it, be sure to go to `%appdata%` (`Win + R`, then type that in) and remove the folder `osu-radio-solidjs`

### Contribution
> [!TIP]
> To get started, it's highly recommended to make a [fork](https://github.com/Team-BTMC/osu-radio/fork) of this repository

If you're new to contributing, consider checking out [How to Contribute to an Open Source](https://opensource.guide/how-to-contribute/). It's the best and most simplest guide to understand what contributing really is

If you're more interested in the coding side of things, be sure to read [Good Manners of a PR & Best Practices](https://medium.com/deliveryherotechhub/good-manners-of-a-pull-request-some-best-practices-cb2de3c3aea1), as well as [How to write a perfect PR](https://github.blog/developer-skills/github/how-to-write-the-perfect-pull-request/) 

If you're more interested in contributing as a designer, check out the [Figma](https://www.figma.com/design/tNBJr7TlEsoWsWdAewqoUg/osu!-radio?node-id=0-1&t=aIuThZAj00HcSjM5-1) page

Remember! Contribution come in all shape and size.
# The Vision

Technologies:
- Electron
- Solid JS
- TypeScript

Main dicussion is in the [BTMC TALENT SERVER](https://discord.gg/mefjfMjV), #prj-osu-radio
<br>
We'll be staying on Electron for the time being. As for UI, it will stay web-based for ease of use & cost of being web-based :)
<br>
For anything **codes** related (Discussion, PR, Suggestions), contact **@CaptSiro**
<br>
For anything **designs** related (UI / UX, Ideas, Suggestions), contact **@Dudu**
###### Animations are subject to change (the very few osu!radio has).
