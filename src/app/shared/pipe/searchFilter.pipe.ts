import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'vehiclefilter',
    pure: false
})
export class VehicleFilterPipe implements PipeTransform {
    transform(items: any[], category: Object): any {
        if (!items || !category) {
            return [];
        }
        return items.filter(item =>item.vehicleCategoryID==Number(category));
    }
}