import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  private titleService: Title = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Tentang Kami | Lensa Tenggara');
  }
}