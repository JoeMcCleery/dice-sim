class Observable<T> {
  observers: ((params: T) => void)[];

  constructor() {
    this.observers = [];
  }

  subscribe(func: (params: T) => void) {
    this.observers.push(func);
  }

  unsubscribe(inputFunc: (params: T) => void) {
    this.observers.filter(func => func != inputFunc);
  }

  notify(params: T) {
    this.observers.forEach(func => func(params));
  }
}

export default Observable;
