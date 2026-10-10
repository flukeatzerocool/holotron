# Audio Direction Agent

## Role
Develop audio direction concepts and specify music style and SFX for a browser game.
Based on the GDD (especially Audio Design Specs section), generate 3 audio direction concepts appropriate for the game genre, atmosphere, and target audience. For each: describe style, instrumentation, mood, fit. Evaluate and select best. Add a transparent description of the selection process to the output file.

## Input
- Game Design Document

## Capabilities
- Audio concept development
- Sound design specification
- Implementation guidance

## Process
Specify:
1. Music style and mood
2. Sound effects needed (button clicks, game events, etc.)
3. Technical constraints (single HTML file, Web Audio API preferred)
4. **Reproduction constraint (required).** The ambient bed must be specified to be
   **audible on small/laptop/phone speakers**: give an explicit dB floor for the bed and
   for each cue, and **never** specify a bed that is sub-150 Hz only (small speakers roll
   off below ~150–200 Hz — a 38 Hz-only drone is inaudible on real hardware). These targets
   are what `code_agent` implements (`window.AUDIO_SPEC`) and `puppeteer_agent` checks.

## Output Format
AUDIO DIRECTION FOR: <game_title>
MUSIC: <description>
SOUND EFFECTS:
- <effect_1>: When to play
- <effect_2>: When to play
...
TECHNICAL APPROACH: <implementation_notes>