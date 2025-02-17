import {Directive, effect, EventEmitter, input, linkedSignal, model, output, signal} from '@angular/core';
import {mdiInformationOutline} from '@mdi/js';

@Directive({
  standalone: true,
  selector: '[appBaseInput]',
})
export class BaseInputDirective<InputValue = any, OutputValue = InputValue> {
  protected readonly helpIcon = mdiInformationOutline;
  protected valueChange = output<OutputValue | undefined>();

  // Required Inputs
  label = input.required<string>();

  // Optional Inputs
  name = input('');
  required = input(false);
  disabled = input(false);
  value = signal<InputValue | undefined>(undefined);
  helpText = input('');

  // Outputs
  outputValue = model<OutputValue | undefined>();

  constructor() {
    effect(() => {
      const currentValue = this.outputValue();

      if (currentValue != null) {
        this.valueChange.emit(currentValue);
      }
    });
  }
}
