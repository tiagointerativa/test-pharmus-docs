import { Component, EventEmitter, OnInit, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { formatDate } from "@angular/common";

function getBase64(file: any): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function b64toArrayBuffer(dataURI: any) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ia;
}

@Component({
  selector: 'app-import-images',
  templateUrl: './import-images.component.html',
  styleUrls: ['./import-images.component.css']
})
export class ImportImagesComponent implements OnInit {
  current = 0;
  data: any = [];
  loadingButton = false;
  @Output() done = new EventEmitter();

  //Desktop
  receitaImage: NzUploadFile[] = [];
  documentoImage: NzUploadFile[] = [];
  ComprovanteImage: NzUploadFile[] = [];

  //Mobile
  public webcamImage: any = null;
  private trigger: Subject<void> = new Subject<void>();
  errorAccessCamera = false;
  deviceId: any = null;

  beforeUploadReceita = (file: NzUploadFile): boolean => {
    this.receitaImage = this.receitaImage.concat(file);
    this.receitaImage = this.receitaImage.slice(-1);
    var hi = getBase64(file);
    hi.then((result) => {
      b64toArrayBuffer(result);
      let base64 = (<string>result);
      this.data['receita'] = base64.split(',')[1];
      this.loadingButton = true;
      setTimeout(() => {
        this.notification.success('Receita Importada', 'A receita foi importada com sucesso!');
        this.nextStep();
        this.loadingButton = false;
      }, 1000);

    });
    return false;
  };

  beforeUploadDocumento = (file: NzUploadFile): boolean => {
    this.documentoImage = this.documentoImage.concat(file);
    this.documentoImage = this.documentoImage.slice(-1);
    var hi = getBase64(file);
    hi.then((result) => {
      b64toArrayBuffer(result);
      let base64 = (<string>result);
      this.data['documento'] = base64.split(',')[1];
      this.loadingButton = true;
      setTimeout(() => {
        this.notification.success('Documento Importado', 'O documento foi importada com sucesso!');
        this.nextStep();
        this.loadingButton = false;
      }, 1000);
    });
    return false;
  };

  beforeUploadComprovante = (file: NzUploadFile): boolean => {
    this.ComprovanteImage = this.ComprovanteImage.concat(file);
    this.ComprovanteImage = this.ComprovanteImage.slice(-1);
    var hi = getBase64(file);
    hi.then((result) => {
      b64toArrayBuffer(result);
      let base64 = (<string>result);
      this.data['comprovante'] = base64.split(',')[1];
      this.loadingButton = true;
      setTimeout(() => {
        this.notification.success('Comprovante Importando', 'O comprovante foi importada com sucesso!');
        this.nextStep();
        this.loadingButton = false;
      }, 1000);
    });
    return false;
  };

  constructor(
    private notification: NzNotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
      this.errorAccessCamera = true;
    }
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }


  reloadCamera() {
    this.errorAccessCamera = false;
    this.ngOnInit();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  nextStep() {
    if (this.current === 2 && (this.data['documento'] === undefined || this.data['receita'] === undefined || this.data['comprovante'] === undefined)) {
      this.notification.warning('OPS! Importações Pendente!', 'Ainda existe importação a ser realizada.')
    } else if (this.current < 3) {
      this.current++;
    }
  }

  deleteImage() {
    setTimeout(() => {
      this.webcamImage = null;
    }, 1000);
    
  }

  saveImage() {
    if(this.current === 0){
      this.data['receita'] = this.webcamImage?.imageAsDataUrl;
    }else if(this.current === 1){
      this.data['documento'] = this.webcamImage?.imageAsDataUrl;
    }else if(this.current === 2){
      this.data['comprovante'] = this.webcamImage?.imageAsDataUrl;
    }
    this.nextStep();
    this.webcamImage = null;
    
  }

  backStep() {
    if (this.current > 0) {
      this.current--;
    }
  }

  onIndexChange(current: number): void {
    if (this.current === 3) {
      this.notification.warning('Digitalização já concluída', 'Não é possível retornar aos passos anteriores.')
    } else if (current !== 3) {
      this.current = current;
    }
  }

  concluded() {
    this.done.emit(true);
  }

}