import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div
      class="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-300"
    >
      <div
        class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3"
      >
        <i [class]="icon() + ' text-2xl'"></i>
      </div>
      <h3 class="text-base font-semibold text-slate-800 mb-1">{{ title() }}</h3>
      @if (message()) {
        <p class="text-sm text-slate-500 max-w-sm mb-4">{{ message() }}</p>
      }
      <div class="mt-2">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly icon = input<string>('pi pi-inbox');
  readonly title = input<string>('No hay registros');
  readonly message = input<string>('');
}
