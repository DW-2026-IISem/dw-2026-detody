import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forbidden {
  private readonly router = inject(Router);

  goHome(): void {
    void this.router.navigate(['/dashboard']);
  }
}
