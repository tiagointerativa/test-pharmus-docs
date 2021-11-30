import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd/ng-zorro-antd.module';
import { ImportImagesModule } from 'src/app/shared/import-images/import-images.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    ImportImagesModule,
    NgZorroAntdModule,
    FormsModule
  ]
})
export class IndexModule { }
