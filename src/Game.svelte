<main bind:this={main}>
  {#if loading}
    <Loader on:loaded={() => loading = false} />
  {:else}
    {#if game.pause || !lastFrameDelta}
      <Pause on:start={() => togglePause(false)} />
    {:else}
      <Aim hide={aiming} />

      <Map
        playerRotation={player.rotation}
        playerPosition={player.position}
        radius={mapRadius / zoomScale}
        scale={scale} zoom={zoomScale}
        on:rifle={updateRifleAngle}
      />

      {#if visibleRifle}
        <BorderRifle
          playerRotation={player.rotation}
          angle={rifleAngle}
        />
      {/if}
    {/if}
  {/if}
</main>

<script lang="ts">
  import BorderRifle from '@components/BorderRifle.svelte';
  import { GameEvents } from '@/managers/GameEvents';

  import Loader from '@components/Loader.svelte';
  import Pause from '@components/Pause.svelte';
  import { onMount, onDestroy } from 'svelte';
  import GameLoop from '@/managers/GameLoop';
  import { Elastic } from '@/utils/Elastic';

  import type { Location } from '@/types.d';
  import Aim from '@components/Aim.svelte';
  import Map from '@components/Map.svelte';
  import Viewport from '@/utils/Viewport';
  import { PI } from '@/utils/Number';

  const scaleRatio = Math.tan(PI.d3) + Number.EPSILON;
  const scaleFactor = Math.round(scaleRatio * 100);
  const radiusFactor = scaleFactor / 10.0;

  const zoom = new Elastic.Number(0);
  const game = new GameLoop();

  let visibleRifle = false;
  let rifleAngle: number;
  let main: HTMLElement;
  let player: Location;

  let zoomScale: number;
  let mapRadius: number;

  let loading = true;
  let aiming = false;

  let scale: number;
  let raf: number;

  let lastFrameDelta = 0;
  const FPS = 60, INT = 1e3 / 60;
  const FMT = INT * (60 / FPS) - INT / 2;

  function togglePause (paused: boolean): void {
    if (game.pause !== paused) {
      paused
        ? cancelAnimationFrame(raf)
        : requestAnimationFrame(update);

      game.pause = paused;
    }
  }

  function update (delta: number): void {
    if (delta - lastFrameDelta < FMT) {
      raf = requestAnimationFrame(update);
      return;
    }

    raf = requestAnimationFrame(update);
    player = game.playerLocation;
    lastFrameDelta = delta;

    zoomScale = Math.round(
      (1 - zoom.value) * 1e5 + Number.EPSILON
    ) / 1e5;

    zoom.update();
    game.update();
  }

  function updateRifleAngle (event: CustomEvent): void {
    visibleRifle = event.detail.visible;
    rifleAngle = event.detail.angle;
  }

  function updateScale (width: number): void {
    mapRadius = width / radiusFactor;
    scale = width / scaleFactor;
  }

  GameEvents.add('game:pause', event => togglePause(event.data as boolean));
  Viewport.addResizeCallback(updateScale);

  GameEvents.add('player:run', event => {
    const running = event.data as boolean;
    if (running) aiming = true;
    zoom.set(+running * 0.5);
  });

  GameEvents.add('player:aim', event =>
    aiming = event.data as boolean
  );

  onMount(() => {
    updateScale(Viewport.size.width);

    game.scenes.forEach(
      scene => scene && main.prepend(scene)
    );
  });

  !import.meta.hot && onDestroy(() => {
    Viewport.removeResizeCallback(updateScale);

    GameEvents.remove('player:run');
    GameEvents.remove('player:aim');

    GameEvents.remove('pause');
    cancelAnimationFrame(raf);

    togglePause(true);
    game.destroy();
  });
</script>

<style lang="scss" global>
@use '@/variables' as var;

h1,
h2,
h3,
h4 {
  font-family: 'FaceYourFears', sans-serif;
  letter-spacing: normal;
  line-height: normal;

  position: relative;
  color: var.$red;
  display: block;

  padding: 0;
  margin: 0;
}

p,
h5,
h6,
span,
strong,
button {
  font-family: 'DrawingBlood', sans-serif;
  letter-spacing: 0.2rem;
  line-height: normal;

  position: relative;
  color: var.$grey;
  display: block;

  padding: 0;
  margin: 0;
}

h1 {
  text-transform: uppercase;
  letter-spacing: 0.5rem;

  line-height: 5vw;
  font-size: 5vw;
}

h2 {
  letter-spacing: 0.4rem;
  line-height: 4vw;
  font-size: 4vw;
}

h3 {
  letter-spacing: 0.3rem;
  line-height: 3vw;
  font-size: 3vw;
}

main,
main > canvas {
  transform: translate(-50%, -50%);
  aspect-ratio: var(--ratio);

  height: var(--height);
  width: var(--width);

  position: absolute;
  overflow: hidden;
  display: block;

  padding: 0;
  margin: 0;

  left: 50%;
  top: 50%;
}

main > canvas:nth-child(2) {
  pointer-events: none;
}
</style>
