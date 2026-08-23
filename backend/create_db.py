import psycopg

# Connect to the default 'postgres' database to create our new database
conn = psycopg.connect("postgresql://postgres:password@localhost:5432/postgres", autocommit=True)
try:
    conn.execute("CREATE DATABASE car_dealership")
    print("Successfully created database 'car_dealership'")
except Exception as e:
    print(f"Error or database already exists: {e}")
finally:
    conn.close()
