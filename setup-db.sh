#!/bin/bash

# Multiple databases script tweaked from https://github.com/mrts/docker-postgresql-multiple-databases
set -e
set -u

function create_database() {
	local database=$1
	echo "  Creating database '$database'"
	echo "SELECT 'CREATE DATABASE $database' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec" | psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    GRANT ALL PRIVILEGES ON DATABASE $database TO "$POSTGRES_USER";
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_database $db
	done
	echo "Multiple databases created"
fi

if [[ $POSTGRES_MULTIPLE_DATABASES == *"care_quality_dashboard"* ]]; then
	cat /docker-entrypoint-initdb.d/schema.txt | psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname care_quality_dashboard
fi;

# Create "test" user if we're creating "test" database
if [[ $POSTGRES_MULTIPLE_DATABASES == *"test"* ]]; then
echo "Updating test database";
psql --username "$POSTGRES_USER" test <<-EOSQL
		CREATE USER "test" WITH PASSWORD 'test';
		GRANT ALL PRIVILEGES ON DATABASE test TO test;
		ALTER DATABASE test OWNER TO test;
		ALTER SCHEMA public OWNER TO test;
EOSQL
fi;
