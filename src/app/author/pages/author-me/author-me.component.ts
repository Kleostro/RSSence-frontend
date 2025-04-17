import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { finalize } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { AuthorFormComponent } from '@/app/author/components/author-form/author-form.component';
import { AuthorPreviewComponent } from '@/app/author/components/author-preview/author-preview.component';
import { AuthorService } from '@/app/author/services/author/author.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { FORM_STATE, FormState } from '@/app/profile/constants/profile-form';

@Component({
  selector: 'app-author-me',
  imports: [AuthorPreviewComponent, AuthorFormComponent, SpeedDialModule],
  templateUrl: './author-me.component.html',
  styleUrl: './author-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorMeComponent implements OnInit {
  public readonly authorService = inject(AuthorService);
  public readonly loaderService = inject(LoaderService);
  public readonly navigationService = inject(NavigationService);

  public authorForPreview = signal<AuthorsResponse | null>(null);
  public isProcessing = signal(false);
  public formState = signal<FormState>(FORM_STATE.CREATE);

  public readonly FORM_STATE = FORM_STATE;
  public navigationItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: (): void => {
        this.navigationService.navigateToProfile();
      },
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (): void => {
        this.formState.set(FORM_STATE.UPDATE);
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (): void => {
        this.deleteAuthor();
      },
    },
  ];

  public ngOnInit(): void {
    this.loaderService.turnOn();
    this.authorService
      .getAuthorMe()
      .pipe(
        finalize(() => {
          this.authorForPreview.set(this.authorService.currentAuthor());
          this.loaderService.turnOff();
        }),
      )
      .subscribe();
  }

  public deleteAuthor(): void {
    this.loaderService.turnOn();
    this.isProcessing.set(true);
    this.authorService
      .deleteAuthorMe()
      .pipe(
        finalize(() => {
          this.loaderService.turnOff();
          this.isProcessing.set(false);
          this.authorForPreview.set(this.authorService.currentAuthor());
        }),
      )
      .subscribe();
  }

  public handleFormSubmit(formData: FormData): void {
    this.loaderService.turnOn();
    if (this.formState() === FORM_STATE.UPDATE) {
      this.authorService
        .updateAuthorMe(formData)
        .pipe(
          finalize(() => {
            this.loaderService.turnOff();
            this.formState.set(FORM_STATE.CREATE);
            this.authorForPreview.set(this.authorService.currentAuthor());
          }),
        )
        .subscribe();
    } else {
      this.authorService
        .createAuthorMe(formData)
        .pipe(
          finalize(() => {
            this.loaderService.turnOff();
            this.authorForPreview.set(this.authorService.currentAuthor());
          }),
        )
        .subscribe();
    }
  }
}
