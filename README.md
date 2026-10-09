# Holotron

> **Holotron** is a fork of [GAMEOTRON](https://github.com/gameotron/gameotron)
> for the Gameotron Game Jam. It keeps GAMEOTRON's phase order and mandatory
> approval gate intact and **additively** integrates the
> [Holonovel](https://github.com/flukeatzerocool/holonovel) world-model server
> as an MCP dependency to make generated game worlds validated and reproducible.
>
> Upstream license: **PolyForm Noncommercial License 1.0.0** — see `LICENSE.md`.
> The fork and any published output remain noncommercial. Upstream copyright
> notices are preserved.

---

# GAMEOTRON

**Turn ideas into playable browser game concepts.**

GAMEOTRON is a game development orchestrator that coordinates specialized AI agents to take a game idea from concept to playable prototype. Instead of generating random game ideas or incomplete code snippets, GAMEOTRON follows a structured pipeline that produces validated concepts, game design documentation, visual and audio direction, implementation, testing, bug fixing, polish, and deployment.

The primary goal is simple:

> Create ideas and turn them into playable concepts.

---

## Why GAMEOTRON?

Most game ideas never become playable.

GAMEOTRON solves this by orchestrating a complete game creation workflow that guides every project through ideation, design, implementation, testing, polish, and deployment.

Whether you start with a theme, a rough idea, or no idea at all, GAMEOTRON helps generate and refine concepts until they become a working browser game concept.

### Benefits

* Convert ideas into playable prototypes
* Generate 20 game concepts from a single theme
* Evaluate concepts for quality and feasibility
* Create complete Game Design Documents automatically
* Define visual and audio direction before development
* Generate browser-based games with touch and mouse support
* Run automated reviews and runtime testing
* Fix issues through iterative bug-fix cycles
* Add game feel polish: particles, screenshake, hit-stop, transitions, score popups
* Produce deployment-ready outputs

---

## What Users Can Do

### Discover New Game Ideas

Start with a theme and generate multiple game concepts tailored to that theme.

The theme is discovered automatically from the official theme page, or you can supply your own with a theme override (see **Usage**).

Examples of themes:

* Anything Goes
* Space Potato
* Cyber Pumpkin
* One Way Ticket

### Compare and Validate Concepts

GAMEOTRON doesn't stop at brainstorming.

Generated concepts are scored by an expert review on:

* HOOK: Does the concept grab attention immediately?
* TOUCH-FRIENDLINESS: Is it optimized for touch controls?
* THEME INTEGRATION: Does it use the theme meaningfully?

Each score runs 1-5, then `evaluation_agent` ranks all concepts with weighted scoring (HOOK 30%, TOUCH 25%, THEME 45%).

This helps users focus on concepts that can realistically become playable games.

### Create Complete Game Designs

Once a concept is selected, GAMEOTRON produces a comprehensive Game Design Document (GDD) that includes:

* Core gameplay loop
* Mechanics
* Progression systems
* User experience
* Technical requirements

### Define Art and Audio Direction

Before implementation begins, dedicated agents establish:

* Visual style
* Art direction
* User interface direction
* Sound design
* Music direction

This creates a clear creative vision for the project.

### Build Playable Browser Games

GAMEOTRON generates browser-based games as a single `index.html` file.

Features include:

* Mouse support
* Touch support
* Mobile-friendly controls
* Responsive canvas scaling
* Cross-device compatibility

### Automatically Review and Test

Every generated game goes through validation cycles that include:

* Static code review
* Runtime testing
* Issue detection
* Automated bug fixing

The process repeats until major issues are resolved or review limits are reached.

### Prepare for Deployment

Once testing is complete, deployment assets and deliverables are prepared. The game can be uploaded to itch.io via the Butler CLI — the user always confirms before any upload runs.

---

## Workflow

GAMEOTRON follows a structured six-phase pipeline with a polish pass:

### Phase 1: Discovery

* Fetch the theme from the official theme page (`gameotron.whiterabbitfactory.com`)
* Validate with up to 3 consistent fetches
* Or skip discovery entirely with a theme override

### Phase 2: Ideation

* Generate 20 game concepts
* Expert review (HOOK / TOUCH / THEME, each 1-5)
* **Mandatory user approval gate** — the user selects a concept before the pipeline continues
* Weighted evaluation (HOOK 30%, TOUCH 25%, THEME 45%) selects the best concept

### Phase 3: Design

* Create Game Design Document, including a Screen Inventory of 6+ screens (Title, Pause Menu with music/SFX toggles, How to Play, Gameplay, Settings, Game Over/Victory)

### Phase 4: Concept Development

* Define visual direction
* Define audio direction
* (Both agents run in parallel)

### Phase 5: Implementation

* Generate playable browser game
* Review code
* Run automated testing
* Fix issues
* Loop until no CRITICAL/HIGH/MEDIUM issues remain or 3 cycles are reached

### Phase 5.5: Polish

* Add juice: particles, screenshake, hit-stop, screen transitions, score popups
* All juice is togglable and must not break working code

### Phase 6: Deployment

* Prepare release artifacts
* Deploy deliverables (user confirms first)

---

## Getting Started

Follow these steps to set up and run GAMEOTRON in OpenCode:

### 1. Install OpenCode
Make sure you have **OpenCode** installed on your system. This serves as the primary prerequisite.

### 2. Clone the Repository
Clone the `gameotron` directory into your local project structure. 

### 3. Add the Project to OpenCode
1. Open the **OpenCode** application.
2. On the start page, **Add Project**.
3. Select the root folder.

### 4. Open the Session
1. Select the newly added gameotron project from your list.
2. Click on **New Session** to initialize the environment.

### 5. Run GAMEOTRON
1. Inside the session, choose your preferred AI model (e.g., the free **MiMo-V2.6-Flash Free**).
2. In the chat/input prompt, type the following command to activate the orchestrator:
   ```text
   use @gameotron
   ```
   for more information see section **Usage**

---

## Usage

```
Use gameotron
Use gameotron with theme: Space Potato
Use gameotron with full controls
Use gameotron with theme: Cyber Pumpkin with full controls
Create game with theme: One Way Ticket
```

Theme override syntax: `"with theme: X"`, `"theme: X"`, or `"Create game with theme: X"` — skips theme discovery and passes the theme directly to ideation.

---

## Browser Game Requirements

All generated games are designed for modern browsers and include:

### Technical Constraints

* Single `index.html` — all HTML, CSS, and JavaScript embedded
* Vanilla JavaScript only — no frameworks, no external libraries

### Mobile Support

* Touch controls
* Finger-sized touch targets
* Responsive layouts
* Viewport optimization

### Desktop Support

* Mouse controls
* Drag-and-drop interactions
* Click-based gameplay

### Optional Controls

* WASD
* Arrow Keys
* Space Bar

### Screen Inventory

Every game implements at least 6 screens:

* Title Screen (logo, Start, How to Play)
* Pause Menu (music toggle, SFX toggle, How to Play, back, resume)
* How to Play
* Gameplay
* Settings (music/SFX, Reset, Credits)
* Game Over / Victory

---

## Output

GAMEOTRON produces:

* `theme.txt` — discovered or overridden theme
* Game concepts (`concepts.txt`)
* Expert review (`concepts_with_review.txt`)
* `selected_concept.txt` — weighted evaluation result
* Game Design Documents (`gdd.md`)
* Visual direction documents
* Audio direction documents
* Playable browser game (`index.html`)
* Review reports (`buglist_HHmmss.txt`)
* Testing reports (`test_report_HHmmss.txt`, `runtime_errors_HHmmss.txt`)
* Juice reports (`juice_report.txt`)
* Deployment assets
* Process logs (timestamped)

---

## Core Philosophy

**Ideas are cheap. Playable concepts create value.**

GAMEOTRON focuses on transforming ideas and concepts into playable experiences through a structured, repeatable, and testable development pipeline.

---

## License

This project is licensed under the PolyForm Noncommercial License 1.0.0 - see the [LICENSE] file for details.

