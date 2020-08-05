import express from 'express';
import routes from './Routes';
import cors from 'cors';

const port = 3333 || process.env.PORT; 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(routes);


app.listen(port, () => console.log(`Api rodando da porta:${port}`));


export default  app;
