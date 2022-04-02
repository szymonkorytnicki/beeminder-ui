let itemsCountCache = parseInt(window.localStorage.getItem('beeminder-ui-items'), 10);
let itemsCount = itemsCountCache ? itemsCountCache : 6;

export const FAKE_DATA = Array.from({length: itemsCount}).map((el, index) => {
    return {
        slug: "Goal " + (index + 1),
        curval: (index + 1) + " items",
        limsum: (index + 1) + " items"
    }
})