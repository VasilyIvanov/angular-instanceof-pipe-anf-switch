import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

type AbstractType<T> = abstract new (...args: any[]) => T;

@Pipe({
  name: 'instanceof',
  pure: true,
})
export class InstanceofPipe implements PipeTransform {
  public transform<V, R>(value: V, type: AbstractType<R>): R | undefined {
    return value instanceof type ? value : undefined;
  }
}
