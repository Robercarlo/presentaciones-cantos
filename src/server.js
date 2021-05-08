import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '/build')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async (operations, res) => {
    try {
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'id11191910_himnos',
            port: '8889'
        });
        connection.connect((err) => {
            if (err) throw err;
        });

        await operations(connection);
        
        connection.end((err) => {
            // The connection is terminated gracefully
            // Ensures all remaining queries are executed
            // Then sends a quit packet to the MySQL server.
        });

    } catch {
        res.status(500).json({ message: 'Error connecting to db', error });
    }
}

app.get('/api/himnos', async (req,res) => {
    connectDB( async(connection) => {
        connection.query("SELECT * FROM Himno", function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
            
    }, res);
});

app.get('/api/buscartitulos', async (req,res) => {
    connectDB( async(connection) => {
        connection.query("SELECT * FROM Himno WHERE Titulo like '%" + req.query.term + "%'", function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
            
    }, res);
});

app.get('/api/obtenerestrofas', async (req,res) => {
    connectDB( async(connection) => {
        connection.query("SELECT * FROM Estrofa WHERE Himno_Id ='" + req.query.id + "'", function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
            
    }, res);
});

app.get('/api/buscarenestrofas', async (req,res) => {
    connectDB( async(connection) => {
        connection.query("SELECT Himno_Id FROM Estrofa WHERE Contenido like '%" + req.query.term + "%'", function (err, result) {
            if (err) throw err;
            console.log(result);
            res.status(200).json(result);
        });
            
    }, res);
});

app.get('/api/buscarencontenido', async (req,res) => {
    connectDB( async(connection) => {
        connection.query("SELECT * FROM Himno WHERE Titulo like '%" + req.query.term + "%' OR Id IN (" + req.query.array + ")", function (err, result) {
            if (err) throw err;
            console.log(result);
            res.status(200).json(result);
        });
            
    }, res);
});

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + '/build/index.html'))
});

app.listen(8000, () => console.log('Listening on port 8000'));
