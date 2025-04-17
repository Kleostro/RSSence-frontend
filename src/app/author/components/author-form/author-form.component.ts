import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';

import { AuthorsResponse, hasKeyInAuthorsResponse } from '@/app/api/schemas/authors-response';
import { AUTHOR_FORM_FIELD_BOUNDARIES, FORM_CONTROL_NAME } from '@/app/author/constants/author-form';
import { AuthorForm } from '@/app/author/interfaces/author-form';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { InputDragAndDropDirective } from '@/app/shared/directives/input-drag-and-drop/input-drag-and-drop.directive';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
import { usernameAvailability } from '@/app/shared/validators/username-availability';

@Component({
  selector: 'app-author-form',
  imports: [
    ReactiveFormsModule,
    InputIcon,
    IconField,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
    InputDragAndDropDirective,
  ],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorFormComponent implements OnInit {
  @Input() public author: AuthorsResponse | null = null;
  @Output() public updateAuthorForPreviewEvent = new EventEmitter<AuthorsResponse | null>();
  @Output() public backToAuthorPageEvent = new EventEmitter<void>();
  @Output() public formSubmitEvent = new EventEmitter<FormData>();

  public readonly navigationService = inject(NavigationService);
  private readonly authorService = inject(AuthorService);
  private readonly fileHandlingService = inject(FileHandlingService);
  private readonly fb = inject(FormBuilder);

  public form!: FormGroup<AuthorForm>;
  public readonly FIELD_BOUNDARIES = AUTHOR_FORM_FIELD_BOUNDARIES;

  public isUsernameAvailable = signal<boolean | null>(null);
  public isProcessing = signal<boolean>(false);
  public hasChanges = signal<boolean>(false);

  public avatarUrl = signal<string | null>(null);
  private avatarFile = signal<File | null>(null);
  private updatedAuthor = signal<AuthorsResponse | null>(null);

  public ngOnInit(): void {
    this.initForm(this.author);

    if (this.author) {
      this.avatarUrl.set(this.author.avatarUrl);
      this.updatedAuthor.set(this.author);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateAuthorForPreview();
    });
  }

  public initForm(initialValues?: AuthorsResponse | null): void {
    this.form = this.fb.nonNullable.group({
      username: [
        initialValues?.username ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.FIELD_BOUNDARIES.USERNAME_MIN_LENGTH),
          Validators.maxLength(this.FIELD_BOUNDARIES.USERNAME_MAX_LENGTH),
        ],
        [usernameAvailability(this.authorService, this.author?.username ?? null)],
      ],
      bio: [initialValues?.bio ?? '', [Validators.maxLength(this.FIELD_BOUNDARIES.BIO_MAX_LENGTH)]],
    });

    this.form.controls.username.statusChanges.subscribe(() => {
      const usernameControl = this.form.controls.username;
      if (usernameControl.errors === null && usernameControl.value) {
        this.isUsernameAvailable.set(true);
      } else if (usernameControl.errors?.['usernameAvailability']) {
        this.isUsernameAvailable.set(false);
      } else {
        this.isUsernameAvailable.set(null);
      }
    });
  }

  public onAvatarSelected(event: Event | File[]): void {
    const file = Array.isArray(event) ? event[0] : this.fileHandlingService.getFileFromEvent(event);

    if (!file || !this.fileHandlingService.isValidFileSize(file)) {
      return;
    }

    this.avatarFile.set(file);
    this.hasChanges.set(true);
    this.avatarUrl.set(this.fileHandlingService.createObjectURL(file));
    this.updateAuthorForPreview();
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isProcessing.set(true);
    this.form.disable();

    const formData = this.createFormData();

    if (this.author && !this.hasChanges()) {
      this.backToAuthorPageEvent.emit();
      return;
    }

    this.formSubmitEvent.emit(formData);
  }

  private createFormData(): FormData {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value && hasKeyInAuthorsResponse(key) && this.isValueChanged(key, value)) {
        formData.append(key, value);
        this.hasChanges.set(true);
      }
    });

    const avatar = this.avatarFile();
    if (avatar) {
      formData.append(FORM_CONTROL_NAME.AVATAR, avatar);
    }

    return formData;
  }

  private isValueChanged(key: string, value: string): boolean {
    if (hasKeyInAuthorsResponse(key)) {
      const { author } = this;
      if (!author) {
        return true;
      }

      return author[key] !== value;
    }
    return false;
  }

  private updateAuthorForPreview(): void {
    const { username, bio } = this.form.getRawValue();
    this.updatedAuthor.set({
      userId: this.author?.userId ?? 0,
      username,
      bio,
      avatarUrl: this.avatarUrl() ?? this.author?.avatarUrl ?? null,
    });
    this.updateAuthorForPreviewEvent.emit(this.updatedAuthor());
  }
}
