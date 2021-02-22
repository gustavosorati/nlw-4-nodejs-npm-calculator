import express from 'express';
const app = express();
const routes = express.Router();

app.use(routes);

app.get('/', (req, res) => {
    res.send("Olá mundo")
})

app.post('/', (req, res) => {
    res.send("Olá mundo")
})

app.listen(3000);