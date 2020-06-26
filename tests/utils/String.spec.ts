import { replaceAll, capitalize } from '@/utils/String';

describe('String', () => {
  test('replaceAll', () => {
    const multipleReplacements = 'A car without a car engine';
    const oneReplacement = 'A game with a game engine';
    const replace = 'A game without a game engine';
    const noReplacement = replace;

    expect(replaceAll(replace, 'game', 'car')).toBe(multipleReplacements);
    expect(replaceAll(replace, 'without', 'with')).toBe(oneReplacement);
    expect(replaceAll(replace, 'zombie', 'enemy')).toBe(noReplacement);
  });

  test('capitalize', () => {
    const name = 'another dumb zombie game';
    const capitalized = 'Another dumb zombie game';
    expect(capitalize(name)).toBe(capitalized);
  });
});
