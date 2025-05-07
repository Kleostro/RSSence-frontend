import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, finalize, Observable, take, throwError } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { ImagesService } from '@/app/api/services/images/images.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private readonly imagesService = inject(ImagesService);
  private readonly loaderService = inject(LoaderService);
  private readonly message = inject(MessageService);

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  public deleteImage(url: string): Observable<unknown> {
    this.loaderService.turnOn();
    return this.imagesService.deleteOne(url).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    this.loaderService.turnOn();
    return this.imagesService.createOne(formData).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }
}
