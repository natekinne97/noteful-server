const path = require('path')
const express = require('express')
const xss = require('xss')
const folderService = require('./folder-service');
const folderRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    foldername: xss(folder.foldername)
});

// get all folders
folderRouter.route('/folders')
        .get((req, res, next)=>{
            folderService.getAll(req.app.get('db'))
                    .then(folders=>{
                        console.log(folders.map(serializeFolder))
                        res.json(folders.map(serializeFolder));
                    })
                    .catch(next);
        });

// get folder byId
folderRouter.route('/folders/:folder_id')
            .get((req, res, next)=>{
                folderService.getById(
                    req.app.get('db'),
                    req.params.folder_id
                ).then(folder=>{
                    if(!folder){
                        res.status(404).json({
                            error: {
                                message: "Error folder not found"
                            }
                        })
                    }
                    res.json(serializeFolder(folder));
                }).catch(next);
            });

// insert new folder
folderRouter.route('/folders')
        .post(jsonParser, (req, res, next)=>{
            const {foldername} = req.body;
            console.log(req.body);
            console.log(foldername);
            // error 
            if(foldername == undefined){
                console.log(foldername);
                return res.status(400).json({
                    error: {
                        message: "Must contain a foldername"
                    }
                })
            }
           
            folderService.insertFolder(
                req.app.get('db'),
                {foldername}
                )
                .then(folder =>{
                    res.status(204)
                        // redirect to folder page
                        .location(`/folders/${folder.id}`)
                        .json(folder);
                }).catch(next);
        });
        

// update folder
folderRouter.route('/folders/:folder_id')
        .patch(jsonParser, (req, res, next)=>{
            const {foldername} = req.body;
            if(!foldername){
                return res.status(400).json({
                    error: {
                        message: "Request must contain the folder foldername"
                    }
                })
            }
           
            folderService.update(
                req.app.get('db'), 
            req.params.folder_id,
           {foldername})
                .then(rowsEfected=>{
                    res.status(204).end();
                }).catch(next);
        });
// delete
folderRouter.route('/folders/:folder_id')
        .delete((req, res, next)=>{
            const db = req.app.get('db');
            folderService.deleteFolder(
                db, 
                req.params.folder_id
            ).then(folder=>{
                if(!folder){
                    res.status(404).json({
                        error: {
                            message: "folder doesn't exist"
                        }
                    })
                }
                res.status(200);
            }).catch(next);
        });

module.exports = folderRouter;