const mongoose = require('mongoose');
const dotenv = require('dotenv');

// ---------------------- HANDLE ERROR CATCHING UNCAUGHT EXCEPTIONS ---------------------------- //
// -------- If there is a bug or error occur(happen) in sync code, this will handle it -------- //
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTIONS !!! Shuting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// ---------------------- CONNECT DB ---------------------------- //
dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log("DB connection successful!"))

// ---------------------- START SERVER ---------------------------- //
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// -------------- HANDLE ERROR OUTSIDE EXPRESS: UNDHANDLE REJECTION ----------------- //
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLER REJECTION !!! Shuting down...');
    server.close(() => {
        process.exit(1);
    });
});