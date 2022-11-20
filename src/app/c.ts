import { A } from "./a";

export class C extends A {
  public constructor(public readonly valueA: string, public readonly valueC: string) {
    super(valueA);
  }
}
