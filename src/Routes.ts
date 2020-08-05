import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();
const classesController = new ClassesController();
const connectController = new ConnectionsController();

routes.get('/',(req, res)=>{
  return res.json({message:'Hello world'});
})

routes
  .post('/classes',classesController.create)
  .get('/classes',classesController.index);

routes
  .post('/connections',connectController.create)
  .get('/connections' ,connectController.index);


export default routes;