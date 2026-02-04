import { MongoClient } from 'mongodb';

// 1. On met 'root' et 'example' comme dans ton docker-compose
// 2. On garde '127.0.0.1' (plus sûr que localhost)
// 3. IMPORTANT : On ajoute '?authSource=admin' car l'utilisateur root est géré par la base "admin"
const url = 'mongodb://root:example@127.0.0.1:27017/calCount?authSource=admin';

const client = new MongoClient(url);

client.connect()
    .then(() => console.log('✅ Connecté à MongoDB avec succès !'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

export const db = client.db('calCount');