import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { AuthorFormComponent } from '@/app/author/components/author-form/author-form.component';
import { AuthorPreviewComponent } from '@/app/author/components/author-preview/author-preview.component';

@Component({
  selector: 'app-author-form-wrapper',
  imports: [AuthorPreviewComponent, AuthorFormComponent],
  templateUrl: './author-form-wrapper.component.html',
  styleUrl: './author-form-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorFormWrapperComponent {
  public currentAuthor = input.required<AuthorsResponse | null>();
  public authorForPreview = input.required<AuthorsResponse | null>();

  @Output() public backToAuthorPage = new EventEmitter<void>();
  @Output() public formSubmit = new EventEmitter<AuthorsResponse>();
  @Output() public updateAuthorForPreview = new EventEmitter<AuthorsResponse | null>();
}
