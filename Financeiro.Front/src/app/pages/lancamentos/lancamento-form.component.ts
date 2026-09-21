import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lancamento-form',
  standalone: false,
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent implements OnInit {
  form = this.fb.group({
    nomeLancamento: ['', Validators.required],
    valorLancamento: [0, [Validators.required]],
    tipoLancamento: [0, Validators.required]
  });

  editMode = false;
  lancamentoId: number | null = null;
  loading = false;
  saving = false;
  titulo = 'Novo Lancamento';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.lancamentoId = Number(idParam);
      this.titulo = 'Editar Lancamento';
      this.loadLancamento(this.lancamentoId);
    }
  }

  loadLancamento(id: number) {
    this.loading = true;
    this.api.getLancamentos().subscribe({
      next: (lancamentos) => {
        const lancamento = lancamentos.find(l => l.id === id);
        if (lancamento) {
          this.form.patchValue({
            nomeLancamento: lancamento.nomeLancamento,
            valorLancamento: lancamento.valorLancamento,
            tipoLancamento: lancamento.tipoLancamento
          });
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    if (this.editMode && this.lancamentoId) {
      this.api.updateLancamento(this.lancamentoId, this.form.value).subscribe({
        next: () => { this.saving = false; this.router.navigate(['/lancamentos']); },
        error: () => { this.saving = false; }
      });
    } else {
      this.api.createLancamento(this.form.value).subscribe({
        next: () => { this.saving = false; this.router.navigate(['/lancamentos']); },
        error: () => { this.saving = false; }
      });
    }
  }

  voltar() {
    this.router.navigate(['/lancamentos']);
  }
}
