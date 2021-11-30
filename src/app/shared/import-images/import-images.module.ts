import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportImagesComponent } from './import-images.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd/ng-zorro-antd.module';
import { WebcamModule } from 'ngx-webcam';



@NgModule({
  declarations: [
    ImportImagesComponent
  ],
  exports: [
    ImportImagesComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    WebcamModule
  ]
})
export class ImportImagesModule { }
