import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canDeactivate?: () => Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges?: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  if (!component.hasUnsavedChanges && !component.canDeactivate) {
    return true;
  }

  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm(
      'You have unsaved changes. Do you really want to leave this page? Your changes will be lost.'
    );
  }

  if (component.canDeactivate) {
    return component.canDeactivate();
  }

  return true;
};
