from datetime import datetime, timedelta
from config import config
import sqlite3

if not config.cleanup_enabled():
    print("Cleanup not enabled")
    exit()

# initialize database table
connection = sqlite3.connect(config.sqlite_file())
cursor = connection.cursor()
table_name = config.sqlite_table_name()

cleanup_before = datetime.now() - timedelta(
    days=config.cleanup_delta_days(), 
    hours=config.cleanup_delta_hours(), 
    minutes=config.cleanup_delta_minutes())

print(f"Removing all entries dating before {cleanup_before}")

try:
    cursor.execute(f"DELETE FROM {table_name} WHERE datetime < :cleanup_before", {"cleanup_before": cleanup_before})
    connection.commit()
    print(f"Removed {cursor.rowcount} entries")
    connection.close()
except (sqlite3.OperationalError) as error:
    print("Could not execute cleanup: " + error.args[0])
    connection.close()