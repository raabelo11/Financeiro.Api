import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Lancamento } from '../../models/lancamento.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  lancamentos: Lancamento[] = [];
  saldoTotal = 0;
  loading = false;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getLancamentos().subscribe({
      next: (res) => { this.lancamentos = res; this.saldoTotal = res.reduce((s, r) => s + r.valorLancamento, 0); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
