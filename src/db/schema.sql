/* Defines schema for database. */

CREATE DATABASE IF NOT EXISTS teamb009;

CREATE TABLE IF NOT EXISTS hardware (
    hardware_id MEDIUMINT UNSIGNED,
    name VARCHAR(100),
    PRIMARY KEY (hardware_id)
);

CREATE TABLE IF NOT EXISTS software (
    software_id MEDIUMINT UNSIGNED,
    name VARCHAR(100),
    PRIMARY KEY (software_id)
);

CREATE TABLE IF NOT EXISTS os (
    os_id MEDIUMINT UNSIGNED,
    name VARCHAR(100),
    PRIMARY KEY (os_id)
);

CREATE TABLE IF NOT EXISTS employee (
    employee_id MEDIUMINT UNSIGNED,
    name VARCHAR(150),
    job VARCHAR(100),
    department VARCHAR(100), -- ??? seperate department table ???
    telephone CHAR(10),
    PRIMARY KEY (employee_id)  
);

CREATE TABLE IF NOT EXISTS handler (
    handler_id MEDIUMINT UNSIGNED,
    internal BOOLEAN,
    PRIMARY KEY (handler_id),  
    FOREIGN KEY (handler_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS account (
    user_id MEDIUMINT UNSIGNED,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS expertise (
    expertise_id MEDIUMINT UNSIGNED,
    name VARCHAR(100),
    PRIMARY KEY (expertise_id)
);

CREATE TABLE IF NOT EXISTS handler_expertise (
    handler_id MEDIUMINT UNSIGNED,
    expertise_id MEDIUMINT UNSIGNED,
    FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id),
    FOREIGN KEY (handler_id) REFERENCES handler(handler_id)
);


CREATE TABLE IF NOT EXISTS ticket (
    ticket_id MEDIUMINT UNSIGNED,
    employee_id MEDIUMINT UNSIGNED NOT NULL,
    status ENUM('active', 'submitted', 'closed', 'unsuccessful') NOT NULL, -- ??? seperate status table ???
    description VARCHAR(300),
    notes VARCHAR(1000),
    handler_id MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (handler_id) REFERENCES handler(handler_id)
);

CREATE TABLE IF NOT EXISTS ticket_log(
    log_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    update_date DATE NOT NULL,
    update_value VARCHAR(1000) NOT NULL, -- !!! ERROR !!!
    PRIMARY KEY (log_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
);

CREATE TABLE IF NOT EXISTS feedback(
    feedback_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    date DATE NOT NULL,
    feedback VARCHAR(1000) NOT NULL, -- ??? solution and solution id seperate table ???
    employee_id MEDIUMINT UNSIGNED,
    PRIMARY KEY (feedback_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id),
    FOREIGN KEY (employee_id) REFERENCES ticket(employee_id)
);

CREATE TABLE IF NOT EXISTS solution(
    solution_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    date DATE NOT NULL,
    solution VARCHAR(1000) NOT NULL, -- ??? solution and solution id seperate table ???
    solution_status ENUM('successful', 'pending', 'unsuccessful') NOT NULL,
    handler_id MEDIUMINT UNSIGNED,
    PRIMARY KEY (solution_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id),
    FOREIGN KEY (handler_id) REFERENCES handler(handler_id)
);

CREATE TABLE IF NOT EXISTS ticket_expertise (
    expertise_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id),
    FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id)
);

CREATE TABLE IF NOT EXISTS ticket_hardware (
    hardware_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    FOREIGN KEY (hardware_id) REFERENCES hardware(hardware_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
);

CREATE TABLE IF NOT EXISTS ticket_software (
    software_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    FOREIGN KEY (software_id) REFERENCES software(software_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
);

CREATE TABLE IF NOT EXISTS ticket_os (
    os_id MEDIUMINT UNSIGNED,
    ticket_id MEDIUMINT UNSIGNED,
    FOREIGN KEY (os_id) REFERENCES os(os_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
);
