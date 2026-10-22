# Veno-arterial ECMO, drawn as a circuit

**Subtitle:** The mag-lev pump moves blood. The membrane lung changes it. A 34-second plate, and the claims it refuses.

**Medium title:** Veno-arterial ECMO, drawn as a circuit

**Slug:** veno-arterial-ecmo-circuit-plate

**Meta description:** A 34-second schematic of a veno-arterial ECMO circuit: where venous blood stays venous, where gas exchange happens, and what the drawing does not claim.

**Tags:** ECMO, Medical Devices, Biomedical Engineering, Perfusion, Anatomy

**Canonical:** https://mizcausevic-dev.github.io/ecmo-circuit-explainer/

---

A veno-arterial ECMO circuit drains venous blood, drives it with a centrifugal pump, exchanges gas in a hollow-fiber membrane lung, and returns blood on the arterial side. The pump does not oxygenate the blood. If a diagram changes the blood color inside the pump, the diagram is wrong.

That is the whole plate. It runs 34 seconds, 1,020 frames at 30 fps, and it is a schematic. It is not a device manual, not a measurement, and not clinical instruction.

Live plate: https://mizcausevic-dev.github.io/ecmo-circuit-explainer/

Source: https://github.com/mizcausevic-dev/ecmo-circuit-explainer

## Who this is for

Perfusion learners, device engineers, and clinical educators who need the order of the loop in one pass. The job of the page is orientation. Where does venous blood stay venous? Where does sweep gas travel? Which module is allowed to change the color?

It is a poor fit for someone who needs a cannulation plan, a flow setting, an alarm response, or a named console's service manual. Those require a different document, written against a specific device and a specific patient context. This plate has neither.

## Why the camera moves in this order

The clock is fixed:

| Time | Frames | What the camera does |
| --- | --- | --- |
| 0-5 s | 0-149 | Side profile. Brackets unclamp. The pump head translates along the drive axis. |
| 5-10 s | 150-299 | Axial cutaway of the centrifugal pump. |
| 10-17 s | 300-509 | Descent into the hollow-fiber bundle. |
| 17-25 s | 510-749 | One fiber wall, and the gas crossing it. |
| 25-34 s | 750-1019 | Pull-out to the full loop. |

The order is causal. You see the hardware first, then the mechanism that only moves blood, then the place where gas exchange happens, then the wall where the exchange is drawn, then the loop with every module lit. A reader who scrubs backward still lands on the same picture, because the frame index is the clock. Frame 640 is always the fiber wall. Frame 220 is always the pump.

Same frame, same drawing. That is the property that makes a schematic usable in a lecture. A timeline you cannot park on a claim is a film. A timeline you can park on is a plate.

## The console is already the whole loop

The first five seconds are a side profile of a mobile console. A clear pump head sits on a drive. A membrane lung stands downstream of it. A venous line enters. An arterial line leaves. A gas line feeds the oxygenator.

Two things move. The mounting brackets unclamp. The pump head translates forward along the drive axis, which is the setup for the cutaway that follows.

The monitor shows a trace and the words FLOW TRACE. There is no liters-per-minute figure on it. I did not measure a flow for this drawing, so the screen does not invent one. A number on a schematic monitor is how fake precision gets into a lecture slide.

Color is already doing work. The inbound line is venous burgundy, `#6A040F`, lifted only enough to read on a near-black slate. The outbound line is arterial vermilion, `#E63946`. The gas line is `#48CAE4`. On the console those three colors are a map: dark blood in, brighter blood out, gas into the lung. The next scenes have to honor that map.

## The pump is a mover, not a lung

From 5 to 10 seconds the camera is an axial cutaway of a centrifugal pump.

Venous blood enters at the axis. A bearingless impeller spins in the blood chamber. Stator elements sit outside the housing. Field lines are drawn from those elements toward the impeller. Blood leaves through a volute discharge aimed at the membrane lung, and it is still burgundy.

The clearance gap is the point of the cutaway. There is no shaft drawn through the blood path. That is the geometry mag-lev and other bearingless centrifugal pumps use to keep a mechanical bearing out of the blood. It limits one source of shear. It does not set hemolysis to zero, and the plate does not say that it does. The caption on that scene says the opposite of a performance claim: no shaft in the blood path, and no promise about a hemolysis rate.

I also left RPM off the figure. A real pump spins much faster than a teaching animation. Slowing the vanes so a person can see them is a time compression. Labeling a fake RPM next to that slow spin would mix a visual convenience with a specification. The plate skips the number.

## Gas exchange starts at the membrane lung

From 10 to 17 seconds the camera goes into the oxygenator.

The housing is a polymethylpentene hollow-fiber bundle. Sweep gas, drawn in gas-phase blue, travels inside the fiber lumens. Blood travels outside the fibers, in the opposite direction. That counter-current arrangement is the ordinary description of how these membrane lungs are laid out: gas in the lumen, blood in the space around the fibers, the two streams opposed so exchange can run along the length of the fiber.

At the canister, the inlet is burgundy and the outlet is vermilion. That is the first place the plate is allowed to change the blood color. Not in the tubing before the pump. Not in the volute. At the membrane lung.

The fibers are not a count. I did not draw "several thousand fibers" as a specification, because a fiber count belongs to a named oxygenator and a datasheet. The bundle is a field of lumens so the path is readable. When the camera is close, the gaps between fibers are burgundy and the lumens are blue. Path, then color. The label says which is which.

## One wall, and a scale mark that knows it is a mark

From 17 to 25 seconds the plate holds on a single fiber wall.

On the blood side, the bulk is venous. A boundary layer against the wall shifts toward vermilion. The wall is drawn as two ideas at once: a microporous support, and a dense polymethylpentene skin. Gas crosses. The drawing does not show plasma pouring through open holes. Modern PMP hollow fibers are taught that way for a reason. A porous path that leaks plasma is a different membrane problem than diffusion through a dense skin. The plate picks the diffusion picture and labels the dense skin.

Oxygen is drawn moving toward the plasma. Carbon dioxide is drawn moving toward the lumen. There are no partial pressures, no millimeters of mercury, and no saturation percentage. Those would be measurements. This scene does not have any.

The bracket on the boundary reads "10 μm schematic." The storyboard asked for a 10-micron diffusion boundary. Putting that number on the plate without the word schematic would imply I had measured a wall. I had not. The five scenes also do not share a ruler. The console is a machine. The fiber wall is a macro. A single scale bar across both would be a lie. The words on the bracket are the correction.

## The pull-out is a parts list in motion

From 25 to 34 seconds the camera pulls back to the loop.

The modules, in circulation order:

1. Venous cannula, burgundy.
2. Mag-lev drive.
3. Membrane lung.
4. Gas blender, with O₂ and air inlets and no inspired-oxygen fraction.
5. Heat exchanger, labeled water, not a temperature.
6. Arterial return, vermilion.

They illuminate as the loop comes into sync, then hold. The last line on the plate is "LOOP IN CIRCULATION SYNC." That is a state of the drawing, not a clinical status.

The heat exchanger is its own box downstream of the membrane lung. On many consoles the heat exchanger is built into the oxygenator housing. I split it so a viewer can point at it. The split is a teaching layout, and the page says so. If you are matching this plate to a cart, check whether the water circuit is a separate module or inside the lung.

The figure beside the loop is a body outline with two connection marks. It is not an anatomy of the heart, not a femoral recipe, and not a choice between peripheral and central cannulation. The plate commits to "venous drainage" and "arterial return." The cannulation site is a clinical decision this drawing does not make.

## What the page is, as software

The plate is one HTML file and one canvas script. No build step. No account. No form. No analytics. No third-party script. GitHub Pages serves it from the `pages` branch.

The playhead is the frame index. Scrubbing, the number keys, and the arrow keys all seek that index. If the display asks for reduced motion, playback stays parked until you press Play. A medical schematic that autoplays a spinning impeller at someone who asked for less motion is a rude default. The impeller still exists on the paused frame. The visitor decides whether it turns.

Determinism is the test I care about. Load `?frame=640&pause=1` and you are on the fiber wall, at 21.3 seconds, every time. That URL is a citation. A lecture can point at a frame the way a paper points at a figure.

## What I would not add

Three temptations showed up while the plate was being drawn, and all three lost.

A flow in liters per minute. It would make the monitor look finished. It would also be a fabricated operating point.

A hemolysis sentence in the affirmative. "Without shear hemolysis" was in the original camera note. The mechanism supports a narrower sentence: no shaft in the blood path, which is how these pumps limit one mechanical source of shear. The narrower sentence is the one on the plate.

A fiber-count and a wall thickness presented as data. The 10 μm callout survived only with the word schematic attached. A count of fibers would not survive at all without a datasheet and a named device.

Later, a real micrograph or a named housing can replace the schematic fibers. That replacement needs a rights status and a model name that is actually in the photograph. Until then, missing specificity is better than borrowed specificity.

## How to use the plate

Play it once at 1x. Then scrub.

Park on the pump and check the discharge color. It should still be venous.

Park on the oxygenator ports. Inlet burgundy, outlet vermilion.

Park on the fiber wall and read the bracket. If you need a real wall thickness, you need a datasheet, not this frame.

Park on the loop and name the modules in order: cannula, pump, lung, gas, heat, return. If you cannot do that from the picture, the labels have failed and the plate should be redrawn.

The page is here: https://mizcausevic-dev.github.io/ecmo-circuit-explainer/

The repository, including the brief and the safeguard list, is here: https://github.com/mizcausevic-dev/ecmo-circuit-explainer

Mirza Causevic, Kinetic Gain. The drawing is explanatory. Verify the device in front of you before you use any of this near a patient.
