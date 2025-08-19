import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewType = 'map' | 'forecast';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input() activeView: ViewType = 'map';
  @Output() viewChange = new EventEmitter<ViewType>();

  switchView(view: ViewType): void {
    this.viewChange.emit(view);
  }
}
