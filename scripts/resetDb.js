const fs = require('fs');
const path = require('path');
const knex = require('../database/knex');

const dbFile = path.join(__dirname, '..', 'database', 'database.sqlite3');

(async () => {
    try {

        await knex.destroy();
        if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
        console.log('  Oude database verwijderd');


        const { execSync } = require('child_process');
        execSync('npm run db:init', { stdio: 'inherit' });
    } catch (e) {
        console.error(' Reset error:', e.message);
    }
})();
