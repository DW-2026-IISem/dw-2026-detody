import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { SessionStore } from '../../core/services/session-store';

/**
 * Directiva estructural `*appHasPermission`:
 * Oculta o muestra elementos del DOM según los permisos efectivos de la sesión.
 *
 * Uso:
 * `<button *appHasPermission="'POST /api/clientes'">Nuevo</button>`
 * `<div *appHasPermission="['GET /api/ventas', 'GET /api/clientes']">...</div>`
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermission {
  readonly permission = input.required<string | string[]>({ alias: 'appHasPermission' });

  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly session = inject(SessionStore);
  private hasView = false;

  constructor() {
    effect(() => {
      // Registrar dependencia reactiva explícita de permissions
      this.session.permissions();

      const perm = this.permission();
      const isGranted = Array.isArray(perm)
        ? perm.some((p) => this.session.canPermission(p))
        : this.session.canPermission(perm);

      if (isGranted && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!isGranted && this.hasView) {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }
}
