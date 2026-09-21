import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Lancamento } from '../../models/lancamento.model';

interface MesOption {
  value: number;
  label: string;
}

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

  tabAtiva: 'todos' | 'receitas' | 'despesas' = 'todos';
  periodoAtivo: 'todos' | 'mes_atual' | 'mes_anterior' | 'ano_atual' | 'personalizado' = 'todos';

  mesSelecionado!: number;
  anoSelecionado!: number;

  meses: MesOption[] = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Marco' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  anos: number[] = [];

  mostrarModalExcluir = false;
  lancamentoParaExcluir: Lancamento | null = null;
  excluindo = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    const hoje = new Date();
    this.mesSelecionado = hoje.getMonth() + 1;
    this.anoSelecionado = hoje.getFullYear();
    this.anos = this.gerarUltimosAnos(hoje.getFullYear());

    this.loadAll();
  }

  get lancamentosFiltrados(): Lancamento[] {
    if (this.tabAtiva === 'receitas') {
      return this.lancamentos.filter(l => l.tipoLancamento === 0);
    }
    if (this.tabAtiva === 'despesas') {
      return this.lancamentos.filter(l => l.tipoLancamento === 1);
    }
    return this.lancamentos;
  }

  get totalReceitas(): number {
    return this.lancamentos
      .filter(l => l.tipoLancamento === 0)
      .reduce((s, l) => s + l.valorLancamento, 0);
  }

  get totalDespesas(): number {
    return this.lancamentos
      .filter(l => l.tipoLancamento === 1)
      .reduce((s, l) => s + l.valorLancamento, 0);
  }

  get saldoLista(): number {
    return this.totalReceitas - this.totalDespesas;
  }

  get countTodos(): number {
    return this.lancamentos.length;
  }

  get countReceitas(): number {
    return this.lancamentos.filter(l => l.tipoLancamento === 0).length;
  }

  get countDespesas(): number {
    return this.lancamentos.filter(l => l.tipoLancamento === 1).length;
  }

  get temFiltroAtivo(): boolean {
    return this.tabAtiva !== 'todos' || this.periodoAtivo !== 'todos';
  }

  loadAll() {
    this.loading = true;
    this.api.getLancamentos().subscribe({
      next: (r) => { this.lancamentos = r; this.saldoPeriodo = null; this.loading = false; },
      error: () => this.loading = false
    });
  }

  buscarPorPeriodo() {
    if (!this.filtroInicio || !this.filtroFim) return;
    this.periodoAtivo = 'personalizado';
    this.loading = true;
    this.api.getLancamentosPorPeriodo(this.filtroInicio, this.filtroFim).subscribe({
      next: (r) => { this.lancamentos = r.lancamentos; this.saldoPeriodo = r.saldoPeriodo; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  selecionarPeriodo(periodo: 'todos' | 'mes_atual' | 'mes_anterior' | 'ano_atual' | 'personalizado') {
    this.periodoAtivo = periodo;

    if (periodo === 'todos') {
      this.loadAll();
      return;
    }

    if (periodo === 'personalizado') {
      return;
    }

    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date;

    if (periodo === 'mes_atual') {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    } else if (periodo === 'mes_anterior') {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    } else {
      dataInicio = new Date(hoje.getFullYear(), 0, 1);
      dataFim = new Date(hoje.getFullYear(), 11, 31);
    }

    this.buscarPorIntervalo(dataInicio, dataFim);
  }

  filtrarPorMesAno() {
    const dataInicio = new Date(this.anoSelecionado, this.mesSelecionado - 1, 1);
    const dataFim = new Date(this.anoSelecionado, this.mesSelecionado, 0);
    this.buscarPorIntervalo(dataInicio, dataFim);
  }

  limparFiltros() {
    this.tabAtiva = 'todos';
    this.periodoAtivo = 'todos';
    this.filtroInicio = '';
    this.filtroFim = '';
    this.saldoPeriodo = null;
    this.loadAll();
  }

  confirmarExclusao(lancamento: Lancamento) {
    this.lancamentoParaExcluir = lancamento;
    this.mostrarModalExcluir = true;
  }

  cancelarExclusao() {
    this.mostrarModalExcluir = false;
    this.lancamentoParaExcluir = null;
  }

  excluirLancamento() {
    if (!this.lancamentoParaExcluir || !this.lancamentoParaExcluir.id) return;
    const id = this.lancamentoParaExcluir.id;
    this.excluindo = true;
    this.api.deleteLancamento(id).subscribe({
      next: () => {
        this.lancamentos = this.lancamentos.filter(l => l.id !== id);
        this.excluindo = false;
        this.mostrarModalExcluir = false;
        this.lancamentoParaExcluir = null;
      },
      error: () => { this.excluindo = false; }
    });
  }

  private buscarPorIntervalo(dataInicio: Date, dataFim: Date) {
    this.loading = true;
    const inicio = this.formatarData(dataInicio);
    const fim = this.formatarData(dataFim);

    this.api.getLancamentosPorPeriodo(inicio, fim).subscribe({
      next: (res) => {
        this.lancamentos = res.lancamentos;
        this.saldoPeriodo = res.saldoPeriodo;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private gerarUltimosAnos(anoAtual: number): number[] {
    const anos: number[] = [];
    for (let i = 0; i < 5; i++) {
      anos.push(anoAtual - i);
    }
    return anos;
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
