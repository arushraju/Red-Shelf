CREATE TABLE Frustum_Database (
  --This will be the numeric id of the frustum
  frustum_id SERIAL PRIMARY KEY NOT NULL,

  --This will be the id of the div of the frustum
  frustum_div_id text NOT NULL,
  --This will be the Frustum Heading
  frustum_heading text NOT NULL,
  --This will be the content of the frustum (Not Neccessary)
  frustum_content text,

  --This will be the image of the frustum (Not Neccessary)
  frustum_image_url text,

  --This is the frustum object name (Neccessary) 
  frustum_mesh_name text NOT NULL,

  --This is the corresponding gsap name of the frustum
  frustum_gsap_name text
);

--Insert the data
INSERT INTO Frustum_Database
(frustum_div_id,frustum_heading,frustum_mesh_name,frustum_gsap_name)


VALUES
-- Outer Library
    ('Dustbin_1_Frustum','Dustbin','Dustbin_1','GSAP_0_14'),
    ('Dustbin_2_Frustum','Dustbin','Dustbin_2','GSAP_0_10'),
    ('Dustbin_3_Frustum','Dustbin','Dustbin_3','GSAP_0_2')
    ('Dustbin_4_Frustum','Dustbin','Dustbin_4','GSAP_0_12')
    ('Entrance_Library_Frustum','Library Entrance','Library_Entrance','GSAP_0_1')
    ('Entrance_1_Frustum','Entry Way 1','Entrance_1','GSAP_0_14'),
    ('Entrance_2_Frustum','Entry Way 2','Entrance_2','GSAP_0_13'),
    ('Entrance_3_Frustum','Entry Way 3','Entrance_3','GSAP_0_4'),
    ('Entrance_4_Frustum','Entry Way 4','Entrance_4','GSAP_0_3'),
    ('Entrance_5_Frustum','Entry Way 5','Entrance_5','GSAP_0_10'),
    ('Entrance_6_Frustum','Entry Way 6','Entrance_6','GSAP_0_11'),

--Ground Floor
    ('Kiosk_Frustum','Kiosk Machine','Kiosk_Frustum','GSAP_1_14'),
    ('Verification','Verification Desk','Security_Frustum','GSAP_1_4'),
    ('Baggage_Rack','Drop-off Room','Baggage_Rack','GSAP_1_5'),
    ('Reading_Room_Computers_Frustum','Reading Room Computers','Computer_Reading_Room_Frustum','GSAP_1_30'),
    ('Restricted_Room_Frustum','Room Unknown 1','Restricted_Room_Frustum','GSAP_1_29'),
    ('Drop_Box_1_Frustum','Drop Box Machine','Drop_Box_1_Frustum','GSAP_0_1'),
    ('Drop_Box_2_Frustum','Drop Box Machine','Drop_Box_2_Frustum','GSAP_1_24'),
    ('Computer_Desk_Frustum','Help Desk','Computer_Desk_Frustum','GSAP_1_7'),
    ('Female_Washroom_Frustum','Female Washroom (Ground Floor)','Female_Washroom_0_Frustum','GSAP_1_22'),
    ('Male_Washroom_0_Frustum','Male Washroom (Ground Floor)','Male_Washroom_0_Frustum','GSAP_1_21'),
    ('Water_0_Frustum','Potable Water','Water_0_Frustum','GSAP_1_32'),
    ('Reception_Frustum','Circulation Desk','Reception_Frustum','GSAP_1_17'),
    ('Seminar_Room_Frustum','Seminar Room','Seminar_Room_Frustum','GSAP_1_16'),
    ('Stationary_Shop_Frustum','Photocopy','Stationary_Shop_Frustum','GSAP_1_15'),
    ('Text_Books_Frustum','New Releases','Text_Books_Frustum','GSAP_1_25'),
    ('Lift_Frustum','Lift','Lift_Frustum','GSAP_1_23'),
    ('Dustbin_0_Frustum','Dustbin (Ground Floor)','Dustbin','GSAP_1_21'),
    ('AHU_Room_Frustum','AHU Room','AHU_Room_Frustum','GSAP_1_31'),
    ('Basement_Reading_Room_Frustum','Basement','Basement_Reading_Room_Frustum','GSAP_1_31'),

    --First Floor
    ('Lectern_1_Frustum','Lectern','Lectern_1_Frustum','GSAP_2_3'),
    ('Lectern_2_Frustum','Lectern','Lectern_2_Frustum','GSAP_2_4'),
    ('Lectern_3_Frustum','Lectern','Lectern_3_Frustum','GSAP_2_5'),
    ('Lectern_4_Frustum','Lectern','Lectern_4_Frustum','GSAP_2_5'),
    ('Computer_11_Frustum','Search Computer','Computer_11_Frustum','GSAP_2_12'),
    ('Computer_12_Frustum','Search Computer','Computer_12_Frustum','GSAP_2_13'),
    ('S_K_Vijaianand_Office_Frustum','Dr.S.K.Vijaianand','S_K_Vijaianand_Office_Frustum','GSAP_2_8'),
    ('Room_Frustum','Room Unknown 2','Room_Frustum','GSAP_2_15'),
    ('Water_1_Frustum','Potable Water','Water_1_Frustum','GSAP_2_9'),
    ('Male_Washroom_1_Frustum','Male Washroom (First Floor)','Male_Washroom_1_Frustum','GSAP_2_10'),
    ('Female_Washroom_1_Frustum','Female Washroom (First Floor)','Female_Washroom_1_Frustum','GSAP_2_17'),
    ('Lift_1_Frustum','Lift','Lift_1_Frustum','GSAP_2_17'),
    ('Server_Room_Frustum','Server Room','Server_Room_Frustum','GSAP_2_6'),

    --Second Floor
    ('Room301_Frustum','Room 301','Room301_Frustum','GSAP_3_8'),
    ('Srihari_KeshavMurthy_Frustum','Prof.Srihari KeshavMurthy','Srihari_KeshavMurthy_Frustum','GSAP_3_14'),
    ('Committe_Frustum','Comitte Room','Committe_Frustum','GSAP_3_9'),
    ('Library_Office_Frustum','Library Office','Library_Office_Frustum','GSAP_3_10'),
    ('Bound_Periodical_Frustum','Bound Periodic Frustum','Bound_Periodical_Frustum','GSAP_3_11'),
    ('Room307_Frustum','Room 307','Room307_Frustum','GSAP_3_12')
    ('Room308_Frustum','Room 308','Room308_Frustum','GSAP_3_13')
