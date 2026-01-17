import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs';

import { hasKeyInProfileResponse, ProfileResponse } from '@/app/api/schemas/profiles-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { handleHttpError } from '@/app/api/utils/handle-http-error';
import { FORM_CONTROL_NAME, PROFILE_FORM_FIELD_CONFIG } from '@/app/constants/form/profile-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ProfileForm } from '@/app/interfaces/profile-form';
import { FileUploaderComponent } from '@/app/shared/components/file-uploader/file-uploader.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
import { MessageService } from '@/app/shared/services/message/message.service';
import { usernameAvailability } from '@/app/shared/validators/username-availability';

const DEBOUNCE_TIME = 300;

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
export class ProfileFormComponent implements AfterViewInit, OnInit {
  private readonly avatarFile = signal<File | null>(null);
  private readonly birthdate = signal<null | string>(null);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly fileHandlingService = inject(FileHandlingService);
  private readonly message = inject(MessageService);
  private readonly profilesService = inject(ProfilesService);
  private readonly updatedProfile = signal<null | ProfileResponse>(null);
  private birthdatePicker = viewChild.required<DatePicker>('birthdatePicker');
  public readonly maxAllowedDate = new Date();
  public readonly navigationService = inject(NavigationService);
  public readonly PROFILE_FORM_FIELD_CONFIG = PROFILE_FORM_FIELD_CONFIG;
  public avatarUrl = signal<null | string>(null);

  public backToProfilePageEvent = output();
  public form!: FormGroup<ProfileForm>;
  public formSubmitEvent = output<ProfileResponse>();

  public hasChanges = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);
  public profile = input<null | ProfileResponse>(null);
  public updateProfileForPreviewEvent = output<null | ProfileResponse>();

  private createFormData(): FormData {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value && hasKeyInProfileResponse(key) && this.isValueChanged(key, value)) {
        formData.append(key, value.trim());

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
    this.birthdatePicker().setDisabledState(true);
  }

  private enableForm(): void {
    this.isProcessing.set(false);
    this.form.enable();
    this.birthdatePicker().setDisabledState(false);
  }

  private focusFirstInvalidField(): void {
    const invalidControl = Object.keys(this.form.controls).find((controlName) => this.form.get(controlName)?.invalid);
    if (invalidControl) {
      const element = document.querySelector(`[formControlName="${invalidControl}"]`);
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.focus();
      }
    }
  }

  private handleFormSubmit(formData: FormData): void {
    const action$ = this.profile()
      ? this.profilesService.updateProfile(formData)
      : this.profilesService.createProfile(formData);

    action$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((newOrUpdatedProfile) => {
          this.formSubmitEvent.emit(newOrUpdatedProfile);
        }),
        handleHttpError(this.message),
        finalize(() => {
          this.enableForm();
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
        [usernameAvailability(this.profilesService, this.profile()?.username ?? null)],
      ],
    });
  }

  private isValueChanged(key: string, value: Date | string): boolean {
    if (hasKeyInProfileResponse(key)) {
      const profile = this.profile();
      if (!profile) {
        return true;
      }

      if (value instanceof Date) {
        return new Date(value).toISOString() !== new Date(String(profile[key])).toISOString();
      }

      return profile[key] !== value.trim();
    }
    return false;
  }

  private updateProfileForPreview(profile: null | ProfileResponse): void {
    const { bio, firstname, lastname, username } = this.form.getRawValue();

    this.updatedProfile.set({
      avatarUrl: this.avatarUrl() ?? profile?.avatarUrl ?? null,
      bio,
      birthdate: this.birthdate() ?? profile?.birthdate ?? null,
      createdAt: profile?.createdAt ?? '',
      firstname,
      id: profile?.id ?? 0,
      lastname,
      updatedAt: profile?.updatedAt ?? '',
      userId: profile?.userId ?? 0,
      username,
    });

    this.updateProfileForPreviewEvent.emit(this.updatedProfile());
  }

  public ngAfterViewInit(): void {
    const profile = this.profile();
    if (profile?.birthdate) {
      this.birthdatePicker().writeValue(new Date(profile.birthdate));
    }
  }

  public ngOnInit(): void {
    const profile = this.profile();
    this.initForm(profile);

    if (profile) {
      this.avatarUrl.set(profile.avatarUrl);
      this.updatedProfile.set(profile);
    }

    this.form.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateProfileForPreview(profile);
      });
  }

  public onAvatarSelected(files: File[]): void {
    this.avatarFile.set(files[0]);
    this.hasChanges.set(true);
    const profile = this.profile();
    if (files[0]) {
      this.avatarUrl.set(this.fileHandlingService.createObjectURL(files[0]));
      this.updateProfileForPreview(profile);
    }
  }

  public onBirthdateSelected(event: Date): void {
    const profile = this.profile();
    if (profile) {
      const newDate = new Date(event).getTime();
      const profileBirthdate = new Date(profile.birthdate ?? '').getTime();
      if (newDate !== profileBirthdate) {
        this.hasChanges.set(true);
      }
    }
    this.birthdate.set(new Date(event).toISOString());
    this.updateProfileForPreview(profile);
  }

  public submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    this.disableForm();

    const formData = this.createFormData();
    if (this.profile() && !this.hasChanges()) {
      this.backToProfilePageEvent.emit();
      return;
    }

    this.handleFormSubmit(formData);
  }
}
