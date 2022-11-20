import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InstanceofPipe } from './pipes/instanceof.pipe';
import { InstanceofSwitchCaseDirective, InstanceofSwitchDirective, InstanceSwitchDefaultDirective } from './directives/instanceof-switch.directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, InstanceofPipe, InstanceofSwitchDirective, InstanceofSwitchCaseDirective, InstanceSwitchDefaultDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
