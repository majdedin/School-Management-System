// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  accountForm: FormGroup;
  securityForm: FormGroup;
  userData: any;
  selectedFile: File | null = null;
  selectedMenu: string = 'account';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),
      photoProfil: ['']
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    const connectedUser = localStorage.getItem('connectedeUser');
    // console.log(connectedUser);
    
    const userId = connectedUser ? JSON.parse(connectedUser).id : '';

    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (response) => {
          this.userData = response.user; // Assurez-vous que 'user' est la clé correcte ici
          this.accountForm.patchValue(this.userData);
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
    } else {
      console.error('No user ID found in localStorage');
    }
  }

  handleAccountFinish(): void {
    const userId = localStorage.getItem('userId') || '';
    this.userService.updateUserProfile(userId, this.accountForm.value).subscribe(
      (user) => {
        this.userData = user;
        localStorage.setItem('currentuser', JSON.stringify(user));
      
      },
      (error) => {
      
      }
    );
  }

  handleFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  handleUploadProfilePicture(): void {
    if (!this.selectedFile) {
      return;
    }
    const userId = localStorage.getItem('userId') || '';
    this.userService.updateProfilePhoto(userId, this.selectedFile).subscribe(
      (user) => {
        this.userData = user;
        localStorage.setItem('currentuser', JSON.stringify(user));
      },
      (error) => {
      }
    );
  }

  handleSecurityFinish(): void {
    const userId = localStorage.getItem('userId') || '';
    this.userService.changePassword(userId, this.securityForm.value).subscribe(
      () => {
      },
      (error) => {
      }
    );
  }

  setSelectedMenu(menu: string): void {
    this.selectedMenu = menu;
  }
}
