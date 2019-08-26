const notesService = {
    getAll(db) {
        return db.select('*').from('notes');
    },
    insertnotes(db, newnotes) {
        return db.insert(newnotes)
            .into('notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    getById(db, id) {
        return db.from('notes')
            .select('*')
            .where('id', id)
            .first()
    },
    deletenotes(db, id) {
        return db('notes')
            .where('id', id)
            .delete();
    },
    update(db, id, updatednotes) {
        return db('notes')
            .where('id', id)
            .update(updatednotes);
    }
}

module.exports = notesService;