import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  contactForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.contactForm = this.initFrom();

  }

  onSubmit(): void {
    // console.log('form ->', this.contactForm.value);
    if (this.contactForm.valid) {
      this.signUp();
    }
  }

  // Var para guardar y manejar el error
  errorResponseMessage: string | null = null;

  // Metodo para manejar el registro del usuario
  signUp() {
    this.authService.signUp(this.contactForm.value)
      .subscribe(res => {
        // console.log(res)
        localStorage.setItem('token', res.token)

        // Obtiene el ID del usuario logueado.
        const userId = this.authService.getLoggedInUserId();
        // Redirige al perfil del usuario si los IDs coinciden.
        if (userId) {
          this.router.navigate(['/']);
        } else {
          console.log('No se encontro id')
        }
      },
        err => {
          // console.log(err);
          if (err instanceof HttpErrorResponse) {
            this.errorResponseMessage = err.error.message;
          }
        }
      );
  }

  defaultUserImgUrl = 'https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png';

  initFrom(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-z\\s]+')]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-z\\s]+')]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      years: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      phoneNumber: ['', Validators.required],
      country: ['Colombia'],
      userImg: [this.defaultUserImgUrl],
    })

  }

  saveForm(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
  }

  formRegisterAlert(): void {
    window.alert('Todos los campos con * son obligatorios')
  }

}
