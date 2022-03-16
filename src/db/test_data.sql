INSERT INTO hardware
VALUES ('G4G69-RJHCP-N3IZ3', 'Keyboard'),
       ('NKCQK-DNUII-90IY7', 'Keyboard'),
       ('09BL0-17EBV-6JXA6', 'Mouse'),
       ('ZLRRQ-UJEJ4-DDORT', 'Mouse'),
       ('N4F9Y-MO2LP-Y5KTK', 'Computer'),
       ('BU98S-FRHK2-KSO1Z', 'Computer'),
       ('ETA52-AMWB3-9QM68', 'Printer'),
       ('U8CHA-W2325-LQVGP', 'Printer'),
       ('7V5MM-5BK3H-2JWEW', 'Computer');

INSERT INTO software
VALUES ('05GZY-924YG-0LK7Z', 'Microsoft Teams'),
       ('D70AH-55WWF-LUDRC', 'Microsoft Excel'),
       ('T5E64-0CAQF-MQOW7', 'Microsoft Word'),
       ('8NOUB-YITFK-X3VHE', 'Adobe Photoshop'),
       ('EDH61-6SA0B-EGARB', 'Zoom'),
       ('XLJBP-ICLTH-G8YHW', 'AutoCAD'),
       ('5F2E4-7PHFB-OM1GY', 'Microsoft Powerpoint'),
       ('2Z79J-YZ6D9-T4HV9', 'Discord');
    
INSERT INTO os
VALUES ('V05GZ-Y924Y-G0LK7', 'Windows 8'),
       ('U2YAZ-F3BFC-KW6BD', 'Windows 11'),
       ('XDS93-19LVA-18OK5', 'Mac');

INSERT INTO employee
VALUES  (1565 , "Joey Smith", "Admin", 'IT', "0123456789"),
	(2341 , "Alez Smith", "Admin",'Hardware', "0909898976"),

	(5247 ,"Tom Smith",  "Specialist", 'IT', "0123456789"),
	(5280 , "Joey John","Specialist",'IT',  "0123456789"),
	(1911 , "Arky Arek","Specialist",'Hardware', "0909898976"),

	(4135, "Jacob Smith", "Analyst", "Data Analysis", "2341879094"),
	(4100, "Nickolai Johnson","Analyst", "Data Analysis", "2341879094"),
	(4120, "Ayman Ali","Analyst", "Data Analysis", "2341879094"),

	(5177 ,"Joey Thompson", "Software Developer",'IT',  "0123456789"),
	(3629 ,"Kiko Casilla", "Software Test Engineer",'IT', "0123456789"),
	(3975 ,"Joey Kick", "Hardware Engineer",'Hardware', "0909898976"),
	(3166 , "Jadon Sancho", "Network Engineer",'Network', "0234528789"),
	(1111,"Jay Abro", "Project Manager", "Operating", "1287987623"),
	(2222,"Joe Gimson","Project Manager", "Operating", "1287987623"),
	(3267, "Jemimah Thompson","Project Management", "Operating" , "1287987623");
	
	-- (1000, 'Mike James','Database Expert', 'Databases', "0123456789"),
	-- (1011, 'Stevie Jam','HR Manager', 'HR',"0123456789"),
	-- (1096, 'Steven Lam','Marketing Manager', 'Marketing', "0123456789"),
	-- (1511, 'Space Jam','SEO Specialist', 'Marketing',"0123456789"),
	-- (1400, 'Jimmy Butler','Product Manager', 'Product', "0123456789"),
	-- (1681, 'Zion Williamson','Product Manager', 'Product',"0123456789"),
	-- (1760, 'Lonzo Ball','Software Engineer', 'IT', "0123456789"),
	-- (1992, 'Lamelo Ball','Software Developer', 'IT',"0123456789");

INSERT into handler 
VALUES (5247, 1),
	(5280, 1),
	(1911, 1),
    (3851, 0),
    (8850, 0);

-- BCRYPT HASH NEEDED FOR PASSWORD
-- INSERT into account
-- VALUES (5247,"specialist1", ''),
--     (5280, "specialist2", ''),
--     (1911, "specialist3", ''),

--     (3851, "ex_specialist1", ''),
--     (8850, "ex_specialist2", ''),

--     (4135, "analyst1", ''),
--     (4100, "analyst2", ''),
--     (4120, "analyst3", ''),

-- 	(5177 , 'user1', ''),
-- 	(3629 , 'user2', ''),
-- 	(3975 , 'user3', ''),
-- 	(3166 , 'user4', ''),
-- 	(1111, 'user5', ''),
-- 	(2222, 'user6', ''),
-- 	(3267, 'user7', '');

INSERT into expertise
VALUES (0, 'Hardware'),
    (1, 'Software'),
    (2, 'Network');

INSERT into handler_expertise
VALUES (5247, 0),
    (5280, 1),
    (5280, 2),
    (1911, 0),
    (1911, 1);
-- ??? Ex Spec expertise ???

INSERT into ticket
VALUES (0, 5177, 'closed', 'Printer out of ink', null, 5247),
    (1, 3629, 'closed', 'Mouse Bluetooth not connecting with Mac', null, 1911),
    (2, 3975, 'closed', 'Adobe not working', null, 5280),

    (3, 3166, 'submitted', 'Printer out of ink', 'Cannot find ink', 1911),
    (4, 1111, 'active', 'Computer not turning on', 'Everything is plugged in', 5247),
    (5, 2222, 'unsuccessful', 'Mouse Bluetooth not connecting with Mac', null, 1911),
    (6, 3267, 'active', 'Adobe not working', 'Returns an error when trying to run', 5280),
    (7, 5177, 'submitted', 'Keyboard not working', null, 5247),
    (8, 3975, 'active', 'Cannot connect to internet', null, 5280),
    (9, 2222, 'active', 'Mouse Bluetooth not connecting with Mac', 'Bluetooth connection made but still no responsiveness', null),
    (10, 3975, 'active', 'Cannot connect to internet', 'Wifi not showing up', null),
    (11, 5177, 'active', 'Keyboard not working', null, null),
    (12, 2222, 'active', 'Printer out of ink', 'Cannot find ink', null);

INSERT into ticket_log
VALUES (0, 4, '2022-01-01 20:10:00', 'notes', 'Everything is plugged in'), 
    (1, 6, "2022-01-01 20:10:00", 'handler', 'Joey John'),
    (2, 3, "2022-01-01 20:10:00", 'notes', 'Cannot find ink');

INSERT into feedback
VALUES (0, 5, "2022-02-01 20:10:00", 'Mouse charged but connection still not working', 2222);

INSERT into solution
VALUES (0, 0, "2022-01-01 20:10:00", 'successful', 5247, 'Insert more ink into printer'),
    (1, 1, "2022-02-01 20:10:00", 'successful', 1911, 'Select correct mouse from bluetooth list on mac'),
    (2, 2, "2022-02-01 20:10:00", 'successful', 5280, 'Login using new credentials'),
    (3, 3, "2022-02-02 20:10:00", 'pending', 1911, 'Get ink from storage room and replace in printer'),
    (4, 5, "2022-02-02 20:10:00", 'unsuccessful', 1911, 'Charge mouse and wait for bluetooth connection to appear'),
    (5, 7, "2022-02-02 20:10:00", 'pending', 5247, 'Plug keyboard into computer');

INSERT into ticket_expertise
VALUES (0, 0),
    (0, 1),
    (1, 2),
    (0 ,3),
    (0 ,4),
    (0 ,5),
    (1 ,6),
    (0 ,7),
    (2 ,8),
    (0 ,9),
    (2 ,10),
    (0 ,11),
    (0 ,12);

INSERT into ticket_hardware
VALUES ('ETA52-AMWB3-9QM68', 0),
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

INSERT into ticket_software
VALUES ('8NOUB-YITFK-X3VHE', 2),
    ('8NOUB-YITFK-X3VHE' ,6);

INSERT into ticket_os
VALUES ('XDS93-19LVA-18OK5', 1);












