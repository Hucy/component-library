export interface ConditionFc {
  (data: object): boolean;
}
export interface PromiseFc {
  (): Promise<any>;
}

export default class Loop {
  condition: ConditionFc;
  apiFc: PromiseFc;
  interval: number;
  delay: number;
  private _timer: any;

  constructor(
    condition: ConditionFc,
    apiFc: PromiseFc,
    interval: number = 3000,
    delay: number = 0
  ) {
    this.condition = condition;
    this.apiFc = apiFc;
    this.interval = interval;
    this.delay = delay;
  }

  start():Promise<any> {
    if (this.delay) {
      return new Promise(reslove => {
        setTimeout(() => reslove(this._start_()), this.delay);
      });
    }
    return this._start_();
  }

  private async _start_() {
    const data = await this.apiFc();
    if (this.condition(data)) {
      return Promise.resolve(data);
    }
    return new Promise(resolve => {
      this._timer = setTimeout(() => {
        resolve(this._start_());
      }, this.interval);
    });
  }
}
