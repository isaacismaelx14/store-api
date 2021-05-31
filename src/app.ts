import express from 'express';
import UsersRouter from './router/user.router';
import ProductsRouter from './router/products.router';
import SellersRouter from './router/sellers.router';
import CategoriesRouter from './router/categories.router';
import AnsweresRouter from './router/answers.router';
import QuestionsRouter from './router/questions.router';
import ComentsRouter from './router/coments.router';
import DescriptionsRouter from './router/descriptions.router';
import cors from 'cors';
import MysqlController from './database/controllers/mysql.controller';
import dbConfig from './db.config';
import appRequest from './appRequest';

class App {
  private PORT: number | string;
  private __MYSQLCTRL:MysqlController;
  app = express();

  constructor(port: number) {
      this.PORT = process.env.PORT || port;
      this.__MYSQLCTRL = new MysqlController(dbConfig);
      this.middlewares();
      this.router();
  }

  private middlewares(): void {
      this.app.use(cors());   
      //   this.app.use(async (req: Request, res:Response, next:NextFunction) => {
      //       if(await this.__MYSQLCTRL.test())
      //           next();
      //       else res.status(400).json({message:'can not connect to database'});
      //   });
      this.app.use('/users', UsersRouter);
      this.app.use('/products', ProductsRouter);
      this.app.use('/sellers', SellersRouter);
      this.app.use('/categories', CategoriesRouter);
      this.app.use('/answers', AnsweresRouter);
      this.app.use('/questions', QuestionsRouter);
      this.app.use('/coments', ComentsRouter);
      this.app.use('/descriptions', DescriptionsRouter);
      this.app.use('/requests', appRequest);
  }

  private router(): void {
      this.app.get('/', (_, res: express.Response) => {
          res.send('Hello');
      });
  }

  start(): void {
      this.app.listen(this.PORT, () => {
          console.log(`Server running on http://localhost:${this.PORT}`);
      });
  }
}

export default App;
