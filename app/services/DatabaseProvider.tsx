import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { SQLITE_RUNIT_DB_NAME } from '../utils/Constants';

const initializeDB = async (db : SQLiteDatabase) => {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        km TEXT NOT NULL,
        time TEXT NOT NULL,
        date TEXT NOT NULL,
        kcal TEXT NOT NULL,
      ); 
    `);
};


export default function DatabaseProvider({children}: {children: React.ReactNode}){
    return(
        <SQLiteProvider databaseName={SQLITE_RUNIT_DB_NAME} onInit={initializeDB}>
            {children}
        </SQLiteProvider>
    )
}