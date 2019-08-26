const path = require('path')
const express = require('express')
const xss = require('xss')
const notesService = require('./notes-service');
const notesRouter = express.Router()
const jsonParser = express.json()

const serializenotes = notes => ({
    id: notes.id,
    name: xss(notes.name),
    text: xss(notes.text),
    folder: notes.folder,
    date_created: notes.date_created
});


function checkField(field, res){
    if(field == undefined){
        res.status(400).json({
            error: {
                message: `${field} is undefined`
            }
        })
    }
}



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
        
        // check if field is empty
        checkField(name, res);
        checkField(text, res);
        checkField(folder, res);
       
        console.log(folder);
        console.log(typeof folder);

        if(typeof folder == 'string'){
            Number(folder);
        }
        console.log(folder);
        console.log(typeof folder);

        const newNote = {name, text, folder}
        console.log(newNote);
        notesService.insertnotes(
            req.app.get('db'),
           newNote
        )
            .then(notes => {
                res.status(204)
                    // redirect to notes page
                    .location(`/notes/${notes.id}`)
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
        notesService.deletenotes(
            db,
            req.params.notes_id
        ).then(notes => {
            if (!notes) {
                res.status(404).json({
                    error: {
                        message: "notes doesn't exist"
                    }
                })
                res.status(200);
            }
        }).catch(next);
    });
module.exports = notesRouter;