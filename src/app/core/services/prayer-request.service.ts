import { Injectable } from '@angular/core';

export interface PrayerRequest {
  name?: string;
  phoneNumberOrRegCode: string;
  request: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrayerRequestService {
  constructor() { }

  submitPrayerRequest(request: PrayerRequest): Promise<boolean> {
    // Simulated API call
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Prayer request submitted:', request);
        resolve(true);
      }, 1000);
    });
  }
}
