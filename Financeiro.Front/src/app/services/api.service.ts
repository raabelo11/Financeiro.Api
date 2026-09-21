import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lancamento, LancamentoPorPeriodoReturn } from '../models/lancamento.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getLancamentos(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(`${this.base}/Lancamentos`);
  }

  getLancamentosPorPeriodo(dataInicio: string, dataFim: string): Observable<LancamentoPorPeriodoReturn> {
    let params = new HttpParams().set('dataInicio', dataInicio).set('datafim', dataFim);
    return this.http.get<LancamentoPorPeriodoReturn>(`${this.base}/Lancamentos/Periodo`, { params });
  }

  createLancamento(payload: Partial<Lancamento>) {
    return this.http.post(`${this.base}/Lancamentos`, payload);
  }
}
