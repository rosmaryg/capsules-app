import {NgModule} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatCardModule, MatInputModule, MatProgressBarModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatCardModule, MatInputModule, MatProgressBarModule
  ],
})
export class MaterialModule { }
