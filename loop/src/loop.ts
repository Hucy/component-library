export interface ConditionFc {
  (data: object): boolean;
}
export interface PromiseFc {
  (): Promise<any>;
}

interface FnIn {
  (resolve: Function, reject: Function): void;
}

interface TimerPromiseGenIn {
  (fn: FnIn, timeout: number): [Promise<any>, any];
}

const TimerPromiseGen: TimerPromiseGenIn = (fn, timeout) => {
  let _timer;
  const p = new Promise((resolve, reject) => {
    _timer = setTimeout(() => {
      fn(resolve, reject);
    }, timeout);
  });
  return [p, _timer];
};

export default class Loop {
  condition: ConditionFc;
  apiFc: PromiseFc;
  interval: number;
  delay: number;
  timeout: number;
  private _timer: any;

  constructor(
    condition: ConditionFc,
    apiFc: PromiseFc,
    interval: number = 3000,
    delay: number = 0,
    timeout: number = 0
  ) {
    this.condition = condition;
    this.apiFc = apiFc;
    this.interval = interval;
    this.delay = delay;
    this.timeout = timeout;
  }

  start(): Promise<any> {
    if (this.timeout) {
      return Promise.race([
        this._start_(),
        TimerPromiseGen((resolve, reject) => {
          clearTimeout(this._timer);
          reject({ code: 201, msg: 'timeout' });
        }, this.timeout)[0],
      ]);
    }
    return this._start_();
  }

  private _start_() {
    if (this.delay) {
      return TimerPromiseGen(resolve => resolve(this._loop_()), this.delay)[0];
    }
    return this._loop_();
  }

  private async _loop_(): Promise<any> {
    const data = await this.apiFc();
    if (this.condition(data)) {
      return Promise.resolve(data);
    }
    let _loopP;
    [_loopP, this._timer] = TimerPromiseGen(resolve => resolve(this._loop_()), this.interval);
    return _loopP;
  }
}
