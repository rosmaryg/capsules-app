import {NgModule} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule, MatListModule} from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatCardModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatStepperModule,
    MatDividerModule, MatIconModule, MatTooltipModule, MatChipsModule, MatAutocompleteModule, MatButtonToggleModule, MatListModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatCardModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatStepperModule,
    MatDividerModule, MatIconModule, MatTooltipModule, MatChipsModule, MatAutocompleteModule, MatButtonToggleModule, MatListModule
  ],
})
export class MaterialModule { }
