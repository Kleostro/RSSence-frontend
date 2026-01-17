import { AfterViewInit, Directive, ElementRef, input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appStickyState]',
  standalone: true,
})
export class StickyStateDirective implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  public stuckClass = input<string>('stuck');

  constructor(private el: ElementRef<HTMLElement>) {}

  private findScrollContainer(el: HTMLElement | null): HTMLElement | null {
    if (!el) {
      return null;
    }

    const styles = window.getComputedStyle(el);
    const overflowY = styles.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll' || el === document.documentElement) {
      return el;
    }

    return this.findScrollContainer(el.parentElement);
  }

  public ngAfterViewInit(): void {
    const styles = window.getComputedStyle(this.el.nativeElement);
    if (styles.position !== 'sticky') {
      return;
    }

    const scrollContainer = this.findScrollContainer(this.el.nativeElement.parentElement);
    const topOffset = parseFloat(styles.top) || 0;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        const isStuck = !entry.isIntersecting;
        this.el.nativeElement.classList.toggle(this.stuckClass(), isStuck);
      },
      {
        root: scrollContainer,
        rootMargin: `-${topOffset + 1}px 0px 0px 0px`,
        threshold: [1],
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
