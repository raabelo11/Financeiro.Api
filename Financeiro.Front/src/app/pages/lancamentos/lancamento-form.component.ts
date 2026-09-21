import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lancamento-form',
  standalone: false,
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent {
  form = this.fb.group({
    nomeLancamento: ['', Validators.required],
    valorLancamento: [0, [Validators.required]],
    tipoLancamento: [0, Validators.required]
  });

  saving = false;
  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.createLancamento(this.form.value).subscribe({ next: () => { this.saving = false; this.router.navigate(['/lancamentos']); }, error: () => { this.saving = false; } });
  }
}
