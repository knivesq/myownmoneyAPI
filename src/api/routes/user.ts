import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserService from '../../services/user';
import { IUserInputDTO, IUpdateInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { ILogger } from '../../interfaces/ILogger';
const route = Router();
export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });
  
  route.post(
    '/update',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        name:Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        ocupation: Joi.string(),
        
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: ILogger = Container.get('logger');
      logger.debug('Calling Sign-In endpoint with body: %o', req.body)
      try {
      
        const userServiceInstance = Container.get(UserService); 
        
        const { user } = await userServiceInstance.Update(req.body as IUpdateInputDTO, req.currentUser._id);

        return res.json({ user}).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  
};
