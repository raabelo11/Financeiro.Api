import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CriarLancamentoPayload } from '../../models/lancamento.model';
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
  lancamentosAdicionados: CriarLancamentoPayload[] = [];

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
        const lancamento = lancamentos.lancamentos.find(l => l.id === id);
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

    const { nomeLancamento, valorLancamento, tipoLancamento } = this.form.value;
    const tipo: 'Receita' | 'Despesa' = tipoLancamento === 0 ? 'Receita' : 'Despesa';

    const payload: CriarLancamentoPayload = {
      nomeLancamento: nomeLancamento!,
      valorLancamento: valorLancamento!,
      tipoLancamento: tipo
    };

    this.api.createLancamento(payload).subscribe({
      next: () => {
        this.lancamentosAdicionados.unshift(payload);
        if (this.lancamentosAdicionados.length > 5) {
          this.lancamentosAdicionados.pop();
        }
        this.form.reset({ nomeLancamento: '', valorLancamento: 0, tipoLancamento: 0 });
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  voltar() {
    this.router.navigate(['/lancamentos']);
  }
}
