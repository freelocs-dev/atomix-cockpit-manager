# AtomixOS Config

> Personal mode manager for a custom Linux desktop experience layer.  
> Built on top of Nobara Linux (KDE Plasma).

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Linux%20%2F%20KDE%20Plasma-informational?style=flat-square)
![Status](https://img.shields.io/badge/status-personal%20beta-orange?style=flat-square)

---

## What is this?

AtomixOS Config is a web-based configuration UI that manages a set of shell 
scripts running on top of KDE Plasma. It lets you switch between three 
desktop modes — Gaming, Work, and Creator — each with its own color scheme, 
wallpaper, and auto-start apps.

This is a **personal tool**, not an official product. It runs as a local 
web app and generates shell scripts you copy to your system.

---

## Modes

| Mode | Accent | Use Case |
|------|--------|----------|
| ⚡ Gaming | Red `#DC2626` | Performance, full focus, immersion |
| 💼 Work | Blue `#0EA5E9` | Development, clarity, flow |
| 🎨 Creator | Amber `#F59E0B` | Video, design, creative work |

---

## Features

- Switch between desktop modes with one click
- Configure auto-start apps per mode
- Set wallpaper path per mode
- Generate and download shell scripts dynamically
- All config persists locally (localStorage)
- Download all scripts as `.zip`

---

## System Requirements

- Linux with KDE Plasma 5 or 6
- Nobara / Fedora recommended
- `plasma-apply-colorscheme` available (standard KDE install)
- `qdbus` available (standard KDE install)
- `notify-send` available

---

## Setup

**1. Install the shell scripts on your system:**

```bash
mkdir -p ~/.atomixos/scripts ~/.atomixos/wallpapers ~/.atomixos/state
```

**2. Open the config app** in your browser (local or deployed).

**3. Configure your modes** — apps, wallpaper paths, behavior.

**4. Download the generated scripts** via the Script Generator section.

**5. Copy them to your system:**

```bash
cp gaming.sh work.sh creator.sh reset.sh ~/.atomixos/scripts/
chmod +x ~/.atomixos/scripts/*.sh
```

**6. Switch modes:**

```bash
bash ~/.atomixos/scripts/gaming.sh
```

---

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- shadcn/ui
- JSZip

---

## Personal Use

This tool is built for my personal Linux setup. Feel free to fork and 
adapt it for your own system. Issues and PRs are welcome but this 
project has no roadmap commitments.

---

## License

MIT — see [LICENSE](LICENSE)
