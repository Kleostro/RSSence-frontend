import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ImagesService } from '@/app/api/services/images/images.service';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private readonly imagesService = inject(ImagesService);

  public deleteImage(url: string): Observable<unknown> {
    return this.imagesService.deleteOne(url);
  }

  public uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.imagesService.createOne(formData);
  }
}
