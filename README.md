# VA-ECMO circuit

34-second anatomy plate of a veno-arterial ECMO loop. 1,020 frames at 30 fps, indexed 0-1019. The figure is a labeled schematic, not a measurement and not a clinical manual.

Live plate: https://mizcausevic-dev.github.io/ecmo-circuit-explainer/

Repository: https://github.com/mizcausevic-dev/ecmo-circuit-explainer

## What the plate shows

1. Console, 0-5 s. Brackets unclamp. The pump head translates along the drive axis.
2. Mag-lev pump, 5-10 s. Bearingless impeller, venous blood only.
3. Membrane lung, 10-17 s. Polymethylpentene hollow fibers. Sweep gas in the lumens. Blood outside.
4. Fiber wall, 17-25 s. Oxygen in, carbon dioxide out. The 10 μm mark is a schematic callout.
5. Full loop, 25-34 s. Cannula, mag-lev drive, gas blender, membrane lung, heat exchanger, arterial return.

Blood stays burgundy through the pump. Vermilion starts at the membrane lung.

## What it refuses

- No zero-hemolysis claim. No shaft in the blood path is not a hemolysis rate.
- No flow, pressure, saturation, RPM, or temperature numbers.
- Scenes do not share one scale.
- The heat exchanger is drawn as its own module. Many consoles build it into the oxygenator.
- Not for diagnosis, treatment, dosing, or device operation.

## Run

Open `index.html`. GitHub Pages serves the `pages` branch.

Space plays and pauses. Keys 1-5 jump stages. Arrow keys step one second.

## Conflict note

The storyboard locks the medical palette, so this page does not carry a seven-theme switcher.

## About

34-second anatomy plate of a veno-arterial ECMO circuit: mag-lev pump, PMP oxygenator, schematic only.

Topics: `ecmo` `veno-arterial` `medical-animation` `anatomy` `perfusion` `polymethylpentene` `motion-explainer` `education` `medical-technology` `technical-schematic`
