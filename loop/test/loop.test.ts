import Loop from '../src/loop';
jest.setTimeout(100000);

const apiFnGen = () => {
  let time = 0;
  return () => {
    time++;
    return Promise.resolve({
      time: time,
    });
  };
}

describe('loop test', () => {
  it('Loop is instantiable', () => {
    expect(new Loop([['time', 2]], apiFnGen())).toBeInstanceOf(Loop);
  });

  it('Loop.start return Promise ', async () => {
    await expect(new Loop([['time', 2]], apiFnGen()).start()).resolves.toEqual({ time: 2 });
  });

  it('Loop.start return Promise with interval ', async () => {
    await expect(new Loop([['time', 2]], apiFnGen(), 100).start()).resolves.toEqual({ time: 2 });
  });
});
