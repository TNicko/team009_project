INSERT INTO hardware (hardware_serial, name)
VALUES ('G4G69-RJHCP-N3IZ3', 'Keyboard'),
       ('NKCQK-DNUII-90IY7', 'Keyboard'),
       ('09BL0-17EBV-6JXA6', 'Mouse'),
       ('ZLRRQ-UJEJ4-DDORT', 'Mouse'),
       ('N4F9Y-MO2LP-Y5KTK', 'Computer'),
       ('BU98S-FRHK2-KSO1Z', 'Computer'),
       ('ETA52-AMWB3-9QM68', 'Printer'),
       ('U8CHA-W2325-LQVGP', 'Printer'),
       ('7V5MM-5BK3H-2JWEW', 'Computer');

INSERT INTO software (software_serial, name)
VALUES ('05GZY-924YG-0LK7Z', 'Microsoft Teams'),
       ('D70AH-55WWF-LUDRC', 'Microsoft Excel'),
       ('T5E64-0CAQF-MQOW7', 'Microsoft Word'),
       ('8NOUB-YITFK-X3VHE', 'Adobe Photoshop'),
       ('EDH61-6SA0B-EGARB', 'Zoom'),
       ('XLJBP-ICLTH-G8YHW', 'AutoCAD'),
       ('5F2E4-7PHFB-OM1GY', 'Microsoft Powerpoint'),
       ('2Z79J-YZ6D9-T4HV9', 'Discord');

INSERT INTO os (os_serial, name)
VALUES ('V05GZ-Y924Y-G0LK7', 'Windows 8'),
       ('U2YAZ-F3BFC-KW6BD', 'Windows 11'),
       ('XDS93-19LVA-18OK5', 'Mac');

INSERT INTO user (user_id, name, job, department, telephone, account_type)
VALUES (1565, 'Joey Smith', 'Admin', 'IT', '0123456789', 'admin'),
       (2341, 'Alez Smith', 'Admin', 'Hardware', '0909898976', 'admin'),

       (5247, 'Tom Smith', 'Specialist', 'IT', '0123456789', 'specialist'),
       (5280, 'Joey John', 'Specialist', 'IT', '0123456789', 'specialist'),
       (1911, 'Arky Arek', 'Specialist', 'Hardware', '0909898976', 'specialist'),

       (3851, 'Keene Leni', 'External Specialist', NULL, '0134578998', 'external specialist'),
       (8850, 'Alex Myer', 'External Specialist', NULL, '0134578998', 'external specialist'),

       (4135, 'Jacob Smith', 'Analyst', 'Data Analysis', '2341879094', 'analyst'),
       (4100, 'Nickolai Johnson', 'Analyst', 'Data Analysis', '2341879094', 'analyst'),
       (4120, 'Ayman Ali', 'Analyst', 'Data Analysis', '2341879094', 'analyst'),

       (5177, 'Joey Thompson', 'Software Developer', 'IT', '0123456789', 'user'),
       (3629, 'Kiko Casilla', 'Software Test Engineer', 'IT', '0123456789', 'user'),
       (3975, 'Joey Kick', 'Hardware Engineer', 'Hardware', '0909898976', 'user'),
       (3166, 'Jadon Sancho', 'Network Engineer', 'Network', '0234528789', 'user'),
       (1111, 'Jay Abro', 'Project Manager', 'Operating', '1287987623', 'user'),
       (2222, 'Joe Gimson', 'Project Manager', 'Operating', '1287987623', 'user'),
       (3267, 'Jemimah Thompson', 'Project Management', 'Operating', '1287987623', 'user');


-- (1000, 'Mike James','Database Expert', 'Databases', '0123456789'),
-- (1011, 'Stevie Jam','HR Manager', 'HR','0123456789'),
-- (1096, 'Steven Lam','Marketing Manager', 'Marketing', '0123456789'),
-- (1511, 'Space Jam','SEO Specialist', 'Marketing','0123456789'),
-- (1400, 'Jimmy Butler','Product Manager', 'Product', '0123456789'),
-- (1681, 'Zion Williamson','Product Manager', 'Product','0123456789'),
-- (1760, 'Lonzo Ball','Software Engineer', 'IT', '0123456789'),
-- (1992, 'Lamelo Ball','Software Developer', 'IT','0123456789');

-- INSERT into handler 
-- VALUES (5247, 1),
-- 	(5280, 1),
-- 	(1911, 1),
--     (3851, 0),
--     (8850, 0);

-- BCRYPT HASH NEEDED FOR PASSWORD
INSERT INTO account (user_id, username, password)
VALUES (1565, 'admin1', '$2a$09$IRpqJiQa4zBdNxO25k5GV.QgO6qpLk/R2PC6Xszad3MtOpJkI5m1e'),
       (2341, 'admin2', '$2a$09$wnJaFVyuqjNzo2fbMkOQle3CtKJ5db7nURPLATgwBK3HjvOU0gfy.'),

       (5247, 'specialist1', '$2a$09$FJgzCpLWoJd8aS9FT9pLg.QoM2nh1Sb8bS0C78cwG.PM3rj84yW5K'),
       (5280, 'specialist2', '$2a$09$jDbiHX9HRt12DeMP8hPlqOrrm6ArkztYlqaD90/tPug...RVmUcqW'),
       (1911, 'specialist3', '$2a$09$vrnsXDPHH3ATEzKv/v.P..So6wafbwzzaULQAXp5TXvKdLAMchvGS'),

       (3851, 'ex_specialist1', '$2a$09$OBC.dRIsO9npg6o9yWTE1eH2DUwoO1UFprug2dL1gUw8W5BsRLQVW'),
       (8850, 'ex_specialist2', '$2a$09$2ADZ2yYvnNM6VXOhsH0E8eOfhjEofgGiAiT6iwtxLiBdY4EK8grLC'),

       (4135, 'analyst1', '$2a$09$EqQqvdcXEZ6OOa288Rs0G.Lv1RfquEN7OWrqTxty.eAntxqrR8T6m'),
       (4100, 'analyst2', '$2a$09$zriKgaOdjWW9kHugqpfCFeSUxq5sOU/4q/GPXRz7kjV58hWBxYPtS'),
       (4120, 'analyst3', '$2a$09$1V9tJLhifVMsBbjdbt9kwOrOb7VYoQGzXD6Z5gI2P5x4Rx2RbgW7K'),

       (5177, 'user1', '$2a$09$MA.Gf0vzxBfEjmYetjoIaO4gL9YclC/EXLQ9UJ8s99Vs50FlRxVkS'),
       (3629, 'user2', '$2a$09$r8IMrWLMFi9.vKRwRAjHYeyhsoqdwKYp3BYS2iHuu2yuMwDQcu7C.'),
       (3975, 'user3', '$2a$09$z/oRwnl97g4UeYds1u2JDO.DcJed4nxzCZFxiatCcU4Vbt97me2kG'),
       (3166, 'user4', '$2a$09$u/qeq9qpFl16drSDY4Y6pe55fApbBDz.rf9CLpV1AsxBnoVriTInO'),
       (1111, 'user5', '$2a$09$.e/Bf2vcpQ5zvXhXcBBc.ezooOb4kY/yC3K09NMsA59ERhfM84Dvi'),
       (2222, 'user6', '$2a$09$eik84n9obqokr2IIcEeqYOCadbM0L/NFI14YpBnS8jpkAtu07IUXm'),
       (3267, 'user7', '$2a$09$WKQUfScZvc2xF0IfoxiF7uKUK5P0Cv9No2BlB6rmgALSs4z/nNPg2');

INSERT INTO expertise (expertise_id, name)
VALUES (3, 'Hardware'),
       (1, 'Software'),
       (2, 'Network');

INSERT INTO handler_expertise (handler_id, expertise_id)
VALUES (5247, 3),
       (5280, 1),
       (5280, 2),
       (1911, 3),
       (1911, 1);
-- ??? Ex Spec expertise ???

INSERT INTO ticket (ticket_id, user_id, status, description, notes, handler_id, created_at)
VALUES (13, 5177, 'closed', 'Printer out of ink', NULL, 5247, '2022-01-01 20:10:00'),
       (1, 3629, 'closed', 'Mouse Bluetooth not connecting with Mac', NULL, 1911, '2022-01-01 20:10:00'),
       (2, 3975, 'closed', 'Adobe not working', NULL, 5280, '2022-01-01 20:10:00'),

       (3, 3166, 'submitted', 'Printer out of ink', 'Cannot find ink', 1911, '2022-01-01 20:10:00'),
       (4, 1111, 'active', 'Computer not turning on', 'Everything is plugged in', 5247, '2022-01-01 20:10:00'),
       (5, 2222, 'unsuccessful', 'Mouse Bluetooth not connecting with Mac', NULL, 1911, '2022-01-01 20:10:00'),
       (6, 3267, 'active', 'Adobe not working', 'Returns an error when trying to run', 5280, '2022-01-01 20:10:00'),
       (7, 5177, 'submitted', 'Keyboard not working', NULL, 5247, '2022-01-01 20:10:00'),
       (8, 3975, 'active', 'Cannot connect to internet', NULL, 5280, '2022-01-01 20:10:00'),
       (9, 2222, 'active', 'Mouse Bluetooth not connecting with Mac',
        'Bluetooth connection made but still no responsiveness', NULL, '2022-01-01 20:10:00'),
       (10, 3975, 'active', 'Cannot connect to internet', 'Wifi not showing up', NULL, '2022-01-01 20:10:00'),
       (11, 5177, 'active', 'Keyboard not working', NULL, NULL, '2022-01-01 20:10:00'),
       (12, 2222, 'active', 'Printer out of ink', 'Cannot find ink', NULL, '2022-01-01 20:10:00');

INSERT INTO ticket_log (log_id, ticket_id, update_date, update_type, update_value)
VALUES (3, 4, '2022-01-01 20:10:00', 'notes', 'Everything is plugged in'),
       (1, 6, '2022-01-01 20:10:00', 'handler', 'Joey John'),
       (2, 3, '2022-01-01 20:10:00', 'notes', 'Cannot find ink');

INSERT INTO feedback (feedback_id, ticket_id, datetime, feedback, user_id)
VALUES (1, 5, '2022-02-01 20:10:00', 'Mouse charged but connection still not working', 2222);

INSERT INTO solution (solution_id, ticket_id, datetime, solution_status, handler_id, solution)
VALUES (6, 13, '2022-01-01 20:10:00', 'successful', 5247, 'Insert more ink into printer'),
       (1, 1, '2022-02-01 20:10:00', 'successful', 1911, 'Select correct mouse from bluetooth list on mac'),
       (2, 2, '2022-02-01 20:10:00', 'successful', 5280, 'Login using new credentials'),
       (3, 3, '2022-02-02 20:10:00', 'pending', 1911, 'Get ink from storage room and replace in printer'),
       (4, 5, '2022-02-02 20:10:00', 'unsuccessful', 1911, 'Charge mouse and wait for bluetooth connection to appear'),
       (5, 7, '2022-02-02 20:10:00', 'pending', 5247, 'Plug keyboard into computer');

INSERT INTO ticket_expertise (expertise_id, ticket_id)
VALUES (3, 13),
       (3, 1),
       (1, 2),
       (3, 3),
       (3, 4),
       (3, 5),
       (1, 6),
       (3, 7),
       (2, 8),
       (3, 9),
       (2, 10),
       (3, 11),
       (3, 12);

INSERT INTO ticket_hardware (hardware_serial, ticket_id)
VALUES ('ETA52-AMWB3-9QM68', 13),
       ('09BL0-17EBV-6JXA6', 1),
       ('N4F9Y-MO2LP-Y5KTK', 1),
       ('BU98S-FRHK2-KSO1Z', 2),
       ('ETA52-AMWB3-9QM68', 3),
       ('BU98S-FRHK2-KSO1Z', 4),
       ('09BL0-17EBV-6JXA6', 5),
       ('N4F9Y-MO2LP-Y5KTK', 5),
       ('N4F9Y-MO2LP-Y5KTK', 6),
       ('NKCQK-DNUII-90IY7', 7),
       ('N4F9Y-MO2LP-Y5KTK', 8),
       ('09BL0-17EBV-6JXA6', 9),
       ('N4F9Y-MO2LP-Y5KTK', 9),
       ('BU98S-FRHK2-KSO1Z', 10),
       ('NKCQK-DNUII-90IY7', 11),
       ('U8CHA-W2325-LQVGP', 12);

INSERT INTO ticket_software (software_serial, ticket_id)
VALUES ('8NOUB-YITFK-X3VHE', 2),
       ('8NOUB-YITFK-X3VHE', 6);

INSERT INTO ticket_os (os_serial, ticket_id)
VALUES ('XDS93-19LVA-18OK5', 1);












