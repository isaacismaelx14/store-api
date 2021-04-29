import express from 'express';
import UsersRouter from './router/user.router';
import ProductsRouter from './router/products.router';
import SellersRouter from './router/sellers.router';
import CategoriesRouter from './router/categories.router';
import AnsweresRouter from './router/answers.router';
import QuestionsRouter from './router/questions.router';
import ComentsRouter from './router/coments.router';
import DescriptionsRouter from './router/descriptions.router';

class App {
  private PORT: number | string;
  app = express();

  constructor(port: number) {
    this.PORT = process.env.PORT || port;
    this.middlewares();
    this.router();
  }

  private middlewares(): void {
    this.app.use('/users', UsersRouter);
    this.app.use('/products', ProductsRouter);
    this.app.use('/sellers', SellersRouter);
    this.app.use('/categories', CategoriesRouter);
    this.app.use('/answers', AnsweresRouter);
    this.app.use('/questions', QuestionsRouter);
    this.app.use('/coments', ComentsRouter);
    this.app.use('/descriptions', DescriptionsRouter);
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
