-- CREATE USER "cqdashboard" WITH PASSWORD 'PASSWORD';
-- CREATE DATABASE care_quality_dashboard OWNER "cqdashboard";

CREATE TYPE user_type AS ENUM ('unknown', 'platform_administrator', 'health_board', 'hospital', 'department_manager', 'clinician');

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    user_type user_type DEFAULT 'unknown'
);

CREATE TABLE clinician_join_codes (
    department_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL
);

CREATE TABLE department_join_codes (
    department_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL
);

CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    department_id INTEGER NOT NULL,
    is_mentoring_session BOOLEAN NOT NULL
);

CREATE TABLE scores (
    response_id INTEGER NOT NULL,
    standard_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (response_id, standard_id)
);

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    response_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    question_id INTEGER NOT NULL
);

CREATE TABLE standards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TYPE question_type AS ENUM ('likert_scale', 'words');

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    default_url TEXT NOT NULL,
    standard_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    type question_type NOT NULL,
    archived BOOLEAN DEFAULT FALSE
);

CREATE table question_urls (
    question_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    PRIMARY KEY (question_id, department_id)
);

CREATE TABLE hospitals (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    health_board_id INTEGER NOT NULL
);

CREATE TABLE health_boards (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    hospital_id INTEGER NOT NULL
);

CREATE TABLE feedback (
    user_id TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    comments TEXT,
    PRIMARY KEY (user_id, timestamp)
);

ALTER TABLE clinician_join_codes ADD FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE department_join_codes ADD FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE responses ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE responses ADD FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE scores ADD FOREIGN KEY (response_id) REFERENCES responses(id);
ALTER TABLE scores ADD FOREIGN KEY (standard_id) REFERENCES standards(id);

ALTER TABLE words ADD FOREIGN KEY (response_id) REFERENCES responses(id);
ALTER TABLE words ADD FOREIGN KEY (question_id) REFERENCES questions(id);

ALTER TABLE questions ADD FOREIGN KEY (standard_id) REFERENCES standards(id);

ALTER TABLE question_urls ADD FOREIGN KEY (question_id) REFERENCES questions(id);
ALTER TABLE question_urls ADD FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE hospitals ADD FOREIGN KEY (health_board_id) REFERENCES health_boards(id);

ALTER TABLE departments ADD FOREIGN KEY (hospital_id) REFERENCES hospitals(id);

ALTER TABLE feedback ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE feedback ADD FOREIGN KEY (department_id) REFERENCES departments(id);
