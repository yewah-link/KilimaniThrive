import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    // If already absolute URL, return as-is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    // Prepend backend base URL for relative paths like /uploads/...
    return `${environment.baseUrl}${value}`;
  }
}
