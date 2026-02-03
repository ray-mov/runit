import * as SQLite from 'expo-sqlite';
import { SQLITE_RUNIT_DB_NAME } from '../utils/Constants';

export interface Runs {
    id: number;
    distance_km : number;
    k_calories : number;
    elevation_gain : number;
    elapsed_time_minutes: number;
    created_at : string;
}

export type RunStats = {
  totalRuns: number
  totalDistance: number
  totalTime: number
  totalElevation: number
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

const getDB = async () : Promise<SQLite.SQLiteDatabase>  =>{
    if (dbInstance) return dbInstance
    const db = await SQLite.openDatabaseAsync(SQLITE_RUNIT_DB_NAME)
    dbInstance = db
        await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS runs (
        id INTEGER PRIMARY KEY NOT NULL, 
        distance_km REAL NOT NULL, 
        k_calories INTEGER NOT NULL,
        elevation_gain INTEGER NOT NULL,
        elapsed_time_minutes INTEGER NOT NULL,
        created_at TEXT NOT NULL
        );
    `);
    return db
}

export const saveRun = async(
    distance : number,
    minutes: number,
    kcal: number,
    elevation: number
    
) => {
    const db = await getDB();
    await db.runAsync(
    `INSERT INTO runs 
     (distance_km, elapsed_time_minutes, k_calories, elevation_gain, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [distance, minutes, kcal, elevation]
  );
}

export const getRuns = async (): Promise<Runs[]> => {
  const db = await getDB();
  const result = await db.getAllAsync<Runs>(
    `SELECT * FROM runs ORDER BY created_at DESC`
  );
  return result;
};


export const getRunStats = async (): Promise<RunStats> => {
  const db = await getDB()

  const result = await db.getFirstAsync<RunStats>(`
    SELECT
      COUNT(*) as totalRuns,
      COALESCE(SUM(distance_km), 0) as totalDistance,
      COALESCE(SUM(elapsed_time_minutes), 0) as totalTime,
      COALESCE(SUM(elevation_gain), 0) as totalElevation
    FROM runs
  `)

  return result!
}