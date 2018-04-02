import Loop from "../src/loop";

describe("loop test", () => {
  it("Loop is instantiable", () => {
    expect(new Loop(1)).toBeInstanceOf(Loop)
  })

  it("Loop.T is t", () => {
    expect(new Loop(1).T).toBe(1)
  })
})
