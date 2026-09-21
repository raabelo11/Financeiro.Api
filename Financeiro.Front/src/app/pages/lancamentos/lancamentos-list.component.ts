import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Lancamento } from '../../models/lancamento.model';

@Component({
  selector: 'app-lancamentos-list',
  standalone: false,
  templateUrl: './lancamentos-list.component.html',
  styleUrls: ['./lancamentos-list.component.scss']
})
export class LancamentosListComponent implements OnInit {
  lancamentos: Lancamento[] = [];
  filtroInicio: string = '';
  filtroFim: string = '';
  saldoPeriodo: number | null = null;
  loading = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.api.getLancamentos().subscribe({ next: (r) => { this.lancamentos = r; this.loading = false; }, error: () => this.loading = false });
  }

  buscarPorPeriodo() {
    if (!this.filtroInicio || !this.filtroFim) return;
    this.loading = true;
    this.api.getLancamentosPorPeriodo(this.filtroInicio, this.filtroFim).subscribe({
      next: (r) => { this.lancamentos = r.lancamentos; this.saldoPeriodo = r.saldoPeriodo; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
