import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // In a real application, you would log this to a remote service.
    console.error('An unexpected error occurred:', error);
    
    // For demonstration, we are logging to the console and showing an alert
    // to the user. A more user-friendly approach in a real app might involve
    // showing a toast notification or a dedicated error page.
    alert('Terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman.');
  }
}
