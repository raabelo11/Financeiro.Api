import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LancamentosListComponent } from './pages/lancamentos/lancamentos-list.component';
import { LancamentoFormComponent } from './pages/lancamentos/lancamento-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lancamentos', component: LancamentosListComponent },
  { path: 'novo', component: LancamentoFormComponent },
  { path: 'editar/:id', component: LancamentoFormComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
