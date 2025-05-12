import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { AuthorFormComponent } from '@/app/author/components/author-form/author-form.component';
import { AuthorPreviewComponent } from '@/app/author/components/author-preview/author-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthorPreviewComponent, AuthorFormComponent],
  selector: 'app-author-form-wrapper',
  styleUrl: './author-form-wrapper.component.scss',
  templateUrl: './author-form-wrapper.component.html',
})
export class AuthorFormWrapperComponent {
  @Output() public backToAuthorPage = new EventEmitter<void>();
  @Output() public formSubmit = new EventEmitter<AuthorResponse>();
  @Output() public updateAuthorForPreview = new EventEmitter<AuthorResponse | null>();

  public authorForPreview = input.required<AuthorResponse | null>();
  public currentAuthor = input.required<AuthorResponse | null>();
}
