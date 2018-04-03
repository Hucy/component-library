export default  class Loop {
  stopArr: Array<Array<any>>;
  apiFc: Function;
  interval: number;
  private _timer: any;
  constructor(stopArr: Array<Array<any>>, apiFc: Function, interval: number = 3000) {
    this.stopArr = stopArr;
    this.apiFc = apiFc;
    this.interval = interval;
  }

  start() {
    return this._start_();
  }

  private async _start_() {
    const data = await this.apiFc();
    const shouldStop = this.stopArr.some(item => {
      return data[item[0]] === item[1];
    });
    if (shouldStop) {
      return Promise.resolve(data);
    }
    return new Promise(resolve => {
      this._timer = setTimeout(() => {
        resolve(this._start_());
      }, this.interval);
    });
  }

}

