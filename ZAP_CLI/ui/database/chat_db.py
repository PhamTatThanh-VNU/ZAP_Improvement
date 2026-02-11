"""Database manager for vulnerability chat"""
import sqlite3
import json
from pathlib import Path
from datetime import datetime
from typing import List, Tuple, Optional, Dict, Any


class ChatDatabase:
    def __init__(self, db_path: str = "vulnerability_chat.db"):
        self.db_path = Path(db_path)
        self._init_tables()
    
    def _init_tables(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript('''
                CREATE TABLE IF NOT EXISTS sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id INTEGER NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    metadata TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );
                
                CREATE TABLE IF NOT EXISTS research_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id INTEGER NOT NULL,
                    query TEXT NOT NULL,
                    analysis TEXT,
                    jsdoc TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );
                
                CREATE TABLE IF NOT EXISTS scripts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    content TEXT NOT NULL,
                    file_path TEXT,
                    test_url TEXT,
                    test_result TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );
            ''')
    
    def create_session(self, name: str) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute('INSERT INTO sessions (name) VALUES (?)', (name,))
            return cursor.lastrowid or 0
    
    def get_sessions(self) -> List[Tuple]:
        with sqlite3.connect(self.db_path) as conn:
            return conn.execute(
                'SELECT id, name, created_at, updated_at FROM sessions ORDER BY updated_at DESC'
            ).fetchall()
    
    def delete_session(self, session_id: int):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('DELETE FROM messages WHERE session_id = ?', (session_id,))
            conn.execute('DELETE FROM research_data WHERE session_id = ?', (session_id,))
            conn.execute('DELETE FROM scripts WHERE session_id = ?', (session_id,))
            conn.execute('DELETE FROM sessions WHERE id = ?', (session_id,))
    
    def add_message(self, session_id: int, role: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                'INSERT INTO messages (session_id, role, content, metadata) VALUES (?, ?, ?, ?)',
                (session_id, role, content, json.dumps(metadata) if metadata else None)
            )
            conn.execute('UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', (session_id,))
    
    def get_messages(self, session_id: int) -> List[Tuple]:
        with sqlite3.connect(self.db_path) as conn:
            return conn.execute(
                'SELECT role, content, metadata, timestamp FROM messages WHERE session_id = ? ORDER BY timestamp',
                (session_id,)
            ).fetchall()
    
    def save_research(self, session_id: int, query: str, analysis: str, config_info: str) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                'INSERT INTO research_data (session_id, query, analysis, jsdoc) VALUES (?, ?, ?, ?)',
                (session_id, query, analysis, config_info)
            )
            return cursor.lastrowid or 0
    
    def get_research(self, session_id: int) -> List[Tuple]:
        with sqlite3.connect(self.db_path) as conn:
            return conn.execute(
                'SELECT query, analysis, jsdoc, created_at FROM research_data WHERE session_id = ? ORDER BY created_at DESC',
                (session_id,)
            ).fetchall()
    
    def save_script(self, session_id: int, name: str, script_type: str, content: str, 
                   file_path: Optional[str] = None, test_url: Optional[str] = None, test_result: Optional[str] = None) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                'INSERT INTO scripts (session_id, name, type, content, file_path, test_url, test_result) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (session_id, name, script_type, content, file_path, test_url, test_result)
            )
            return cursor.lastrowid or 0
    
    def get_scripts(self, session_id: int) -> List[Tuple]:
        with sqlite3.connect(self.db_path) as conn:
            return conn.execute(
                'SELECT name, type, content, file_path, test_url, test_result, created_at FROM scripts WHERE session_id = ? ORDER BY created_at DESC',
                (session_id,)
            ).fetchall()
