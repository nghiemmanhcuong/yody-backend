const handlePaginationHref = (keyword, field, criteria) => {
    let href;
    if (keyword) {
        href = '?keyword=' + keyword + '&page=';
    } else if (field && criteria) {
        href = '?field=' + field + '&criteria=' + criteria + '&page=';
    } else {
        href = '?page=';
    }
    return href;
};

module.exports = handlePaginationHref;