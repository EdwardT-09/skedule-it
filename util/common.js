export const isEmpty = (value) => {
    if (value === null || (typeof value === "string" && value.trim() === '')){
        return true;
    }
    return false;
} 

