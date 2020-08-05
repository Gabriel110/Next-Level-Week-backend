import db from '../database/connection';
import {Request, Response, response} from 'express';

export default class ConnectionsController{

  async create(req:Request, res:Response){
    const {user_id} = req.body;
    await db('connections').insert({user_id})
    return res.status(201).send();
  }

  async index(req:Request, res:Response){
    const totalConnection = await db('connections').count('* as total');
    const {total} = totalConnection[0];
    return res.json({total});
  }
}