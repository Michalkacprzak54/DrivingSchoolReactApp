const formatDescription = (description) => {
    return description
        .replace(/\?\?/g, '�')  // Zamiana ?? na �
        .replace(/\r?\n{2,}/g, '<br /><br />') // Podw�jne lub wi�cej \n zamienia na <br /><br />
        .replace(/\r?\n/g, '<br />'); // Pojedyncze \n zamienia na <br />
}; 
const formatShortDescription = (description, maxLength) => {
    return description
        .replace(/\s+/g, ' ')
        .replace(/\?\?/g, '�')
        .trim()
        .substring(0, maxLength) + (description.length > maxLength ? '...' : '');
};

export { formatDescription, formatShortDescription };