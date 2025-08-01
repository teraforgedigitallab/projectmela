export const formatFullDate = (timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

// MM/DD/YYYY
export const formatShortDate = (timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// DD/MM/YYYY
export const formatShortDateIndiaStyle = (timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};