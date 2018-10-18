export const today = new Date();
export const year = today.getFullYear();
export const date = today.getDate();
export const month = today.getMonth();
export const hour = today.getHours();
export const minutes = today.getMinutes();
export const emailregex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const fulldate = date + '/' + month + '/' + year + ' ' + hour + ':' + minutes;