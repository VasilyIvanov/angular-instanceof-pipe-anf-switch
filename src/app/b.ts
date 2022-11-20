import { A } from "./a";

export class B extends A {
  public constructor(public readonly valueA: string, public readonly valueB: string) {
    super(valueA);
  }
}
