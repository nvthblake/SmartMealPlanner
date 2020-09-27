package com.example.smartfridge;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

public class TaskProvider {
    public boolean checkForTableNotExists(SQLiteDatabase db, String table){
        // Function returns true if there's no table already available on the database
        String sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='"+table+"'";
        Cursor mCursor = db.rawQuery(sql, null);
        if (mCursor.getCount() > 0) {
            return false;  // Table does exist on database. Return False
        }
        mCursor.close();
        return true;  // Table does not exist on database. Return True
    }
}
