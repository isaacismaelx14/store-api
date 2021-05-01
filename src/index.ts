import App from './app';
import JsonWebToken from './function/jws';
import dotenv from 'dotenv';

function Main() {
    const app = new App(3001);
    app.start();
}

Main();
