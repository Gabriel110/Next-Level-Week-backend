import db from '../database/connection';
import convertHourToMinutes from '../util/convertHourToMinutes';
import {Request, Response} from 'express';

interface ScheduleItem{
  week_day:number,
  from:string,
  to:string,
}

export default class ClassesController{

  async create (req:Request, res:Response){
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = req.body;
  
    const trx = await db.transaction();
    
    try{
      const insertedUserId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
    
      const user_id = insertedUserId[0];
    
      const insertedClassId = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
    
     
      const class_id = insertedClassId[0];
      const classSchedule = schedule.map((scheduleItem:ScheduleItem) =>{
        return {
          class_id,
          week_day:scheduleItem.week_day,
          from:convertHourToMinutes(scheduleItem.from),
          to:convertHourToMinutes(scheduleItem.to)
        }
      });
      
      await trx('class_scheduie').insert(classSchedule);
    
      await trx.commit();
      
      return res.status(201).send();
    }catch(err){
      await trx.rollback();
      return res.status(400).json({
        erro:'Unexpect error while create new class'
      })
    }
  };

  async index(req:Request, res:Response){
    const filters = req.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if(!filters.week_day || !filters.subject || !filters.time){
      return res.status(400).json({
        error:'Missing filters to search classes'
      })
    }
    const timeInMinutes = convertHourToMinutes(time);
    const clases = await db('classes')
      .whereExists(function(){
        this.select('class_scheduie.*')
            .from('class_scheduie')
            .whereRaw('`class_scheduie`.`class_id` = `classes`.`id`')
            .whereRaw('`class_scheduie`.`week_day`= ??',[Number(week_day)])
            .whereRaw('`class_scheduie`.`from` <= ??',[timeInMinutes])
            .whereRaw('`class_scheduie`.`to` > ??',[timeInMinutes])
            
      })
      .where('classes.subject','=',subject)
      .join('users','classes.user_id','=','users.id')
      .select(['classes.*','users.*']);

    return res.json(clases);
  }

}