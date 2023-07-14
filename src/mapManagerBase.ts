type InferArrayItem<T> = T extends (infer R)[] ? R : never;

export class mapManagerBase<T extends Object> {
  public map: Map<string, T[]> = new Map();
  public constructor() {
    this.map = new Map();
  }

  public makeSureItemWrapper(key: string) {
    if (!this.map.has(key)) {
      this.map.set(key, [] as T[]);
    }
  }

  public addMapItem(key: string, valueItem: T) {
    this.makeSureItemWrapper(key);

    this.map.set(key, [...(this.map.get(key) as T[]), valueItem] as T[]);
  }

  public removeMapItem(key: string, valueItem?: T) {
    if (valueItem) {
      this.map.set(
        key,
        this.map.get(key)!.filter((item) => item === valueItem),
      );
    } else {
      this.map.set(key, [] as T[]);
    }
  }
}
