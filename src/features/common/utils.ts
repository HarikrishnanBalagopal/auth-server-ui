export const unixTimeStringtoDate = (x: string): Date => new Date(parseInt(x, 10) * 1000);
