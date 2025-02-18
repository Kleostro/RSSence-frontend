import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
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

import { hasKeyInProfilesResponse, ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { FORM_CONTROL_NAME, PROFILE_FORM_FIELD_BOUNDARIES } from '@/app/profile/constants/profile-form';
import { ProfileForm } from '@/app/profile/interfaces/profile-form';
import { ProfileService } from '@/app/profile/services/profile/profile.service';
import { usernameAvailability } from '@/app/profile/validators/username-availability';
import { InputDragAndDropDirective } from '@/app/shared/directives/input-drag-and-drop/input-drag-and-drop.directive';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';

@Component({
  selector: 'app-profile-form',
  imports: [
    ReactiveFormsModule,
    InputIcon,
    IconField,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
    InputDragAndDropDirective,
    DatePicker,
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent implements OnInit, AfterViewInit {
  @Input() public profile: ProfilesResponse | null = null;
  @Output() public backToProfilePageEvent = new EventEmitter<void>();
  @Output() public formSubmitEvent = new EventEmitter<FormData>();
  @Output() public updateProfileForPreviewEvent = new EventEmitter<ProfilesResponse | null>();

  private readonly profileService = inject(ProfileService);
  private readonly fileHandlingService = inject(FileHandlingService);
  private readonly fb = inject(FormBuilder);

  public readonly FIELD_BOUNDARIES = PROFILE_FORM_FIELD_BOUNDARIES;
  public readonly maxAllowedDate = new Date();

  public form!: FormGroup<ProfileForm>;

  private avatarFile = signal<File | null>(null);
  private avatarUrl = signal<string | null>(this.profile?.avatarUrl ?? null);
  private birthdate = signal<string | null>(this.profile?.birthdate ?? null);
  private updatedProfile = signal<ProfilesResponse | null>(null);

  public isUsernameAvailable = signal<boolean | null>(null);

  public isProcessing = signal<boolean>(false);
  public hasChanges = signal<boolean>(false);

  @ViewChild('birthdatePicker') private birthdatePicker!: DatePicker;

  public ngOnInit(): void {
    this.initForm(this.profile);

    if (this.profile) {
      this.updatedProfile.set(this.profile);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateProfileForPreview();
    });
  }

  public ngAfterViewInit(): void {
    if (this.profile?.birthdate) {
      this.birthdatePicker.writeValue(new Date(this.profile.birthdate));
    }
  }

  private initForm(initialValues?: ProfilesResponse | null): void {
    this.form = this.fb.nonNullable.group({
      firstname: [
        initialValues?.firstname ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.FIELD_BOUNDARIES.FIRSTNAME_MIN_LENGTH),
          Validators.maxLength(this.FIELD_BOUNDARIES.FIRSTNAME_MAX_LENGTH),
        ],
      ],
      lastname: [
        initialValues?.lastname ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.FIELD_BOUNDARIES.LASTNAME_MIN_LENGTH),
          Validators.maxLength(this.FIELD_BOUNDARIES.LASTNAME_MAX_LENGTH),
        ],
      ],
      username: [
        initialValues?.username ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.FIELD_BOUNDARIES.USERNAME_MIN_LENGTH),
          Validators.maxLength(this.FIELD_BOUNDARIES.USERNAME_MAX_LENGTH),
        ],
        [usernameAvailability(this.profileService, this.profile?.username ?? null)],
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

  private createFormData(): FormData {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value && hasKeyInProfilesResponse(key) && this.isValueChanged(key, value)) {
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
      formData.append(FORM_CONTROL_NAME.BIRTHDATE, new Date(birthdate).toUTCString());
    }

    return formData;
  }

  private isValueChanged(key: string, value: string | Date): boolean {
    if (hasKeyInProfilesResponse(key)) {
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

  public onAvatarSelected(event: Event | File[]): void {
    const file = Array.isArray(event) ? event[0] : this.fileHandlingService.getFileFromEvent(event);

    if (!file || !this.fileHandlingService.isValidFileSize(file)) {
      return;
    }

    this.avatarFile.set(file);
    this.hasChanges.set(true);
    this.avatarUrl.set(this.fileHandlingService.createObjectURL(file));
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

  private updateProfileForPreview(): void {
    const { firstname, lastname, username, bio } = this.form.getRawValue();
    this.updatedProfile.set({
      userId: this.profile?.userId ?? 0,
      firstname,
      lastname,
      username,
      bio,
      avatarUrl: this.avatarUrl() ?? this.profile?.avatarUrl ?? null,
      birthdate: this.birthdate() ?? this.profile?.birthdate ?? '',
    });
    this.updateProfileForPreviewEvent.emit(this.updatedProfile());
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    this.isProcessing.set(true);
    this.form.disable();
    this.birthdatePicker.setDisabledState(true);

    const formData = this.createFormData();

    if (this.profile && !this.hasChanges()) {
      this.backToProfilePageEvent.emit();
      return;
    }

    this.formSubmitEvent.emit(formData);
  }
}
