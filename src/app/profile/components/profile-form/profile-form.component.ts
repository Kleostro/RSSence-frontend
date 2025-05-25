import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { catchError, EMPTY, Subject, takeUntil, tap } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { hasKeyInProfileResponse, ProfileResponse } from '@/app/api/schemas/profiles-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { FORM_CONTROL_NAME, PROFILE_FORM_FIELD_CONFIG } from '@/app/profile/constants/profile-form';
import { ProfileForm } from '@/app/profile/interfaces/profile-form';
import { ProfileService } from '@/app/profile/services/profile/profile.service';
import { FileUploaderComponent } from '@/app/shared/components/file-uploader/file-uploader.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
import { MessageService } from '@/app/shared/services/message/message.service';
import { usernameAvailability } from '@/app/shared/validators/username-availability';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormFieldErrorComponent,
    FileUploaderComponent,
    InputIcon,
    IconField,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
    DatePicker,
  ],
  selector: 'app-profile-form',
  styleUrl: './profile-form.component.scss',
  templateUrl: './profile-form.component.html',
})
export class ProfileFormComponent implements AfterViewInit, OnDestroy, OnInit {
  private readonly avatarFile = signal<File | null>(null);
  private readonly birthdate = signal<null | string>(null);
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly fileHandlingService = inject(FileHandlingService);
  private readonly message = inject(MessageService);
  private readonly profileService = inject(ProfileService);
  private readonly updatedProfile = signal<null | ProfileResponse>(null);

  @Output() public backToProfilePageEvent = new EventEmitter<void>();
  @ViewChild('birthdatePicker') private birthdatePicker!: DatePicker;
  @Output() public formSubmitEvent = new EventEmitter<ProfileResponse>();
  @Input() public profile: null | ProfileResponse = null;
  @Output() public updateProfileForPreviewEvent = new EventEmitter<null | ProfileResponse>();

  public readonly maxAllowedDate = new Date();
  public readonly navigationService = inject(NavigationService);
  public readonly PROFILE_FORM_FIELD_CONFIG = PROFILE_FORM_FIELD_CONFIG;

  public avatarUrl = signal<null | string>(null);
  public form!: FormGroup<ProfileForm>;
  public hasChanges = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);

  private createFormData(): FormData {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value && hasKeyInProfileResponse(key) && this.isValueChanged(key, value)) {
        formData.append(key, value);
        this.hasChanges.set(true);
      }
    });

    const avatar = this.avatarFile();
    if (avatar) {
      formData.append(FORM_CONTROL_NAME.AVATAR, avatar);
    }

    const birthdate = this.birthdate();
    if (birthdate) {
      formData.append(FORM_CONTROL_NAME.BIRTHDATE, new Date(birthdate).toISOString());
    }

    return formData;
  }

  private disableForm(): void {
    this.isProcessing.set(true);
    this.form.disable();
    this.birthdatePicker.setDisabledState(true);
  }

  private enableForm(): void {
    this.isProcessing.set(false);
    this.form.enable();
    this.birthdatePicker.setDisabledState(false);
  }

  private focusFirstInvalidField(): void {
    const invalidControl = Object.keys(this.form.controls).find((controlName) => this.form.get(controlName)?.invalid);
    if (invalidControl) {
      const element = document.querySelector(`[formControlName="${invalidControl}"]`);
      if (element instanceof HTMLInputElement) {
        element.focus();
      }
    }
  }

  private handleFormSubmit(formData: FormData): void {
    const action$ = this.profile
      ? this.profileService.updateProfile(formData)
      : this.profileService.createProfile(formData);

    action$
      .pipe(
        takeUntil(this.destroy$),
        tap((newOrUpdatedProfile) => {
          this.formSubmitEvent.emit(newOrUpdatedProfile);
        }),
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          this.enableForm();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private initForm(initialValues?: null | ProfileResponse): void {
    this.form = this.fb.nonNullable.group({
      bio: [initialValues?.bio ?? '', [Validators.maxLength(this.PROFILE_FORM_FIELD_CONFIG.bio.max)]],
      firstname: [
        initialValues?.firstname ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.PROFILE_FORM_FIELD_CONFIG.firstname.min),
          Validators.maxLength(this.PROFILE_FORM_FIELD_CONFIG.firstname.max),
        ],
      ],
      lastname: [
        initialValues?.lastname ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.PROFILE_FORM_FIELD_CONFIG.lastname.min),
          Validators.maxLength(this.PROFILE_FORM_FIELD_CONFIG.lastname.max),
        ],
      ],
      username: [
        initialValues?.username ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.PROFILE_FORM_FIELD_CONFIG.username.min),
          Validators.maxLength(this.PROFILE_FORM_FIELD_CONFIG.username.max),
        ],
        [usernameAvailability(this.profileService, this.profile?.username ?? null)],
      ],
    });
  }

  private isValueChanged(key: string, value: Date | string): boolean {
    if (hasKeyInProfileResponse(key)) {
      const { profile } = this;
      if (!profile) {
        return true;
      }

      if (value instanceof Date) {
        return new Date(value).toISOString() !== new Date(String(profile[key])).toISOString();
      }

      return profile[key] !== value;
    }
    return false;
  }

  private updateProfileForPreview(): void {
    const { bio, firstname, lastname, username } = this.form.getRawValue();
    this.updatedProfile.set({
      authorUsername: this.profile?.authorUsername ?? null,
      avatarUrl: this.avatarUrl() ?? this.profile?.avatarUrl ?? null,
      bio,
      birthdate: this.birthdate() ?? this.profile?.birthdate ?? null,
      firstname,
      id: this.profile?.id ?? 0,
      lastname,
      username,
    });
    this.updateProfileForPreviewEvent.emit(this.updatedProfile());
  }

  public ngAfterViewInit(): void {
    if (this.profile?.birthdate) {
      this.birthdatePicker.writeValue(new Date(this.profile.birthdate));
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.initForm(this.profile);

    if (this.profile) {
      this.avatarUrl.set(this.profile.avatarUrl);
      this.updatedProfile.set(this.profile);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateProfileForPreview();
    });
  }

  public onAvatarSelected(files: File[]): void {
    this.avatarFile.set(files[0]);
    this.hasChanges.set(true);

    if (!files[0]) {
      this.avatarUrl.set(null);
      this.updateProfileForPreview();
      return;
    }

    this.avatarUrl.set(this.fileHandlingService.createObjectURL(files[0]));
    this.updateProfileForPreview();
  }

  public onBirthdateSelected(event: Date): void {
    if (this.profile) {
      const newDate = new Date(event).getTime();
      const profileBirthdate = new Date(this.profile.birthdate ?? '').getTime();
      if (newDate !== profileBirthdate) {
        this.hasChanges.set(true);
      }
    }
    this.birthdate.set(new Date(event).toISOString());
    this.updateProfileForPreview();
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    this.disableForm();

    const formData = this.createFormData();

    if (this.profile && !this.hasChanges()) {
      this.backToProfilePageEvent.emit();
      return;
    }

    this.handleFormSubmit(formData);
  }
}
