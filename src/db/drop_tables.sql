/* Drops all tables from database. */

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS ticket_log;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS solution;
DROP TABLE IF EXISTS handler;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS ticket_expertise;
DROP TABLE IF EXISTS expertise;
DROP TABLE IF EXISTS ticket_hardware;
DROP TABLE IF EXISTS ticket_software;
DROP TABLE IF EXISTS ticket_os;
DROP TABLE IF EXISTS hardware;
DROP TABLE IF EXISTS software;
DROP TABLE IF EXISTS os;
SET foreign_key_checks = 1;