const path = require('path')
const express = require('express')
const xss = require('xss')
const notesService = require('./notes-service');
const notesRouter = express.Router()
const jsonParser = express.json()

const serializenotes = notes => ({
    id: notes.id,
    name: xss(notes.name),
    content: xss(notes.text),
    folderId: notes.folder,
    modified: notes.date_created
});

// get all notess
notesRouter.route('/notes')
    .get((req, res, next) => {
        notesService.getAll(req.app.get('db'))
            .then(notes => {
                
                res.json(notes.map(serializenotes));
            })
            .catch(next);
    });

// get notes byId
notesRouter.route('/notes/:notes_id')
    .get((req, res, next) => {
        notesService.getById(
            req.app.get('db'),
            req.params.notes_id
        ).then(notes => {
            if (!notes) {
                res.status(404).json({
                    error: {
                        message: "Error notes not found"
                    }
                })
                
            }
            res.json(serializenotes(notes));
        }).catch(next);
    });

// insert new notes
notesRouter.route('/notes')
    .post(jsonParser, (req, res, next) => {
        const { name, text, folder } = req.body;
        const newNote = { name, text, folder }
        console.log('inserting new note');
        
        for(field in newNote){
            if(!newNote[field]){
               return res.status(400).json({
                    error: {
                        message: `Must include ${field}`
                    }
                })
            }
        }

        if(typeof folder == 'string'){
            Number(folder);
        }
        console.log(newNote, 'newNote');
       
        notesService.insertnotes(
            req.app.get('db'),
           newNote
        )
            .then(notes => {
                console.log('note inserted')
                console.log(notes, 'notes');
                console.log(serializenotes(notes), 'serialized notes');
                res.status(200)
                    // redirect to notes page
                    // .location(`/notes/${notes.id}`)
                    .json(serializenotes(notes));
            })
    });


// update notes
notesRouter.route('/notes/:notes_id')
    .patch(jsonParser, (req, res, next) => {
        const { notesname } = req.body;
        if (!notesname) {
            return res.status(400).json({
                error: {
                    message: "Request must contain the notes name"
                }
            })
        }
        notesService.update(req.app.get('db'),
            req.params.notes_id,
            notesname
            )
            .then(rowsEfected => {
                res.status(204).end();
            }).catch(next);
    });
// delete
notesRouter.route('/notes/:notes_id')
    .delete((req, res, next) => {
        const db = req.app.get('db');
        const noteId = req.params.notes_id;
        console.log(noteId);
        console.log('delete called')
        notesService.deleteNotes(
            db,
            Number(noteId)
        )
        .then(notes=>{
            if(!notes){
                console.log(notes, 'notes after if');
                return res.status(400).json({
                    error: "note doesnt exist"
                });
            }
            console.log('success being sent');
            return res.status(200).end();
        })
        .catch(err=> {
            console.log('an error occurred')
            console.log(err, 'error')});
        console.log('nothing happened');
    });
module.exports = notesRouter;