import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { fromEvent, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowSizeService {
  private readonly resize$ = fromEvent(window, 'resize').pipe(
    map(() => ({ height: window.innerHeight, width: window.innerWidth })),
    startWith({ height: window.innerHeight, width: window.innerWidth }),
  );

  public readonly height = toSignal(this.resize$.pipe(map((s) => s.height)), { initialValue: window.innerHeight });
  public readonly width = toSignal(this.resize$.pipe(map((s) => s.width)), { initialValue: window.innerWidth });
}
