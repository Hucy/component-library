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

interface DataIn{
  time:number
}

describe('loop test', () => {
  it('Loop is instantiable', () => {
    expect(new Loop((data : DataIn) => data.time === 2 , apiFnGen())).toBeInstanceOf(Loop);
  });

  it('Loop.start return Promise ', async () => {
    await expect(new Loop((data : DataIn) => data.time === 2 , apiFnGen()).start()).resolves.toEqual({ time: 2 });
  });

  it('Loop.start return Promise with interval ', async () => {
    await expect(new Loop((data : DataIn) => data.time === 2, apiFnGen(), 100).start()).resolves.toEqual({ time: 2 });
  });

  it('Loop.start return Promise with delay ', async () => {
    await expect(new Loop((data : DataIn) => data.time === 2 , apiFnGen(), undefined, 3000).start()).resolves.toEqual({ time: 2 });
  });
});
