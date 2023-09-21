\echo 'Delete and recreate qreator db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE qreator;
CREATE DATABASE qreator;
\connect qreator

\i qreator-schema.sql

\echo 'Delete and recreate qreator_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE qreator_test;
CREATE DATABASE qreator_test;
\connect qreator_test

\i qreator-schema.sql
