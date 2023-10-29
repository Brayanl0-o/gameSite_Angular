import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Renderer2, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Game } from 'src/app/models/game';
import { VideogamesService } from 'src/app/services/videogames/videogames.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-videogame',
  templateUrl: './edit-videogame.component.html',
  styleUrls: ['./edit-videogame.component.css']
})
export class EditVideogameComponent {


  constructor(private videoGamesService: VideogamesService,
    private renderer: Renderer2,
    private http: HttpClient,
    private fb: FormBuilder) { }
    @Input() game: Game = {} as Game;
    // @Input() game: Game | null = null;
    contactForm!: FormGroup;
    selectedFile: File | null = null;

    ngOnInit(): void{
      this.contactForm =  this.initFrom();

      this.contactForm.patchValue(this.game);
      console.log(this.game)
    }

  onFileSelected(event: Event):void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0];

    if (file){
      this.selectedFile = file;
    }
  }

  onFormSubmit(){
    if (this.selectedFile) {
      // this.uploadImage();
      this.updateDataGame(this.selectedFile);
    } else {
      // Aquí puedes manejar el caso en el que selectedFile sea null, si es necesario.
      console.error('No se ha seleccionado ningún archivo.');
    }
  }

  errorResponseMessage = '';
  updateDataGame(gameImg: File): void {
   if(!this.game){
    console.error('Error: No se proporcionaron datos para la actualización.');
    return;
   }

   this.game = { ...this.game, ...this.contactForm.value};

   this.videoGamesService.updateGame(this.game._id, this.game, gameImg).subscribe(
    (response) =>{
      this.closeModalAndReloadPage();
      console.log('Datos act con exito:', response);
    },
    (error) => {
      console.error('Error al actualizar los datos:', error);
    }
    )
  }

    defaultUserImgUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIip2Y--IFllD0cow5w64ZrJD-S7oC9pjhc1mELWbqIuk3m2RF';
    initFrom(): FormGroup{
      return this.fb.group({
        gameName: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
        // gameImg: [this.defaultUserImgUrl],
        platform:['',[Validators.required,Validators.maxLength(40)]],
        releaseDate: ['',[]],
        developer:['',[ Validators.maxLength(40)]],
        genre:['',[Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
        averageRating:['',[Validators.maxLength(2)]],
        descriptionGame:['',[Validators.required, Validators.maxLength(400)]]

      })
    }

    closeModalAndReloadPage() {
      this.closeModal();
      window.location.reload();
    }

    closeModal() {
      console.log('close modal')
      this.renderer.removeStyle(document.body, 'overflow');
      this.videoGamesService.$modal.emit(false)
      console.log('Modal cerrado');
    }
  // percentDone: number = 0;
  // uploadSuccess!: boolean;

  // uploadImageAndProgress(files:File[]) {
  //   console.log(files);
  //   var formData = new FormData();
  //   Array.from(files).forEach((f)=> formData.append('gameImg',f))
  //   const apiUrl = `${environment.apiUrl}uploadImg/videogames`;

  //   this.http.post(apiUrl,formData, {
  //     reportProgress:true,
  //     observe:'events',
  //   })
  //   .subscribe((event) => {
  //     if(event.type === HttpEventType.UploadProgress){
  //       if(event.total)
  //       this.percentDone = Math.round((100* event.loaded) / event.total);
  //     }else if(event instanceof HttpResponse){
  //       this.uploadSuccess = true;
  //     }
  //   });
  // }

  // uploadImage():void{
  //   if(this.selectedFile){
  //     this.uploadImageAndProgress([this.selectedFile])
  //   }else {
  //     console.error('Error upload image')
  //   }
  // }


}

