import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { map, Observable, Subject, takeUntil } from 'rxjs';

import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { AuthorResponse, AuthorSchema } from '@/app/api/schemas/authors-response';
import { PaginatedPostResponse, PaginatedPostResponseSchema } from '@/app/api/schemas/posts-response';
import { AuthorInfoComponent } from '@/app/author/components/author-info/author-info.component';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostsListComponent } from '@/app/post/components/posts-list/posts-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthorInfoComponent, SpeedDialModule, ButtonModule, RippleModule, PostsListComponent],
  selector: 'app-author',
  styleUrl: './author.component.scss',
  templateUrl: './author.component.html',
})
export class AuthorComponent implements OnDestroy, OnInit {
  private readonly authorService = inject(AuthorService);
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  public readonly navigationService = inject(NavigationService);

  public currentAuthor = signal<AuthorResponse | null>(null);
  public paginatedPostResponse = signal<null | PaginatedPostResponse>(null);

  private loadAuthorPosts(username: string, query?: PaginationQueryDto): Observable<null | PaginatedPostResponse> {
    return this.authorService.getAuthorPosts(username, query).pipe(
      map((response) => {
        const result = PaginatedPostResponseSchema.safeParse(response);
        this.paginatedPostResponse.set(result.data ?? null);
        return result.success ? result.data : null;
      }),
    );
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const username = this.currentAuthor()?.username;
    if (!username) {
      return;
    }

    const { page = 1, rows } = event;

    this.loadAuthorPosts(username, { limit: rows, page: page + 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    const { data } = this.route.snapshot;
    if ('author' in data) {
      const result = AuthorSchema.safeParse(data['author']);
      if (result.data) {
        this.currentAuthor.set(result.data);
        this.loadAuthorPosts(result.data.username).pipe(takeUntil(this.destroy$)).subscribe();
      }
    }
  }
}
