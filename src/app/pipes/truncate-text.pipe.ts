import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
  standalone: true
})
export class TruncateTextPipe implements PipeTransform {

  completeWords:boolean = true;
  ellipsis: string = '...'

  transform(value: string, limit: number = 120): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    let truncatedText = value.substring(0, limit);

    if (this.completeWords) {
      truncatedText = truncatedText.substring(0, truncatedText.lastIndexOf(' '));
    }

    return truncatedText + this.ellipsis;
  }

}

