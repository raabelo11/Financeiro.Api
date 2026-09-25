import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CriarLancamentoPayload } from '../../models/lancamento.model';
import { Categoria, CategoriaPayload } from '../../models/categoria.model';
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
    selecao: ['', Validators.required]
  });

  categorias: Categoria[] = [];

  editMode = false;
  lancamentoId: number | null = null;
  loading = false;
  saving = false;
  titulo = 'Novo Lancamento';
  lancamentosAdicionados: CriarLancamentoPayload[] = [];

  mostrarNovoTipo = false;
  novoTipoForm = this.fb.group({
    nome: ['', Validators.required],
    icone: ['category', Validators.required],
    cor: ['#4F46E5', Validators.required]
  });
  salvandoTipo = false;
  erroNovoTipo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.api.getCategorias().subscribe({
      next: (cs) => { this.categorias = cs; },
      error: () => { this.categorias = []; }
    });

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
          const selecao = lancamento.tipoLancamento === 'Receita'
            ? 'RECEITA'
            : String(lancamento.categoriaId);
          this.form.patchValue({
            nomeLancamento: lancamento.nomeLancamento,
            valorLancamento: lancamento.valorLancamento,
            selecao
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

    const { nomeLancamento, valorLancamento, selecao } = this.form.value;

    const payload: CriarLancamentoPayload = selecao === 'RECEITA'
      ? { nomeLancamento: nomeLancamento!, valorLancamento: valorLancamento!, tipoLancamento: 'Receita', categoriaId: null }
      : { nomeLancamento: nomeLancamento!, valorLancamento: valorLancamento!, tipoLancamento: 'Despesa', categoriaId: Number(selecao) };

    if (this.editMode && this.lancamentoId) {
      this.api.updateLancamento(this.lancamentoId, payload).subscribe({
        next: () => { this.saving = false; this.router.navigate(['/lancamentos']); },
        error: () => { this.saving = false; }
      });
      return;
    }

    this.api.createLancamento(payload).subscribe({
      next: () => {
        this.lancamentosAdicionados.unshift(payload);
        if (this.lancamentosAdicionados.length > 5) {
          this.lancamentosAdicionados.pop();
        }
        this.form.reset({ nomeLancamento: '', valorLancamento: 0, selecao: 'RECEITA' });
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  abrirNovoTipo() {
    this.mostrarNovoTipo = true;
    this.erroNovoTipo = null;
    this.novoTipoForm.reset({ nome: '', icone: 'category', cor: '#4F46E5' });
  }

  fecharNovoTipo() {
    this.mostrarNovoTipo = false;
    this.erroNovoTipo = null;
  }

  salvarNovoTipo() {
    if (this.novoTipoForm.invalid) return;
    this.salvandoTipo = true;
    this.erroNovoTipo = null;

    this.api.createCategoria(this.novoTipoForm.value as CategoriaPayload).subscribe({
      next: (categoria) => {
        this.categorias.push(categoria);
        this.form.patchValue({ selecao: String(categoria.id) });
        this.salvandoTipo = false;
        this.mostrarNovoTipo = false;
      },
      error: (err) => {
        this.erroNovoTipo = err.error?.message ?? 'Erro ao criar tipo.';
        this.salvandoTipo = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/lancamentos']);
  }
}
