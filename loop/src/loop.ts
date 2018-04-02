export default class Loop {
  private _t : number

  constructor(time:number) {
    this._t = time
  }

  get T(){
    return this._t
  }
}
