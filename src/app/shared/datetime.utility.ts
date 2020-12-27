// Convert DateTime as 18-02-2020
export function convertIntoDate(data: any) {
    return data ? new Date(data).toLocaleString('en-US').split(',')[0] : data;
}

// Show DateTime as 18-02-2020 09:10:00 AM
export function showDateTime(data: any) {
    return data ? new Date(data).toLocaleString('en-US') : data;
}