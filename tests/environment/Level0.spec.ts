import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';

jest.mock('@three/renderers/WebGLRenderer');
jest.mock('three/examples/jsm/WebGL');

declare const global: any;
global.PRODUCTION = false;
global.BUILD = '0.1.0';

import Level0 from '@/environment/Level0';

describe('Level0', () => {
  const level = new Level0();

  test('Create', () => {
    expect(Level0).toBeDefined();
    expect(level).toBeInstanceOf(Level0);
  });

  test('getCamera', () => {
    expect(level.getCamera()).toBeInstanceOf(PerspectiveCamera);
  });

  test('render', () => {
    const render = jest.fn(level.render.bind(level));
    render();
    expect(render).toHaveReturnedWith(undefined);
  });

  test('destroy', () => {
    const destroy = jest.fn(level.destroy.bind(level));
    destroy();
    expect(destroy).toHaveReturnedWith(undefined);
  });
});