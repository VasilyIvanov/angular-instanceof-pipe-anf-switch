import {
  Directive,
  Host,
  Input,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import type { DoCheck } from '@angular/core';

// https://github.com/angular/angular/blob/main/packages/common/src/directives/ng_switch.ts#L110
// https://github.com/angular/angular/blob/main/packages/common/src/directives/ng_if.ts

type AbstractType<T> = abstract new (...args: any[]) => T;

class Context<T = unknown> {
  public $implicit: T = null!;
  public instanceofSwitchCase: T = null!;
}

const throwError = (directiveName: string): void => {
  throw new Error(
    `An element with the "${directiveName}" attribute (matching the "${directiveName}" directive) must be located inside an element with the "instanceofSwitch" attribute (matching "InstanceofSwitchDirective" directive)`
  );
};

class SwitchView<T = unknown> {
  private _created = false;
  private _context = new Context<T>();

  public constructor(
    private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<Context<T>>
  ) {}

  public enforceState(result: T | undefined): void {
    if (result && !this._created) {
      this.create(result);
    } else if (!result && this._created) {
      this.destroy();
    } else if (result) {
      this._context.$implicit = this._context.instanceofSwitchCase = result;
    }
  }

  private create(result: T): void {
    this._created = true;
    this._context.$implicit = this._context.instanceofSwitchCase = result;
    this._viewContainerRef.createEmbeddedView(this._templateRef, this._context);
  }

  private destroy(): void {
    this._created = false;
    this._viewContainerRef.clear();
  }
}

@Directive({
  selector: '[instanceofSwitch]',
})
export class InstanceofSwitchDirective {
  private _defaultViews!: SwitchView[];
  private _defaultUsed = false;
  private _caseCount = 0;
  private _lastCaseCheckIndex = 0;
  private _lastCasesMatched = false;
  private _instanceofSwitch: any;

  @Input()
  public set instanceofSwitch(newValue: any) {
    this._instanceofSwitch = newValue;
    if (this._caseCount === 0) {
      this._updateDefaultCases(true);
    }
  }

  /** @internal */
  public _addCase(): number {
    return this._caseCount++;
  }

  /** @internal */
  public _addDefault(view: SwitchView): void {
    if (!this._defaultViews) {
      this._defaultViews = [];
    }
    this._defaultViews.push(view);
  }

  /** @internal */
  public _matchCase<T>(type: AbstractType<T>): T | undefined {
    const matched = this._instanceofSwitch instanceof type ? this._instanceofSwitch : undefined;
    this._lastCasesMatched = this._lastCasesMatched || !!matched;
    this._lastCaseCheckIndex++;
    if (this._lastCaseCheckIndex === this._caseCount) {
      this._updateDefaultCases(!this._lastCasesMatched);
      this._lastCaseCheckIndex = 0;
      this._lastCasesMatched = false;
    }
    return matched;
  }

  private _updateDefaultCases(useDefault: boolean): void {
    if (this._defaultViews && useDefault !== this._defaultUsed) {
      this._defaultUsed = useDefault;
      for (let i = 0; i < this._defaultViews.length; i++) {
        const defaultView = this._defaultViews[i];
        defaultView.enforceState(useDefault);
      }
    }
  }
}

@Directive({
  selector: '[instanceofSwitchCase]',
})
export class InstanceofSwitchCaseDirective<T> implements DoCheck {
  @Input() public instanceofSwitchCase!: AbstractType<T>;

  private _view: SwitchView<T>;

  public constructor(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<Context<T>>,
    @Optional() @Host() private instanceofSwitch: InstanceofSwitchDirective
  ) {
    if (!instanceofSwitch) {
      throwError('instanceofSwitchCase');
    }
    instanceofSwitch._addCase();
    this._view = new SwitchView<T>(viewContainer, templateRef);
  }

  /**
   * Asserts the correct type of the context for the template that `InstanceofSwitchCaseDirective` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `InstanceofSwitchCaseDirective` structural directive renders its template with a specific context type.
   * Magic happens here!
   */
  public static ngTemplateContextGuard<T>(
    dir: InstanceofSwitchCaseDirective<T>,
    ctx: any
  ): ctx is Context<Exclude<T, false | 0 | '' | null | undefined>> {
    return true;
  }

  public ngDoCheck() {
    this._view.enforceState(
      this.instanceofSwitch._matchCase(this.instanceofSwitchCase)
    );
  }
}

@Directive({
  selector: '[instanceofSwitchDefault]',
})
export class InstanceSwitchDefaultDirective {
  public constructor(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<Context>,
    @Optional() @Host() instanceofSwitch: InstanceofSwitchDirective
  ) {
    if (!instanceofSwitch) {
      throwError('instanceofSwitchDefault');
    }
    instanceofSwitch._addDefault(new SwitchView(viewContainer, templateRef));
  }
}
