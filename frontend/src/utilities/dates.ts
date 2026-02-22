export const getDate = () => new Date().toISOString().split("T")[0];

export const isValidDateRange = (dateStart: string, dateEnd: string) => {
    const today = getDate();
    return dateStart <= today && dateEnd <= today && dateStart <= dateEnd;
};

export const toISO = (date: Date) => date.toISOString().split("T")[0];

export const fromISO = (date: string) => new Date(date + "T00:00:00");
