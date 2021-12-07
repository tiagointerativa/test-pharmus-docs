import { Component, EventEmitter, OnInit, Output, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { formatDate } from "@angular/common";
import { DeviceDetectorService } from 'ngx-device-detector';
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
  providers: [
    { provide: Window, useValue: window }  
  ],
  templateUrl: './import-images.component.html',
  styleUrls: ['./import-images.component.css']
})
export class ImportImagesComponent implements OnInit {
  current = 0;
  data: any = [];
  loadingButton = false;
  @Output() done = new EventEmitter();
  modeCamera = false;
  isMobile = false;
  //Desktop
  receitaImage: NzUploadFile[] = [];
  documentoImage: NzUploadFile[] = [];
  ComprovanteImage: NzUploadFile[] = [];

  //Mobile
  public webcamImage: any = null;
  private trigger: Subject<void> = new Subject<void>();
  errorAccessCamera = false;
  deviceId: any = null;

  //test
  deferredPrompt: any;
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
    private deviceService: DeviceDetectorService,
    @Inject(Window) private window: Window,
  ) {

this.window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  this.deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  this.notification.info('Instale na area de trabalho!', 'Hello');
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
   }

  ngOnInit(): void {
    if(this.deviceService.isMobile()){
      this.modeCamera = true;
      this.isMobile = true;
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.scrollTop();
    this.webcamImage = webcamImage;
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
      this.errorAccessCamera = true;
    }
  }

  public cameraWasSwitched(deviceId: string): void {
    this.scrollTop();
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
    this.deferredPrompt.prompt();
    if (this.current === 2 && (this.data['documento'] === undefined || this.data['receita'] === undefined || this.data['comprovante'] === undefined)) {
      if(this.data['receita'] === undefined){
        
        this.notification.warning('Receita não importada!', 'Você ainda não realizou a importação da receita.');
        this.current = 0;
      }else if(this.data['documento'] === undefined){
        this.notification.warning('Documento do Comprador não importado!', 'Você ainda não realizou a importação do documento do comprador.');
        this.current = 1;
      }else if(this.data['comprovante'] === undefined){
        this.notification.warning('Comprovante da Venda não importada!', 'Você ainda não realizou a importação do comprovante da venda.');
        this.current = 2;
      }
    } else if (this.current < 3) {
      this.current++;
    }
    this.scrollTop();
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

  toggleModeCamera(){
    this.modeCamera = !this.modeCamera;
  }

  scrollTop(){
      this.window.document.getElementById('top')?.scrollIntoView();    
  }
}
