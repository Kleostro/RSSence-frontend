import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { ImagesResponse } from '@/app/api/schemas/images-response';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly http = inject(HttpClient);

  public createOne(formData: FormData): Observable<ImagesResponse> {
    return this.http.post<ImagesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.IMAGES}`, formData);
  }

  public deleteOne(imgUrl: string): Observable<ImagesResponse> {
    return this.http.delete<ImagesResponse>(imgUrl);
  }

  public getOne(filename: string): Observable<ImagesResponse> {
    return this.http.get<ImagesResponse>(`${ENVIRONMENT.API_URL}${ENDPOINTS.IMAGES}/${filename}`);
  }
}
