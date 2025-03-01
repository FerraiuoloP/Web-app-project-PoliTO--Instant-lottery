// imports
import express from 'express';
import cors from 'cors';
import initRoutes from './src/routes.mjs';

// init express
const app = new express();
const port = 3001;

//allow client domain
const corsOptions = {
  origin: "http://localhost:5173",  
  optionsSuccessStatus: 200,        
  credentials: true,                
};

app.use(cors(corsOptions));

//define routes
initRoutes(app);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});