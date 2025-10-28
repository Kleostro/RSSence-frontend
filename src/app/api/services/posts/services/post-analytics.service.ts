import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { PART } from '@/app/api/constants/parts';
import { PostAnalyticsQuery } from '@/app/api/interfaces/post-analytics-query';
import { PostCommentDailyStatResponse } from '@/app/api/schemas/post/post-comment-daily-stat-response';
import { PostViewDailyStatResponse } from '@/app/api/schemas/post/post-view-daily-stat-response';
import { buildApiUrl } from '@/app/api/utils/build-api-url';

@Injectable({
  providedIn: 'root',
})
export class PostAnalyticsService {
  private readonly http = inject(HttpClient);

  public getPostCommentTrend(postId: number, query?: PostAnalyticsQuery): Observable<PostCommentDailyStatResponse[]> {
    const url = buildApiUrl(ENDPOINTS.COMMENTS, PART.POST, postId.toString(), PART.TREND);
    return this.http.get<PostCommentDailyStatResponse[]>(url, {
      params: { ...query },
    });
  }

  public getPostViewsTrend(postId: number, query?: PostAnalyticsQuery): Observable<PostViewDailyStatResponse[]> {
    const url = buildApiUrl(ENDPOINTS.POST_VIEWS, PART.POST, postId.toString(), PART.TREND);
    return this.http.get<PostViewDailyStatResponse[]>(url, {
      params: { ...query },
    });
  }
}
