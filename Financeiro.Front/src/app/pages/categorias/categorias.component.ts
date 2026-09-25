import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Categoria, CategoriaPayload } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: false,
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;

  mostrarModal = false;
  editando: Categoria | null = null;
  salvando = false;
  erroForm: string | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    icone: ['category', Validators.required],
    cor: ['#4F46E5', Validators.required]
  });

  mostrarModalExcluir = false;
  categoriaParaExcluir: Categoria | null = null;
  excluindo = false;
  erroExcluir: string | null = null;

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (cs) => { this.categorias = cs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  abrirNova() {
    this.editando = null;
    this.erroForm = null;
    this.form.reset({ nome: '', icone: 'category', cor: '#4F46E5' });
    this.mostrarModal = true;
  }

  abrirEdicao(c: Categoria) {
    this.editando = c;
    this.erroForm = null;
    this.form.patchValue({ nome: c.nome, icone: c.icone, cor: c.cor });
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
    this.editando = null;
  }

  salvar() {
    if (this.form.invalid) return;
    this.salvando = true;
    this.erroForm = null;

    const payload = this.form.value as CategoriaPayload;

    if (this.editando) {
      this.api.updateCategoria(this.editando.id, payload).subscribe({
        next: () => { this.salvando = false; this.fecharModal(); this.load(); },
        error: (err) => {
          this.salvando = false;
          this.erroForm = err.error?.message ?? 'Erro ao salvar categoria.';
        }
      });
      return;
    }

    this.api.createCategoria(payload).subscribe({
      next: () => { this.salvando = false; this.fecharModal(); this.load(); },
      error: (err) => {
        this.salvando = false;
        this.erroForm = err.error?.message ?? 'Erro ao salvar categoria.';
      }
    });
  }

  confirmarExclusao(c: Categoria) {
    this.categoriaParaExcluir = c;
    this.erroExcluir = null;
    this.mostrarModalExcluir = true;
  }

  cancelarExclusao() {
    this.mostrarModalExcluir = false;
    this.categoriaParaExcluir = null;
  }

  excluir() {
    if (!this.categoriaParaExcluir) return;
    this.excluindo = true;
    this.erroExcluir = null;

    this.api.deleteCategoria(this.categoriaParaExcluir.id).subscribe({
      next: () => {
        this.excluindo = false;
        this.mostrarModalExcluir = false;
        this.categoriaParaExcluir = null;
        this.load();
      },
      error: (err) => {
        this.excluindo = false;
        this.erroExcluir = err.error?.message ?? 'Não foi possível excluir.';
      }
    });
  }
}
