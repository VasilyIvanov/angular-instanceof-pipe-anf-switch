import { Component, VERSION } from '@angular/core';
import { A } from './a';
import { B } from './b';
import { C } from './c';
import { D } from './d';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;

  public readonly A = A;
  public readonly B = B;
  public readonly C = C;

  public readonly list: (A | D)[] = [
    new B('testA1', 'testB1'),
    new C('testA2', 'testC1'),
    new B('testA3', 'testB2'),
    new C('testA4', 'testC2'),
    new B('testA5', 'testB3'),
    new D('testD1')
  ];
}
