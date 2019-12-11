const folderService = {
    getAll(db){
        return db.select('*').from('folders');
    },
    insertFolder(db, newFolder){
        return db.insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows=>{
                console.log(rows[0], 'inserted folder')
                return rows[0]
            });
    },
    getById(db, id){
        return db.from('folders')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteFolder(db, id){
        return db('folders')
            .where('id', id)
            .delete();
    },
    update(db, id, updatedFolder){
        return db('folders')
            .where('id', id)
            .update(updatedFolder);
    }
}

module.exports = folderService;