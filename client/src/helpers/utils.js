export const compareArrays = (a, b) =>
    a.length === b.length && a.every((element, index) => element === b[index]);

export const scrollIntoViewWithOffset = (selector, offset) => {
    //prev offset was 130 for top
    window.scrollTo({
        behavior: 'smooth',
        top:
            selector.getBoundingClientRect().bottom -
            document.body.getBoundingClientRect().bottom +
            offset
        /*        top:
            selector.getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            offset*/
    });
};
