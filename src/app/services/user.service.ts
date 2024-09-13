import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl: string = 'http://localhost:3000/api/user';
  userProfilUrl: string = 'http://localhost:3000/api/user/profil';

  constructor(private http: HttpClient) { }
  signUp(user: any , photo:File) {
    let fData = new FormData();
    fData.append("firstName",user.firstName)
    fData.append("lastName",user.lastName)
    fData.append("email",user.email)
    fData.append("pwd",user.pwd)
    fData.append("role",user.role)
    fData.append("img",photo)
    return this.http.post<{ isAdded: boolean }>(this.userUrl+'/signUp', fData);
  }
  logIn(user: any){
    return this.http.post<{msg:string;user:any}>(this.userUrl+'/login',user);
  }
  getUserProfile(id: string): Observable<{ user: any }> {
    return this.http.get<{ user: any }>(`${this.userProfilUrl}/${id}`);
  }
  updateUserProfile(userId: string, user: any) {
    return this.http.put<any>(`${this.userUrl}/profil/${userId}`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || '',
      }),
    });
  }

  updateProfilePhoto(userId: string, file: File) {
    const formData = new FormData();
    formData.append('photoProfil', file);
    return this.http.put<any>(`${this.userUrl}/profile/photo/${userId}`, formData, {
      headers: new HttpHeaders({
        'x-auth-token': localStorage.getItem('token') || '',
      }),
    });
  }

  changePassword(userId: string, passwords: { currentPassword: string; newPassword: string }) {
    return this.http.put<any>(`${this.userUrl}/change-password/${userId}`, passwords, {
      headers: new HttpHeaders({
        'x-auth-token': localStorage.getItem('token') || '',
      }),
    });
  }

 
}


