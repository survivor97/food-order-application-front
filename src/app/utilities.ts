import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'parseDate'
})
export class Utilities implements PipeTransform {

    transform(inputDate: string): string {
        const date: Date = new Date(inputDate);
        const dateString: string = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
        const timeString: string = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        return dateString + ' ' + timeString;
    }
}