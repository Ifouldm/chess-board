import monk from 'monk';
import dotenv from 'dotenv';

dotenv.config();

// Database Connection
let mongoURI = 'localhost';
if (process.env.MONGO_HOST
&& process.env.MONGO_DB) {
    mongoURI = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;
}
const db = monk(mongoURI, { useNewUrlParser: true });
const matches = db.get('matches');
const subscriptions = db.get('subscriptions');

function closeDB(): void {
    db.close();
}

export { matches, subscriptions, closeDB };
