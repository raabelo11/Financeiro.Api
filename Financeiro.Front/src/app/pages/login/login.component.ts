import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.error = '';
    this.loading = true;
    setTimeout(() => {
      if (this.auth.login(this.username, this.password)) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Usuario ou senha invalidos.';
      }
      this.loading = false;
    }, 500);
  }
}
