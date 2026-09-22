import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lancamento, CriarLancamentoPayload, LancamentoPorPeriodoReturn } from '../models/lancamento.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getLancamentos(): Observable<LancamentoPorPeriodoReturn> {
    return this.http.get<LancamentoPorPeriodoReturn>(`${this.base}/Lancamentos`);
  }

  getLancamentosPorPeriodo(dataInicio: string, dataFim: string): Observable<LancamentoPorPeriodoReturn> {
    let params = new HttpParams().set('dataInicio', dataInicio).set('datafim', dataFim);
    return this.http.get<LancamentoPorPeriodoReturn>(`${this.base}/Lancamentos/Periodo`, { params });
  }

  createLancamento(payload: CriarLancamentoPayload): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.base}/Lancamentos`, payload);
  }

  updateLancamento(id: number, payload: Partial<Lancamento>): Observable<Lancamento> {
    return this.http.put<Lancamento>(`${this.base}/Lancamentos/${id}`, payload);
  }

  deleteLancamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/Lancamentos/${id}`);
  }
}
