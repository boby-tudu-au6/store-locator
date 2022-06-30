import Dexie from 'dexie';

const db = new Dexie('store-locator');
db.version(1).stores({
    bookmarks: 'name, author',
    stores: 'fields.Name',
    home: "name, author"
});

export default db