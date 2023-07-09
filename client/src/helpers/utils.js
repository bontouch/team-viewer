export const compareArrays = (a, b) =>
    a.length === b.length && a.every((element, index) => element === b[index]);

export const scrollIntoViewWithOffset = (selector, offset) => {
    window.scrollTo({
        behavior: 'smooth',
        top:
            selector.getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            offset
    });
};
