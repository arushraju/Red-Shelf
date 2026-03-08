//-------------IMPORTS---------------//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'; //To render the outline
import { Reflector } from 'three/addons/objects/Reflector.js'; //To render the reflection of the windows (Glass)

let camera, controls, scene, renderer;

//---------- APPLICATION FLOW ---------//
//This variable will guide us about the application flow
let application_flow = 0;
let previuos_application_flow = 0;

function tellApplicationFlow(){
    if(application_flow === 0){console.log('You are in the "Main Menu"');}
    else if(application_flow === 1){console.log('You are in the "Explore Floor Mode"');}
    else if(application_flow === 1.1){console.log('You are in the "Explore GSAP Mode"');}

    else if(application_flow === 2){console.log('You are in "Search Menu"');}
    else if(application_flow === 2.1){console.log('You are in "Books Journal Search Menu"');}
    else if(application_flow === 2.2){console.log('You are in "Quick Search"');}
    else if(application_flow === 2.3){console.log('You are in "Locate Manually Search"');}
    else if(application_flow === 2.4){console.log('You are in "Starting Point Search"');}
    else if(application_flow == 2.5){console.log('You are in "Location Shown (Floor Mode)"');}
    else if(application_flow == 2.6){console.log('You are in "Location Shown (GSAP Mode)"');}

    else if(application_flow == 3){console.log('You are in "Crowd Analytics Mode (Floor Mode)"');}
    
    //Finally we could return the current application flow variable
    return application_flow;
}


//------------- A STAR ALGORITHM -------------//
let starting_location;//This will store the name of GSPA at the start
let ending_location; //This will store the name of GSAP at the destination.


//Remember to make the arrange the edges and neighbouring nodes in the same order
function makeGrid(model){
    const grid = { 
        //Outer Floor
        "GSAP_0_1" : makeGridObejct(model,'GSAP_0_1',['Edge_0_1','Edge_0_3','Edge_0_11','Edge_0_2'],['GSAP_1_4','GSAP_0_2','GSAP_0_7','GSAP_0_11']),
        "GSAP_0_2" : makeGridObejct(model,'GSAP_0_2',['Edge_0_3','Edge_0_4'],['GSAP_0_1','GSAP_0_3']),
        "GSAP_0_3" : makeGridObejct(model,'GSAP_0_3',['Edge_0_4'],['GSAP_0_2']),
        "GSAP_0_4" : makeGridObejct(model,'GSAP_0_4',['Edge_0_5'],['GSAP_0_5']),
        "GSAP_0_5" : makeGridObejct(model,'GSAP_0_5',['Edge_0_6','Edge_0_5'],['GSAP_0_6','GSAP_0_4']),
        "GSAP_0_6" : makeGridObejct(model,'GSAP_0_6',['Edge_0_7','Edge_0_6'],['GSAP_0_7','GSAP_0_5']),
        "GSAP_0_7" : makeGridObejct(model,'GSAP_0_7',['Edge_0_11','Edge_0_7','Edge_0_12','Edge_0_8'],['GSAP_0_1','GSAP_0_6','GSAP_0_12','GSAP_0_8']),
        "GSAP_0_8" : makeGridObejct(model,'GSAP_0_8',['Edge_0_8','Edge_0_9'],['GSAP_0_7','GSAP_0_9']),
        "GSAP_0_9" : makeGridObejct(model,'GSAP_0_9',['Edge_0_9','Edge_10'],['GSAP_0_8','GSAP_0_10']),
        "GSAP_0_10" : makeGridObejct(model,'GSAP_0_10',['Edge_0_10'],['GSAP_0_9']),
        "GSAP_0_11" : makeGridObejct(model,'GSAP_0_11',['Edge_0_2'],['GSAP_0_1']),
        "GSAP_0_12" : makeGridObejct(model,'GSAP_0_12',['Edge_0_12','Edge_0_13','Edge_0_14'],['GSAP_0_7','GSAP_0_13','GSAP_0_14']),

        //Ground Floor
        "GSAP_1_4" : makeGridObejct(model,'GSAP_1_4',['Edge_1_1','Edge_1_2'],['GSAP_1_5','GSAP_1_6']),
        "GSAP_1_6" : makeGridObejct(model,'GSAP_1_6',['Edge_1_2','Edge_1_3','Edge_1_48','Edge_1_18','Edge_1_19','Edge_1_20'],['GSAP_1_7','GSAP_1_13','GSAP_1_24','GSAP_1_4']),
        "GSAP_1_7" : makeGridObejct(model,'GSAP_1_7',['Edge_1_3','Edge_1_4'],['GSAP_1_6','GSAP_1_7']),
        "GSAP_1_13" : makeGridObejct(model,'GSAP_1_13',['Edge_1_4','Edge_1_5','Edge_1_7','Edge_1_8','Edge_1_9','Edge_1_10','Edge_1_11','Edge_1_12','Edge_1_48'],['GSAP_1_7','GSAP_1_14','GSAP_1_15','GSAP_1_16','GSAP_1_17','GSAP_1_19','GSAP_1_20','GSAP_1_25','GSAP_1_6']),
        "GSAP_1_15" : makeGridObejct(model,'GSAP_1_15',['Edge_1_6','Edge_1_7','Edge_1_17','Edge_1_16','Edge_1_13'],['GSAP_1_14','GSAP_1_13','GSAP_1_20','GSAP_1_19','GSAP_1_16']),
        "GSAP_1_16" : makeGridObejct(model,'GSAP_1_16',['Edge_1_13','Edge_1_8','Edge_1_14'],['GSAP_1_15','GSAP_1_13','GSAP_1_17']),
        "GSAP_1_17" : makeGridObejct(model,'GSAP_1_17',[`Edge_1_14`,'Edge_1_9','Edge_1_15'],['GSAP_1_16','GSAP_1_13','GSAP_1_19']),
        "GSAP_1_5" : makeGridObejct(model,'GSAP_1_15',[`Edge_1_1`],['GSAP_1_4']),
        "GSAP_1_19" : makeGridObejct(model,'GSAP_1_19',[`Edge_1_10`,'Edge_1_16','Edge_1_15',`Edge_1_24`,'Edge_1_35','Edge_1_34',`Edge_1_32`,'Edge_1_30','Edge_1_36'],['GSAP_1_13','GSAP_1_15','GSAP_1_17','GSAP_1_18','GSAP_1_32','GSAP_1_21','GSAP_1_22','GSAP_1_23','GSAP_1_20']),
        "GSAP_1_14" : makeGridObejct(model,'GSAP_1_14',[`Edge_1_5`,'Edge_1_6'],['GSAP_1_13','GSAP_1_15']),
        "GSAP_1_20" : makeGridObejct(model,'GSAP_1_20',[`Edge_1_48`,'Edge_1_37','Edge_1_11','Edge_1_17','Edge_1_36'],['GSAP_1_33','GSAP_1_25','GSAP_1_13','GSAP_1_15','GSAP_1_19']),
        "GSAP_1_18" : makeGridObejct(model,'GSAP_1_18',[`Edge_1_24`,'Edge_1_31','Egde_1_33','Edge_1_26','Edge_1_25'],['GSAP_1_19','GSAP_1_23','GSAP_1_22','GSAP_1_21','GSAP_1_32']),
        "GSAP_1_32" : makeGridObejct(model,'GSAP_1_32',[`Edge_1_25`,'Edge_1_35','Edge_1_47','Edge_1_27'],['GSAP_1_18','GSAP_1_19','GSAP_1_23','GSAP_1_21']),
        "GSAP_1_21" : makeGridObejct(model,'GSAP_1_21',[`Edge_1_27`,'Edge_1_26','Edge_1_34','Edge_1_46','Edge_1_28'],['GSAP_1_32','GSAP_1_18','GSAP_1_19','GSAP_1_23','GSAP_1_22','GSAP_1_21']),
        "GSAP_1_22" : makeGridObejct(model,'GSAP_1_22',[`Edge_1_28`,'Edge_1_33','Egde_1_32','Edge_1_29'],['GSAP_1_21','GSAP_1_18','GSAP_1_19','GSAP_1_23']),
        "GSAP_1_23" : makeGridObejct(model,'GSAP_1_23',[`Edge_1_29`,'Edge_1_46','Edge_1_47','Edge_1_31','Edge_1_30'],['GSAP_1_22','GSAP_1_21','GSAP_1_32','GSAP_1_18','GSAP_1_19']),
        "GSAP_1_33" : makeGridObejct(model,'GSAP_1_33',[`Edge_1_48`,'Edge_2_1'],['GSAP_1_20','GSAP_2_1']),
        "GSAP_1_25" : makeGridObejct(model,'GSAP_1_25',['Edge_1_37','Edge_1_12','Edge_1_18','Edge_1_23','Edge_1_21'],['GSAP_1_20','GSAP_1_13','GSAP_1_6','GSAP_1_26','GSAP_1_24']),
        "GSAP_1_24" : makeGridObejct(model,'GSAP_1_24',[`Edge_1_21`,'Edge_1_19','Edge_1_22'],['GSAP_1_25','GSAP_1_6','GSAP_1_26']),
        "GSAP_1_26" : makeGridObejct(model,'GSAP_1_26',['Edge_1_38',`Edge_1_22`,'Edge_1_23','Edge_1_20'],['GSAP_1_27','GSAP_1_24','GSAP_1_25','GSAP_1_6']),
        "GSAP_1_27" : makeGridObejct(model,'GSAP_1_27',[`Edge_1_38`,'Edge_1_43','Edge_1_42','Edge_1_40'],['GSAP_1_26','GSAP_1_30','GSAP_1_28','GSAP_1_29']),
        "GSAP_1_30" : makeGridObejct(model,'GSAP_1_30',[`Edge_1_43`,'Edge_1_44'],['GSAP_1_27','GSAP_1_28']),
        "GSAP_1_28" : makeGridObejct(model,'GSAP_1_28',[`Edge_1_42`,'Edge_1_41','Edge_1_45','Edge_1_44'],['GSAP_1_27','GSAP_1_29','GSAP_1_31','GSAP_1_30']),
        "GSAP_1_29" : makeGridObejct(model,'GSAP_1_29',[`Edge_1_40`,'Edge_1_41'],['GSAP_1_27','GSAP_1_28']),
        "GSAP_1_31" : makeGridObejct(model,'GSAP_1_31',[`Edge_1_45`],['GSAP_1_28']),

        //First Floor
        "GSAP_2_1" : makeGridObejct(model,'GSAP_2_1',[`Edge_2_1`,'Edge_2_2'],['GSAP_1_33','GSAP_2_2']),
        "GSAP_2_2" : makeGridObejct(model,'GSAP_2_2',[`Edge_2_2`,'Edge_2_3','Edge_2_6','Edge_2_12','Edge_2_13','Edge_2_20','Edge_2_18'],['GSAP_2_1','GSAP_2_4','GSAP_2_3','GSAP_2_5','GSAP_2_6','GSAP_2_12','GSAP_2_11']),
        "GSAP_2_3" : makeGridObejct(model,'GSAP_2_3',[`Edge_2_6`,'Edge_2_5','Edge_2_10','Edge_2_11'],['GSAP_2_2','GSAP_2_4','GSAP_2_5','GSAP_2_6']),
        "GSAP_2_4" : makeGridObejct(model,'GSAP_2_4',[`Edge_2_5`,'Edge_2_8','Edge_2_7','Edge_2_3'],['GSAP_2_3','GSAP_2_5','GSAP_2_6','GSAP_2_2']),
        "GSAP_2_5" : makeGridObejct(model,'GSAP_2_5',[`Edge_2_8`,'Edge_2_10','Edge_2_12','Edge_2_9'],['GSAP_2_4','GSAP_2_3','GSAP_2_2','GSAP_2_6']),
        "GSAP_2_6" : makeGridObejct(model,'GSAP_2_6',[`Edge_2_14`,'Edge_2_7','Edge_2_9','Edge_2_11','Edge_2_13'],['GSAP_2_7','GSAP_2_4','GSAP_2_5','GSAP_2_3','GSAP_2_2']),
        "GSAP_2_7" : makeGridObejct(model,'GSAP_2_7',[`Edge_2_14`,'Edge_2_15','Edge_2_16','Edge_2_17','Edge_2_30','Edge_2_23'],['GSAP_2_6','GSAP_2_8','GSAP_2_9','GSAP_2_10','GSAP_2_15','GSAP_3_1']),
        "GSAP_2_8" : makeGridObejct(model,'GSAP_2_8',[`Edge_2_15`,'Edge_2_24','Edge_2_25','Edge_2_26'],['GSAP_2_7','GSAP_2_15','GSAP_2_10','GSAP_2_9']),
        "GSAP_2_9" : makeGridObejct(model,'GSAP_2_9',['Edge_2_16',`Edge_2_26`,'Edge_2_29','Edge_2_27'],['GSAP_2_7','GSAP_2_8','GSAP_2_15','GSAP_2_10']),
        "GSAP_2_10" : makeGridObejct(model,'GSAP_2_10',[`Edge_2_17`,'Edge_2_27','Edge_2_25','Edge_2_28'],['GSAP_2_7','GSAP_2_9','GSAP_2_8','GSAP_2_15']),
        "GSAP_2_15" : makeGridObejct(model,'GSAP_2_15',[`Edge_2_30`,'Edge_2_28','Edge_2_24','Edge_2_29'],['GSAP_2_7','GSAP_2_10','GSAP_2_8','GSAP_2_9']),
        "GSAP_2_11" : makeGridObejct(model,'GSAP_2_11',[`Edge_2_18`,'Edge_2_31','Edge_2_19'],['GSAP_2_2','GSAP_2_16','GSAP_2_12']),
        "GSAP_2_12" : makeGridObejct(model,'GSAP_2_12',[`Edge_2_19`,'Edge_2_20','Edge_2_21'],['GSAP_2_11','GSAP_2_2','GSAP_2_13']),
        "GSAP_2_13" : makeGridObejct(model,'GSAP_2_13',['Edge_2_21','Edge_2_22'],['GSAP_2_12','GSAP_2_14']),
        "GSAP_2_14" : makeGridObejct(model,'GSAP_2_14',['Edge_2_22'],['GSAP_2_13']),
        "GSAP_2_16" : makeGridObejct(model,'GSAP_2_16',['Edge_2_31'],['GSAP_2_11']),
        //Books Shelf GSAP


        //Second Floor
        "GSAP_3_1" : makeGridObejct(model,'GSAP_3_1',['Edge_2_23','Edge_3_1'],['GSAP_2_7','GSAP_3_2']),
        "GSAP_3_2" : makeGridObejct(model,'GSAP_3_2',['Edge_3_2','Edge_3_1'],['GSAP_3_3','GSAP_3_1']),
        "GSAP_3_3" : makeGridObejct(model,'GSAP_3_3',['Edge_3_2','Edge_3_3','Edge_3_4','Edge_3_5','Edge_3_6'],['GSAP_3_2','GSAP_3_4','GSAP_3_5','GSAP_3_6','GSAP_3_7']),
        "GSAP_3_4" : makeGridObejct(model,'GSAP_3_4',['Edge_3_3'],['GSAP_3_3']),
        "GSAP_3_5" : makeGridObejct(model,'GSAP_3_5',['Edge_3_4'],['GSAP_3_3']),
        "GSAP_3_6" : makeGridObejct(model,'GSAP_3_6',['Edge_3_5'],['GSAP_3_3']),
        "GSAP_3_7" : makeGridObejct(model,'GSAP_3_7',['Edge_3_6'],['GSAP_3_3']),
    }

    return grid;
}


//After filling the names of all the nodes and edges we will form the directionality of the graph
let grid = {}

function makeGridObejct(model,name,edges,nearNodes){

    //This will store the edges objects
    const edgeObject = [];
    edges.forEach((child)=>{
        edgeObject.push(model.getObjectByName(child));
    });

    //This will store the curretn GSAP
    const object = model.getObjectByName(name);

    //This will store the Neighbouring GSAP
    const object_neighbour =[];
    nearNodes.forEach((child)=>{
        object_neighbour.push(model.getObjectByName(child));
    })

    let answer = {
        name : name,
        edges : edges,
        nearNodes : nearNodes,
        mesh : object,
        edge_mesh : edgeObject,
        neighbour_mesh : object_neighbour,
    }
    
    return answer;
}

// This will be an array of object that will have the key containign the node (gird type) and the weight (Edge_lenght)
const priority_queqe_cards = [];
//This will store the names of mesh that the algorithm has visited
const visited_node = [];

/**
 * Function takes Starting and Ending Node of grid and returns the object containing the information about the Edges and Nodes and GSAP in Squence to connect the Two Points.
 * @param {string} starting_location - Name of the Node at the Starting location
 * @param {string} ending_location - Name of the Node at the Ending Location.
 */
function a_star_init(starting_location,ending_location){
    priority_queqe_cards.length = 0;
    visited_node.length = 0;
    // Starting and Ending must have some name from the grid object
    const starting_object = grid[starting_location];
    const ending_object = grid[ending_location];

    visited_node.push(starting_object.name);

    let initial_card = {
        node : starting_object,
        edge_lenght : 0,
        path_array : [starting_object.name],
    }
    //Then pass the starting grid object along with the parent edge lenght
    return a_star_algorithm(initial_card.node,ending_object,initial_card.edge_lenght,initial_card.path_array);
}

/**This is the main recursion function */
function a_star_algorithm(current_node,destination_node,edge_lenght,path){

    //We will first check if we are dealing with the destination node
    if(current_node.name === destination_node.name){
        return path;
    }

    // Find the neighbours of current node
    current_node.neighbour_mesh.forEach((child)=>{
        if(!visited_node.includes(child.name)){
            // Get the lenght of the edge
            let lenght = A_to_B_Distance(child,current_node.mesh,1) + edge_lenght;

            //console.log(`Current_Child = ${current_node.name} | child name is ${child.name} | lenght = ${lenght}`);

            let card = {
                node : grid[child.name],
                edge_lenght : lenght,
                //maintain an array that contains the information about the path travelled
                path_array : [...path,child.name]
            }

            //And then push this into the priority qeuqe
            priority_queqe_cards.push(card);
        };
    })

    //Now once all the neighbours are put into the priority card we can now pick the item from the priority with minimum edge length
    let edge = [];
    priority_queqe_cards.forEach((child)=>{edge.push(child.edge_lenght);})
    let min_edge = Math.min(...edge);
    let next_node = null;

    //console.log(`At the tiem when current child is ${current_node.name} | priority queue is ${priority_queqe_cards}`);

    //Select the Card with minimum edge lenght.
    priority_queqe_cards.forEach((child)=>{
        
        if(child.edge_lenght === min_edge){
            //When the child is with minimum edge lenght
            let index = priority_queqe_cards.indexOf(child);
            //Pop it out of the priority queue.
            if(index !== -1){
                priority_queqe_cards.splice(index,1);
            }
            //Store that child in this variable named next node.
            /**
             * child = {
                    node : grid[child.name],
                    edge_lenght : lenght,
                    path_array : [...path,child.name]
             * }
             */
            next_node = child;

            //And push this to the visited node's name
            visited_node.push(next_node.node.name);
        }
    });

    // And now we will again call this function but with the current node equal to next_node.node, and edge_lenght of next_node.edge_lenght
    return a_star_algorithm(next_node.node,destination_node,next_node.edge_lenght,next_node.path_array);;
}

/**
 * This function will be used to find the distance between the two nodes A and B. Enter the object itself
 * @param {*} A_node - This is the name of one GSAP 
 * @param {*} B_node - This is the name of another GSAP
 * Penalty will be equal to 1 for now.
 */
function A_to_B_Distance(A_node,B_node,penalty){
    //If they are the same object then return 0
    if(A_node.name == B_node.name){return 0;}

    // And then find the distance between them
    let position1 = new THREE.Vector3();
    let position2 = new THREE.Vector3();

    A_node.getWorldPosition(position1);
    B_node.getWorldPosition(position2);

    //And now find the distance ebtween them
    let distance = Math.sqrt( Math.pow(( (position1.x - position2.x) ) ,2) + Math.pow(( position1.y - position2.y ) , 2) + Math.pow( ( position1.z  - position2.z) , 2));
    let weight = distance * penalty;

    return weight;
}

//For the frustum
const popup_name = ["Stationary_Shop", "Seminar_Room" , "Reception" , "Computer" , 'Kiosk','Drop_Box_1','Drop_Box_2','Security','Text_Books','Reading_Room'];
const entrancePopup_name = ['Entrance_1','Entrance_2','Entrance_3','Entrance_4'];

const popup_objects = [];
const entrance_popup_object = [];


//------------------GSAP, EDGES, NODES CATEGORIES------------------//

// gsap
const outer_GSAP = [];
const first_floor_GSAP = [];
const ground_floor_GSAP = [];
const second_floor_GSAP = [];

const outer_GSAP_object = [];
const first_floor_GSAP_object = [];
const ground_floor_GSAP_object = [];
const second_floor_GSAP_object = [];

//Filling the Ground, First and Second Floor GSAP
for(let floor = -1 ; floor <= 2 ; floor++){
    //Filling the GSAP of Outer Library
    if(floor == -1){
        for(let i = 1 ;i <= 14; i++){
            outer_GSAP.push(`GSAP_${floor+1}_${i}`);
        }
    }
    //Filling the GSAP of Ground Floor
    else if(floor == 0){
        for(let i = 4 ;i <= 33; i++){
            ground_floor_GSAP.push(`GSAP_${floor+1}_${i}`);
        }
    }
    //Filling the GSAP of First flor
    else if(floor == 1){
        for(let i = 1 ;i <= 16; i++){
            first_floor_GSAP.push(`GSAP_${floor+1}_${i}`);
        }
    } else if(floor == 2){
        for(let i = 1 ;i <= 7; i++){
            second_floor_GSAP.push(`GSAP_${floor+1}_${i}`);
        }
    }
}

//Also add the first floor GSAP with books depending on thier nomenclature
const first_floor_part_A_gsap = [];
const first_floor_part_B_gsap = [];
const first_floor_part_C_gsap = [];
const first_floor_part_D_gsap = [];


for(let i=1 ; i<=63 ; i++){
    let part_gsap;
    if(i >= 1 && i <= 5){
        part_gsap = first_floor_part_A_gsap;
    }
    else if(i >= 13 && i <= 19){
        part_gsap = first_floor_part_B_gsap;
    }
    else if(i >= 21 && i <= 30){
        part_gsap = first_floor_part_C_gsap;
    }
    else if(i >= 47 && i <= 63){
        part_gsap = first_floor_part_D_gsap;
    }

    if(part_gsap){
        part_gsap.push(`GSAP_T_${i}`);
    }
}

const first_floor_bookshelf_gsap = [...first_floor_part_A_gsap,...first_floor_part_B_gsap,...first_floor_part_C_gsap,...first_floor_part_D_gsap];
const first_floor_bookshelf_gsap_objects = [];
//Update the Second Floor GSAP
first_floor_GSAP.push(...first_floor_bookshelf_gsap);

//All the GSAPs
const allGsap = [...outer_GSAP,...ground_floor_GSAP,...first_floor_GSAP,...second_floor_GSAP,];
const allGSAP_object = [];


//edges
const outer_edges = [];
const ground_floor_edges = [];
const first_floor_edges = [];
const second_floor_edges = [];

//Filling the edge names
for(let floor = -1; floor <= 2; floor++){
    //Fill the outer edges 
    if(floor == -1){
        for(let i = 1 ; i <= 14; i++){
            outer_edges.push(`Edge_${floor + 1}_${i}`);
        }
    }

    //Fill the ground floor edges
    else if(floor == 0){
        for(let i = 0 ; i <= 49; i++){
            ground_floor_edges.push(`Edge_${floor + 1}_${i}`);
        }
    }
    //Fill the First Floor Edges
    else if(floor == 1){
        for(let i = 1 ; i<= 31 ; i ++){
            first_floor_edges.push(`Edge_${floor+1}_${i}`);
        }
    }
    //Fill the Second Floor Edges
    else if(floor == 2){
        for(let i = 1 ; i <= 6 ; i ++){
            second_floor_edges.push(`Edge_${floor+1}_${i}`);
        }
    }
}

const all_edges = [...outer_edges,...ground_floor_edges,...first_floor_edges,...second_floor_edges];

/**
 * This function will enlarge or shrink the Edges of a particular Floor
 * @param {*} model - gltf.scene
 * @param {number} floor - FLoor Number (-1,0,1,2) 
 * @param {boolean} targetted - true if the edges are in path, false if all gsap is targetted.
 * @param {boolean} makeVisible - True to Enlarge, False to Shrink
 */
function controlEdgesNodes(model,floor,targetted,makeVisible){
    let scale;
    if(makeVisible) scale = 1;
    else scale = 0;

    let floor_edge;
    switch (floor) {
        case -1 :
            floor_edge = outer_edges;
            break;
        case 0 :
            floor_edge = ground_floor_edges;
            break;
        case 1 :
            floor_edge = first_floor_edges;
            break
        case 2 :
            floor_edge = second_floor_edges;
            break;
        default:
            floor_edge = all_edges;
            break;
    }

    //If the edges at the path has to be controlled
    if(targetted){
    } else {
        //Edges and Ndoe of the outer library
        model.traverse((child)=>{
            if(floor_edge.includes(child.name)){
                gsap.to(
                    child.scale,
                    {
                        x:  scale,
                        y : scale,
                        z : scale,
                        duration : 1,
                    }
                )
            }
        });
    }
}

/**
 * This function could be used to control, the scale of gsap
 * @param {*} model - gltf.scene
 * @param {number} floor - FLoor Number (-1,0,1,2) for floor specific and -2 for all gsap
 * @param {boolean} targetted - true if the gsap are in path, false if all gsap is targetted.
 * @param {boolean} makeVisible - true when the need to enlarge. False when need to shrink
 */
function enlargeGSAP(model,floor,targetted,makeVisible){
    //Adjust the scale of the gsap
    let scale;
    if(makeVisible){scale = 1;}
    else scale = 0;

    let floor_gsap;
    switch (floor) {
        case -1 :
            floor_gsap = outer_GSAP;
            break;
        case 0 :
            floor_gsap = ground_floor_GSAP;
            break;
        case 1 :
            floor_gsap = first_floor_GSAP;
            break
        case 2 :
            floor_gsap = second_floor_GSAP;
            break;
        default:
            floor_gsap = allGsap;
            break;
    }

    //If the targeted gsap has to be activated.
    if(targetted){
        model.traverse((child)=>{
            //This will be important when application flow is equal to 2.5 and 2.6
            if(path_gsap.includes(child.name) && floor_gsap.includes(child.name)){
                gsap.to(
                    child.scale,
                    {
                        x : scale,
                        y : scale,
                        z : scale,
                        duration : 1
                    }
                )
            }
        })
    } 
    //If all the gsap has to be changed.
    else {
        model.traverse((child)=>{
            if(floor_gsap.includes(child.name)){
                if(child.name !== ending_location){
                    gsap.to(
                        child.scale,
                        {
                            x : scale,
                            y : scale,
                            z : scale,
                            duration : 1
                        }
                    )
                }
                
            }
        })
    }
}



//---------------------LIBRARY FLOOR DISPLAY ---------------------//

//Basement Floor (Cube1626, Cube1626_1....Cube1626_4)
const basement_floor_library_child = [];
basement_floor_library_child.push('Cube1626');
for (let i = 1; i <= 4;i++){ basement_floor_library_child.push(`${basement_floor_library_child[0]}_${i}`); }

// Ground Floor (Cube613, Cube613_1 to Cube613_8)
const ground_floor_library_child = [];
ground_floor_library_child.push('Cube613');
for (let i = 1; i <= 8;i++){ ground_floor_library_child.push(`${ground_floor_library_child[0]}_${i}`); }

// First Floor (Cube1178, Cube1178_1.....Cube1178_6)
const first_floor_library_child = [];
first_floor_library_child.push('Cube041');
for (let i = 1; i <= 7;i++){ first_floor_library_child.push(`${first_floor_library_child[0]}_${i}`); }

// Second Floor (Cube1178, Cube1178_1 ... Cube1178_6)
const second_floor_library_child = [];
second_floor_library_child.push('Cube1178');
for (let i = 1; i <= 6;i++){ second_floor_library_child.push(`${second_floor_library_child[0]}_${i}`); }

// Wall of the Library
const wall_library = [];
wall_library.push('Cube018');
for (let i = 1; i <= 6;i++){ wall_library.push(`${wall_library[0]}_${i}`);}

// Ground to First Stairs
const ground_to_first_stair = 'Ground_First_StairCase';

//First to Second Stairs
const first_to_second_stairs = 'First_Second_Stairs';

//This contains everything inside the library (All material of all the parts of library)
const library_child = [
    'Reflectors',
    ...basement_floor_library_child,
    ...ground_floor_library_child,
    ...first_floor_library_child,
    ...second_floor_library_child,
    ...wall_library
];

//Unclickable Objects in the scene
const unclickables = [
    'Cycle',
    'Cycle_Stand',
    'First_Floor_Table_Instance',
    'Ground_Floor_Table_Instance',
    ...library_child, //Spread Operator
    ground_to_first_stair,
    first_to_second_stairs
];


// These functions will allow us to change the opcaity of the different parts fo the library
function makeVisible(floor){
    //If the user wants to make ground floor visible (Make the scale of first floor, booklshelves, and the second floor to zero)
    if(floor == 'Basement_Floor'){
        model.traverse((child)=>{
            //Second floor | First Floor | First Floor Bookshelf | First Floor Tables | Wall of the library will disppear
            if(
                second_floor_library_child.includes(child.name) ||
                first_floor_library_child.includes(child.name) ||
                ground_floor_library_child.includes(child.name) ||
                wall_library.includes(child.name) ||
                child.name == 'First_Second_Stairs' ||
                child.name == 'Ground_First_StairCase' ||
                child.name == 'Reflectors'||
                //I also want the entrance pop up to scale down
                child.name == 'GSAP1' || child.name == 'GSAP5' || child.name == 'GSAP4' || child.name == 'GSAP3'
            ){ 
                gsap.to(
                    child.scale,
                    {
                        x : 0,
                        y:  0,
                        z : 0,
                        duration : 0.5
                    }
                );
            }
        });
    } else if(floor == 'Ground_Floor'){
        model.traverse((child)=>{
            //Basement to change the opacity to 0.5 and Second floor and First Floor will scale down
            if(
                second_floor_library_child.includes(child.name) ||
                first_floor_library_child.includes(child.name) ||
                wall_library.includes(child.name) ||
                child.name == 'First_Second_Stairs' ||
                child.name == 'Reflectors'||
                //I also want the entrance pop up to scale down
                child.name == 'GSAP1' || child.name == 'GSAP5' || child.name == 'GSAP4' || child.name == 'GSAP3'
            ){ 
                gsap.to(
                    child.scale,
                    {
                        x : 0,
                        y:  0,
                        z : 0,
                        duration : 0.5
                    }
                );
            }
        });

        //Make the scale of all the booklshef to be zero in the first floor
        for(let i = 0; i < first_floor_bookshelf_instancedMesh.total; i++){setInstanceScale(i,0,first_floor_bookshelf_instancedMesh)}
        //Make the instance of all the tables in the first floor to be zero
        for(let i=0; i < first_floor_tables_instancedMesh.total;i++){setInstanceScale(i,0,first_floor_tables_instancedMesh);}
        //Make the instances of all the aicondiitoners to zero
        for(let i=0; i < airconditioner_instanced_mesh.total;i++){setInstanceScale(i,0,airconditioner_instanced_mesh);} 

    } else if(floor == 'First_Floor') {
        model.traverse((child)=>{
            //Second floor | First Floor | First Floor Bookshelf | First Floor Tables | Wall of the library will disppear
            if(
                second_floor_library_child.includes(child.name) ||
                wall_library.includes(child.name) ||
                child.name == 'Reflectors'||
                //I also want the entrance pop up to scale down
                child.name == 'GSAP1' || child.name == 'GSAP5' || child.name == 'GSAP4' || child.name == 'GSAP3'
            ){ 
                gsap.to(
                    child.scale,
                    {
                        x : 0,
                        y:  0,
                        z : 0,
                        duration : 0.5,
                    }
                );
            }
        });
        //Scale down the air conditrioner
        for(let i=0; i < airconditioner_instanced_mesh.total;i++){setInstanceScale(i,0,airconditioner_instanced_mesh);}
    } else if(floor == 'Second_Floor') {
        model.traverse((child)=>{
            //Second floor | First Floor | First Floor Bookshelf | First Floor Tables | Wall of the library will disppear
            if(
                wall_library.includes(child.name) ||
                child.name == 'Reflectors'||
                //I also want the entrance pop up to scale down
                child.name == 'GSAP1' || child.name == 'GSAP5' || child.name == 'GSAP4' || child.name == 'GSAP3'
            ){ 
                gsap.to(
                    child.scale,
                    {
                        x : 0,
                        y:  0,
                        z : 0,
                        duration : 0.5
                    }
                );
            }
        });
    }
} 

/**
 * current_floor = -1 -> Reset
 * current_floor = 0 -> Ground Floor
 * current_floor = 1 -> first_floor
 * current_floor = 2 -> second_floor
 */
let current_floor = -1;
let isLibraryReset = 1; // If library reset, 1 else, 0

/**
 * This function could be used to dispaly any floor of the librayr. It will first reset the scale of complete library before dispalying a specific floor.
 * But make sure you update the isLibraryReset Option after using this function.
 * @param {Function} onComplete_function - This is the function that may change the dispaly of library floor. 
 */
function libraryScaleReset(onComplete_function){
    if(isLibraryReset){
        onComplete_function();
    } else {
        model.traverse((child)=>{
            if(
                wall_library.includes(child.name) ||
                second_floor_library_child.includes(child.name) ||
                child.name == 'First_Second_Stairs' ||
                first_floor_library_child.includes(child.name) ||
                child.name == 'Ground_First_StairCase' ||
                child.name == 'Reflectors' ||
                ground_floor_library_child.includes(child.name) ||
                basement_floor_library_child.includes(child.name) ||
                child.name == 'GSAP5' || child.name == 'GSAP1' || child.name == 'GSAP3' || child.name == 'GSAP4'
            ){ 
                gsap.to(
                    child.scale,
                    {
                        x : 1,
                        y : 1,
                        z : 1,
                        duration : 0.2,
                        onComplete : ()=>{
                            //And then make the instances to scale up
                            // Ground Floor Tables Scale reset
                            for(let i=0; i < ground_floor_tables_instancedMesh.total;i++){setInstanceScale(i,1,ground_floor_tables_instancedMesh);}
                            // First Floor Booklshef scale reset
                            for(let i = 0; i < first_floor_bookshelf_instancedMesh.total; i++){setInstanceScale(i,1,first_floor_bookshelf_instancedMesh)}
                            // First Floor Table scale reset
                            for(let i=0; i < first_floor_tables_instancedMesh.total;i++){setInstanceScale(i,1,first_floor_tables_instancedMesh);}
                            // Airconditioner Instances scale reset
                            for(let i=0; i < airconditioner_instanced_mesh.total;i++){setInstanceScale(i,1,airconditioner_instanced_mesh);}

                            //This will will be executed as soon as the library is reset
                        onComplete_function();
                        }
                    }
                )
            }
        });
    }
    
}

//Floor Button eventlisteners

// When the reset button is clicked
const reset_floor = document.querySelectorAll('.floor-reset');
reset_floor.forEach((child)=>{
    child.addEventListener('click',()=>{
        //Make the cameras focus on the right origin
        focusFloor(controls,'Outer_Floor');

        //Now I will reset the size of all the mesh and instancesw
        libraryScaleReset(()=>{
            console.log('Library reset. No callback function');
            isLibraryReset = 1;
        });

        current_floor = -1;

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){

            //Make all the edges and nodes to be disabled
            controlEdgesNodes(model,-2,false,false);
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);

            //Make all the Nodes and edges of that floor to be triggered
            controlEdgesNodes(model,-1,false,true);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
            model.getObjectByName(ending_location).scale.set(0,0,0);
        }
    });
})

// When the Ground Floor option is clicked
const ground_floor = document.querySelectorAll('.ground-floor-display');
ground_floor.forEach((child)=>{
    child.addEventListener('click',()=>{
        //Make the cameras focus on the right origin
        focusFloor(controls,'Ground_Floor');

        //First reset the scale
        libraryScaleReset(()=>{
            //Make the ground floor of the library visible
            makeVisible('Ground_Floor');
            console.log('Library is rest and now the ground floor has appeared');
            isLibraryReset = 0;
        })

        //update the current floor
        current_floor = 0;

        console.log(application_flow)

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            
            //Make all the edges and nodes to be disabled
            controlEdgesNodes(model,-2,false,false);
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);

            //Make all the Nodes and edges of that floor to be triggered
            controlEdgesNodes(model,-1,false,true);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        }
    });
})

// When the First Floor option is clicked
const first_floor = document.querySelectorAll('.first-floor-display');
first_floor.forEach((child)=>{
    child.addEventListener('click',()=>{
        //Make the cameras focus on the right origin
        focusFloor(controls,'First_Floor');

        //First reset the scale
        libraryScaleReset(()=>{
            //Make the ground floor of the library visible
            makeVisible('First_Floor');
            console.log('Library is rest and now the first floor has appeared');
            isLibraryReset = 0;
        })

        current_floor = 1;

        console.log(application_flow)

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            
            //Make all the edges and nodes to be disabled
            controlEdgesNodes(model,-2,false,false);
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);

            //Make all the Nodes and edges of that floor to be triggered
            controlEdgesNodes(model,-1,false,true);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
            model.getObjectByName(ending_location).scale.set(0,0,0);
        }
    });
})

// When the Second Floor option is clicked
const second_floor = document.querySelectorAll('.second-floor-display');
second_floor.forEach((child)=>{
    child.addEventListener('click',()=>{
        //Make the cameras focus on the right origin
        focusFloor(controls,'Second_Floor');

        //First reset the scale
        libraryScaleReset(()=>{
            //Make the ground floor of the library visible
            makeVisible('Second_Floor');
            console.log('Library is rest and now the second floor has appeared');
            isLibraryReset = 0;
        })

        current_floor = 2;

        console.log(application_flow)

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            
            //Make all the edges and nodes to be disabled
            controlEdgesNodes(model,-2,false,false);
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);

            //Make all the Nodes and edges of that floor to be triggered
            controlEdgesNodes(model,-1,false,true);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
            model.getObjectByName(ending_location).scale.set(0,0,0);
        }
    })
})


//----------------  EVENT LISTENERS  ------------------------//

//hide menu button
let isMenuOpen = false;
//Main menu will be hidden after entering the application
document.querySelector('.expand-main-menu-container').addEventListener('click',()=>{
    //if the menu is hidden
    if(!isMenuOpen){
        //hide the hide menu option
        document.querySelector('.expand-main-menu-container').style.display = 'none';
        //Dispaly the main menu
        document.querySelector('.main-menu-container').style.display = 'block';
        isMenuOpen = true;
    }
});

//This is to hide the the main menu
document.querySelector('.hide-main-menu').addEventListener('click',()=>{
    //If the menu is open
    if(isMenuOpen){
        //hide the hide menu option
        document.querySelector('.expand-main-menu-container').style.display = 'block';
        //Dispaly the main menu
        document.querySelector('.main-menu-container').style.display = 'none';
        isMenuOpen = false;
    }
})

//---------- [0 to 1] ------------//
document.querySelector('.explore-option').addEventListener('click',()=>{
    //update the application flow and the floor display
    if(tellApplicationFlow() !== 1){
        previuos_application_flow = application_flow;
        application_flow = 1;
    }

    //Reset the scale of library
    libraryScaleReset(()=>{
        console.log('Library is set to scale one after clicking the explore option');
        isLibraryReset = 1;
    });

    //Make the main menu container disappear
    const main_menu_options = document.querySelectorAll('.main-menu-option');
    main_menu_options.forEach((child)=>{
        child.style.display = 'none';
    });

    //Make the explore menu at [1] appear
    document.querySelector('.explore-option-drop-box').style.display = 'flex';
    document.querySelector('.explore-floor-option-container').style.display = 'flex';

    // Every Frustum appear depending on the floor. And GSAP appear depending on the floor.
    enlargeGSAP(model,-1,false,true);
    

    //Change the content of the title
    document.querySelector('.title-content').innerHTML = 'Explore (Floor Mode) - [1.0]';
});

//---------- [1 to 0] ------------//
document.querySelector('.explore-floor-back-button').addEventListener('click',()=>{
    //Update the application flow
    if(tellApplicationFlow() !== 0) {
        previuos_application_flow = application_flow;
        application_flow = 0;
    }

    //Reset the library (If the library is not reset)
    if(isLibraryReset == 0){
        libraryScaleReset(()=>{
            console.log('Scale of the library is set to one after clicking the back button');
        });
        isLibraryReset = 1;
    }

    //Reset the Focus
    focusFloor(controls,'Outer_Floor');

    //Make the main menu container Appear
    const main_menu_options = document.querySelectorAll('.main-menu-option');
    main_menu_options.forEach((child)=>{
        child.style.display = 'flex';
    });

    //Make the Floor button display none.
    document.querySelector('.explore-option-drop-box').style.display = 'none';
    document.querySelector('.explore-floor-option-container').style.display = 'none';

    //All the frustum and GSAP will be disappeared
    enlargeGSAP(model,-2,false,false);

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Main Menu [0]';
})

//----------[1 to 1.1]-----------//
/**
 * This function will be the callback function when the user chooses a GSAP in the explore mode which is [1]
 * @param {string} gsap - Name of GSAP selected 
 */
function onGSAPselectionExplore(gsap){
    console.log(`You are in the onGSAPSelectionExplore mode and the gsap selected is ${gsap.name}`)
    if(tellApplicationFlow() !== 1.1){
        previuos_application_flow = application_flow;
        application_flow = 1.1; 
    }

    //And then make the UX as [1.1]
    document.querySelector('.explore-floor-option-container').style.display = 'none';
    document.querySelector('.explore-gsap-option-container').style.display = 'flex';

    //Make the library to the right scale
    libraryScaleReset(()=>{
        console.log('Library is reset to make the GSAP mode activated.');
        isLibraryReset = 1;
    })

    //Get the position of the gsap selected
    let pos = new THREE.Vector3();
    gsap.getWorldPosition(pos);

    //And then make the camera animate to that GSAP
    //Outer Floor
    if(gsap.name == 'GSAP_0_3' || gsap.name == 'GSAP_0_2' || gsap.name == 'GSAP_0_13'){
        animate_Selection(gsap,18,pos.x,pos.z+0.1,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_11' || gsap.name == 'GSAP_0_14' ){
        animate_Selection(gsap,18,pos.x,pos.z-0.1,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_8'){
        animate_Selection(gsap,15,pos.x,pos.z-0.1,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_6'){
        animate_Selection(gsap,15,pos.x,pos.z+0.1,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_4'){
        animate_Selection(gsap,15,pos.x,pos.z+0.1,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_10' ) { 
        animate_Selection(gsap,15,pos.x,pos.z-0.1,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_5' || gsap.name == 'GSAP_0_9') {
        animate_Selection(gsap,15,pos.x-0.1,pos.z,outer_GSAP_object);
    } else if(gsap.name == 'GSAP_0_12' || gsap.name == 'GSAP_0_7' || gsap.name == 'GSAP_0_1'){
        if(gsap.name == 'GSAP_0_1'){
            animate_Selection(gsap,18,pos.x+0.1,pos.z,[...outer_GSAP_object,...ground_floor_GSAP_object]);
        } else{
            animate_Selection(gsap,18,pos.x+0.1,pos.z,outer_GSAP_object);
        }
    }

    //Ground Floor
    else if(gsap.name == 'GSAP_1_4') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_6',0.1);
        animate_Selection(gsap,14,x_pos,y_pos,[...outer_GSAP_object,...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_6' || 
        gsap.name == 'GSAP_1_7' || 
        gsap.name == 'GSAP_1_14' || 
        gsap.name == 'GSAP_1_15' || 
        gsap.name == 'GSAP_1_16' || 
        gsap.name == 'GSAP_1_17' ||
        gsap.name == 'GSAP_1_25' ||
        gsap.name == 'GSAP_1_24' ||
        gsap.name == 'GSAP_1_20'
    ) {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_13',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_19') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_21',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_18') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_23',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_5') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_4',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_26') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_27',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_30') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_28',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_29') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_28',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_31') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_28',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_33') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_13',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object,...first_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_13') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_33',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_27') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_29',0.1);
        animate_Selection(gsap,15,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_28') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_31',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_23') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_18',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...ground_floor_GSAP_object])
    } else if(gsap.name == 'GSAP_1_30' ||
        gsap.name == 'GSAP_1_22' ||
        gsap.name == 'GSAP_1_21' ||
        gsap.name == 'GSAP_1_21' ||
        gsap.name == 'GSAP_1_32'
    ) {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_1_19',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...ground_floor_GSAP_object])
    }

    //First Floor
    else if(gsap.name == 'GSAP_2_1') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_2',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...ground_floor_GSAP_object,...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_2') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_1',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_11') {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_12',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_16') {
        animate_Selection(gsap,18,pos.x-0.1,pos.y,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_3' ||
        gsap.name == 'GSAP_2_4' ||
        gsap.name == 'GSAP_2_5' ||
        
        gsap.name == 'GSAP_2_12' ||
        gsap.name == 'GSAP_2_13' ||
        gsap.name == 'GSAP_2_14'
    ) {
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_2',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_6'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_10',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_8'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_7',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_9'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_7',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_10'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_7',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_15'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_2_7',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_2_7'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_3_1',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object,...second_floor_GSAP_object]);
    }

    //Second Floor
     else if(gsap.name == 'GSAP_3_1'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_3_2',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...first_floor_GSAP_object,...second_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_3_2'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_3_3',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...second_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_3_3'){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_3_5',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...second_floor_GSAP_object]);
    } else if(gsap.name == 'GSAP_3_4' ||
        gsap.name == 'GSAP_3_5' ||
        gsap.name == 'GSAP_3_6' ||
        gsap.name == 'GSAP_3_7'
    ){
        let [x_pos,y_pos] = pointTowards(gsap.name,'GSAP_3_3',0.1);
        animate_Selection(gsap,18,x_pos,y_pos,[...second_floor_GSAP_object]);
    }

    //Activate the Frusutm depending on the gsap.


    //update the title
    document.querySelector('.title-content').innerHTML = 'Explore (GSAP Mode) - [1.1]';
}

//Add the event listeners on the frustum and gsap enable and disable.


//-----------[1.1 to 1]-----------//
document.querySelector('.explore-gsap-back-button').addEventListener('click',()=>{
    //Update the Application Flow
    if(tellApplicationFlow() == 1.1){
        previuos_application_flow = application_flow;
        application_flow = 1;
    }

    //Make the Explore Floor Mode appear and the Explore GSAP mode dispappear
    document.querySelector('.explore-floor-option-container').style.display = 'flex';
    document.querySelector('.explore-gsap-option-container').style.display = 'none';

    //Assuming the library is rescaled. Frustum appear depending on the floor. GSAP appear depending on the Floor.
    
    //Turn on the ground gsap
    enlargeGSAP(model,-1,false,true);
    
    //Come out of the gsap mode
    resetCamera(camera,controls);


    //update the title
    document.querySelector('.title-content').innerHTML = 'Explore (Floor Mode) - [1.0]';
})

//---------- [0 to 2] -------------//
document.querySelector('.search-option').addEventListener('click',()=>{
    //Update the application number
    if(tellApplicationFlow() !== 2){
        previuos_application_flow = application_flow;
        application_flow = 2;
    }

    //Make the main menu container disappear
    const main_menu_options = document.querySelectorAll('.main-menu-option');
    main_menu_options.forEach((child)=>{
        child.style.display = 'none';
    });

    //Make the search menu to appear [2]
    document.querySelector('.search-option-container').style.display = 'flex';
    document.querySelector('.search-option-drop-box').style.display = 'flex';

    //Assuming the library is of the right size. Frustum and GSAPs and Node and Edges will be disabled.


    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search Menu [2.0]';
});

//--------- [2 to 0]---------------//
document.querySelector('.search-back-button').addEventListener('click',()=>{
    if(tellApplicationFlow() !== 0){
        previuos_application_flow = application_flow;
        application_flow = 0;
    }

    //Make the main menu container Appear
    const main_menu_options = document.querySelectorAll('.main-menu-option');
    main_menu_options.forEach((child)=>{
        child.style.display = 'flex';
    });

    //Make the previuos UI to disappear
    document.querySelector('.search-option-container').style.display = 'none';
    document.querySelector('.search-option-drop-box').style.display = 'none';

    //Assuming the library is rescaled and all the frustum and gsap will be disabled.

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Main Menu - [0]';
})

//---------- [2 to 2.1] -----------//
document.querySelector('.book-search-option').addEventListener('click',()=>{
    //Update the application number
    if(tellApplicationFlow() !== 2.1){
        previuos_application_flow = application_flow;
        application_flow = 2.1;
    }

    //Make the search container [2.1]
    document.querySelector('.books-and-journals-search-container').style.display = 'flex';
    document.querySelector('.search-option-container').style.display = 'none';

    //Assuming the library is rescaled and all the GSAP and frustum are disabled

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Books and Journal Search - [2.1]';
});

//-------------- [2 to 2.2] -------------//
document.querySelector('.quick-search-option').addEventListener('click',()=>{
    //Update the application number
    if(tellApplicationFlow() !== 2.2){
        previuos_application_flow = application_flow;
        application_flow = 2.2;
    }

    //Make the search menu to appear [2.2]
    document.querySelector('.quick-search-option-container').style.display = 'flex';
    document.querySelector('.search-option-container').style.display = 'none';

    //Assuming that the library is in the right scale and all the frustum and GSAP are disabled.

    //Update the title
    const title_content = 'You are in the Quick Search [2.2]';
    document.querySelector('.title-content').textContent = title_content;
});

//---------------[2.2 to 2.7] -----------//
const quick_search_options = document.querySelectorAll('.quick-search-sub-option');
for(let i=0;i<quick_search_options.lenght;i++){
    quick_search_options.addEventListener('click',(e)=>{
        if(tellApplicationFlow() !== 2.7){
            previuos_application_flow = application_flow;
            application_flow = 2.7; 
        }

        //Make the previous UX to disappear
        document.querySelector('.quick-search-option-container').style.display = 'none';

        //Turn on the Floor mode.
        document.querySelector('.quick-search-floor-option-container').style.display = 'flex';

        if(e.target.classList.includes('office-quick-search')){ //If the selected target is Office
             //And then make the Frutum of offices only at the current floor to be visible. And and event listeners at those objects will set the ending location Node.
            
            //Change the title of the application
            const text_content = 'Choose the Offices';
            document.querySelector('.title-content').innerHTML = text_content;

        } else if(e.target.classList.includes('exit-quick-search')) { //If the selected target is Exit
            //And then make the Frutum of exits only at the current floor to be visible. And and event listeners at those objects will set the ending location Node.
            
            //Change the title of the application
            const text_content = 'Choose the Exits';
            document.querySelector('.title-content').innerHTML = text_content;
            
        } else if(e.target.classList.includes('emergency-quick-search')) { //If the selected target is Emergency Exit
            //And then make the Frutum of emergency only at the current floor to be visible. And and event listeners at those objects will set the ending location Node.
            
            //Change the title of the application
            const text_content = 'Choose the Emergency Exits';
            document.querySelector('.title-content').innerHTML = text_content;
            
        }
    })
}

//-------------[2.7 to 2.2]--------------//
document.querySelector('.quick-search-floor-back-button').addEventListener('click',()=>{
    //Update the application flow
    if(tellApplicationFlow() !== 2.2) {
        previuos_application_flow = application_flow;
        application_flow = 2.2;
    }

    //Reset the library floor.
    libraryScaleReset(()=>{
        console.log('Library is set Reset before entering the [2.2]');
        isLibraryReset = 1;
    });

    //Make appropriate UI to appear
    document.querySelector('.quick-search-floor-option-container').style.display = 'none';
    document.querySelector('.quick-search-option-container').style.display = 'flex';

    
    //Disable all the Frustum and GSAP

    //Update the Title
    document.querySelector('.title-content').innerHTML = 'Quick Search [2.2]';
});

//-------------- [2 to 2.3] -------------//
document.querySelector('.locate-manually-option').addEventListener('click',()=>{
    //Update the application number
    if(tellApplicationFlow() !== 2.3){
        previuos_application_flow = application_flow;
        application_flow = 2.3;
    }

    //Make the search menu to appear [2.3]
    document.querySelector('.locate-manually-search-option-container').style.display = 'flex';
    document.querySelector('.search-option-container').style.display = 'none';

    //Assuming the library is at the right scale. Frustum and nodes and Edges must appear depending on the floor.
    //But gsap but not be appeared

    //Make only the outer nodes and edges to be visible since the library is for sure scaled.
    controlEdgesNodes(model,-1,false,true);
    enlargeGSAP(model,-1,false,true);
    
    
    //Update the title
    const title_content = 'Locate the Destination Manually [2.3]';
    document.querySelector('.title-content').innerhtml = title_content;
});


//----------[2.1 to 2]----------//
document.querySelector('.books-and-journals-back-button').addEventListener('click',()=>{
    //Update the application number
    if(tellApplicationFlow() !== 2){
        previuos_application_flow = application_flow;
        application_flow = 2;
    }

    //Make the search container and back button to appear [2.1]
    document.querySelector('.books-and-journals-search-container').style.display = 'none';
    document.querySelector('.search-option-container').style.display = 'flex';

    //Assuming the library is rescaled and all the GSAP and frustum are disabled

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search Menu - [2.0]';
})

//-------------[2.2 to 2] --------------//
document.querySelector('.quick-search-back-button').addEventListener('click',()=>{
    //Update the application number
    if(tellApplicationFlow() !== 2){
        previuos_application_flow = application_flow;
        application_flow = 2;
    }

    //Make the search container and back button to appear [2.1]
    document.querySelector('.quick-search-option-container').style.display = 'none';
    document.querySelector('.search-option-container').style.display = 'flex';

    //Assuming the library is rescaled and all the GSAP and frustum are disabled

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search Menu - [2.0]';
})

//---------------[2.3 to 2]-------------//
document.querySelector('.locate-manually-search-back-button').addEventListener('click',() => {
    //Update the application number
    if(tellApplicationFlow() !== 2){
        previuos_application_flow = application_flow;
        application_flow = 2;
    }

    //Make the search container and back button to appear [2.1]
    document.querySelector('.locate-manually-search-option-container').style.display = 'none';
    document.querySelector('.search-option-container').style.display = 'flex';

    //Rescale the library
    if(isLibraryReset == 0){
        libraryScaleReset(()=>{
            console.log('Library is rescaled [2.3 to 2]');
            isLibraryReset = 1;
            current_floor = -1;
        })
    }

    //Kill all the Frustum and Nodes and edges
    controlEdgesNodes(model,-2,false,false);

    //

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search Menu - [2.0]';
})


//-----------[2.1 to 2.4]----------//
const form = document.querySelector('#searchForm');
const bookID = document.querySelector('#fname'); //This will store the ID of the book
let ID = bookID.value;
form.addEventListener('submit',function (e){
    //Prevent the website from reloading after submittin the form
    e.preventDefault();

    //Update the application flow
    if(tellApplicationFlow() !== 2.4){
        previuos_application_flow = application_flow;
        application_flow = 2.4
    }
    
    // Make the UI as [2.4]
    document.querySelector('.start-location-search-option-container').styel.display = 'flex';
    document.querySelector('.books-and-journals-search-container').styel.display = 'none';

    //Assuming the the library is reset.

    //Find the bookshelf using the ID

    //Find the GSAP corresponding to the bookshelf.

    //Update the ending location of the path

    //Activate the Frustum at that ending location and All the gsap and Nodes and edges will remain disabled.

    //Make the corresponding floor related to the bookshelf to appear. (update the current floor and isLibraryRest)


    //Update the title
    document.querySelector('.title-content').innerHTML = 'Starting Location - [2.4]';
    

    //And then use the 
    form.reset();
});
//This function will give the name of the Target GSAP (The gsap that one can find at the bookshelf) for a given ID of book
function getTargetGSAP(id){
    //console.log(`Inside getTargetGSAP and id = ${id}`);
    if(
        (id >= 1 && id <= 5) || 
        (id >= 13 && id <= 19) ||
        (id >= 21 && id <= 30)
    ){ return `GSAP_T_${id}`;}
    else if(id >= 6 && id <= 12) return `GSAP_T_${Number(id) + Number(7)}`;
    else if(id >= 31 && id <= 46) return `GSAP_T_${Number(id) + Number(16)}`;
    else if(id <= 62 && id >= 47) return `GSAP_T_${Number(109) - Number(id)}`;
}
//Function to push the neccesary GSAP to scale up and also push them into interactive obeject to make them clickable. This function also make the array containing the nearby bookshelfs if the id is apprpriate.
function gsap_and_bookshelf(id,list){

    //Make the InnerGSAPList
    let innerGSAPList = [];

    //Depending on the ID update the list which will contian all the neccesary GSAP
    if(id >= 1 && id <= 62){
        //These are the list of all the neccesary GSAP that needs to be turned on or scaled up.
        if((id >= 21 && id <= 30) || (id >= 1 && id <= 5)) {
            list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP15'];
            innerGSAPList = ['GSAP13','GSAP11','GSAP12','GSAP14','GSAP15'];
        }
        else if((id <= 20 && id >= 6) || (id <= 62 && id >= 31)) {
            list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP15','GSAP18'];
            innerGSAPList = ['GSAP13','GSAP11','GSAP12','GSAP14','GSAP15','GSAP18'];
        }
        //Also push the special target GSAP into the interactiove obejects
        let target = getTargetGSAP(id);
        list.push(target);
        innerGSAPList.push(target);

        //console.log(list);

        //These will be all the bookshelf that are near the search bookshelf into the bookshelf_nearby list.
        if(id>=1 && id<=5){
            for (let i = 1; i <= 12; i++) {
                //Since we are using instances only need the indexes
                if(i != id){
                    bookshelfs_nearby.push(i);
                }
            }
        } else if(id >= 6 && id <= 12) {
            for (let i = 6; i <= 19; i++) {
                //Since we are using instances only need the indexes
                if(i != id){
                    bookshelfs_nearby.push(i);
                }
            }
        } else if(id >= 13 && id <= 19) {
            for (let i = 6; i <= 19; i++) {
                //Since we are using instances only need the indexes
                if(i != id){
                    bookshelfs_nearby.push(i);
                }
            }
        } else if(id >= 21 && id <= 30) {
            for (let i = 21; i <= 46; i++) {
                //Since we are using instances only need the indexes
                if(i != id){
                    bookshelfs_nearby.push(i);
                }
            }
        } else if(id >= 31 && id <= 46) {
            for (let i = 31; i <= 62; i++) {
                //Since we are using instances only need the indexes
                if(i != id){
                    bookshelfs_nearby.push(i);
                }
            }
        } else if(id >= 47 && id <= 62) {
            for (let i = 31; i <= 62; i++) {
                //Since we are using instances only need the indexes
                if(i != id){
                    bookshelfs_nearby.push(i);
                }
            }
        }
    } else if(id == 63) {
        list = ['GSAP4','GSAP5','GSAP6','GSAP8','GSAP1','GSAP3','GSAP9','GSAP13','GSAP20','GSAP21','GSAP23'];
        innerGSAPList = ['GSAP13','GSAP20','GSAP21','GSAP23'];
    } else if(id == 64) {
        list = ['GSAP4','GSAP5','GSAP6','GSAP8','GSAP1','GSAP3','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19'];
        innerGSAPList = ['GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19'];
    }

    //console.log(`ID = ${id} and list = ${list}`);

    //This will push the neccesary GSAP into interactive objects and will also scale them up. Since after every selection all the ineractiove obejcts wilkl scale up, we can initlaly make only the entrance gsap to scale up
    model.traverse((child)=>{
        //Push the neccesary GSAP into the intercative objects to make them intercative.
        if(list.includes(`${child.name}`)){ interactive_objects.push(child); }
    });

    //And now I can make the inner html accordingly for the inner gsap icon on the percentage bar
    fillInnerGsapHTML(list);

    //Add the Event listeners at the icon of the percentage bar
    add_EventListerners_On_Inner_Gsap_Icon(innerGSAPList);
}
//Function to make the searched shelf Red
function makeShelfRed(id){
    //Make the size of target bookshelf to be zero
    const target_book_shelf = model.getObjectByName('First_Floor_Target_Bookshelf_Instance');
    target_book_shelf.scale.set(0,0,0);

    //This would be the ID of the instance
    const mesh = first_floor_bookshelf_instancedMesh;
    //console.log(mesh);
    if(mesh){
        //console.log('Found the mesh to turn red');
        mesh.instance.setColorAt(id-1, new THREE.Color(0xff0000));
        //make the size of the target booklshef to be one
        setInstanceScale(id-1,1,mesh);
    }
}
function makeTargetShelf(id){
    //make the zixe of target booklshef to be one again
    const target_book_shelf = model.getObjectByName('First_Floor_Target_Bookshelf_Instance');
    target_book_shelf.scale.set(1,1,1);

    //First get the insatnce of mesh whose position needs to be taken
    const mesh = first_floor_bookshelf_instancedMesh;
    const matrix = new THREE.Matrix4();
    if(mesh){
        //Get the posiiton of the instance
        mesh.instance.getMatrixAt(id-1,matrix);
        //Scale down the instance
        setInstanceScale(id-1,0,mesh);
    }

    const pos = new THREE.Vector3(); //For Position
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(pos, quat, scale);

    //and now posiiton of this target bookshelf here
    target_book_shelf.position.set(pos.x,pos.y,pos.z);
    //target_book_shelf.quaternion.copy(quat);
}

//--------------[2.3 to 2.4]------------//
/**
 * This function will be trggered when a GSAP is selcted in the manual location search.
 * @param {string} GSAP - Name of GSPA that will be activated when the 
 */
function onGsapSelectionQuickSearch(GSAP){

    //console.log(`GSAP selected in 2.3 is ${GSAP.name}`)

    //Update the application number
    if(tellApplicationFlow() !== 2.4){
        previuos_application_flow = application_flow;
        application_flow = 2.4;
    }

    //Make the search container and back button to appear [2.1]
    document.querySelector('.locate-manually-search-option-container').style.display = 'none';
    document.querySelector('.start-location-search-option-container').style.display = 'flex';

    //Update the Ending location
    ending_location = GSAP.name;
    console.log(`Endign location is ${ending_location}`);

    //I will animate the gsap as a smal bounce and will also change the color of the gsap to blue
    gsap.fromTo(
        GSAP.scale,
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 0, z: 0, duration: 1 }
    );
    

    //Frustum will appear depending on the floor. (But since we have set it to -1 it will not be shwon now)

    //Nodes and Edges will appear depending on the floor.

    //Update the title
    
    document.querySelector('.title-content').innerHTML = `Starting Location [2.4]`;
}

//--------[2.4 to 2.1 or 2.2 or 2.3]-----------//
document.querySelector('.start-location-search-back-button').addEventListener('click',()=>{
    //Rescale the library
    libraryScaleReset(()=>{
        console.log('Rescaling the libray before leaving the [2.4]')
    })

    //Make the UI of [2.4] to disappear
    document.querySelector('.start-location-search-option-container').style.display = 'none'; // [2.4]

    let title_content;

    //Update the UI and title depending on the previous Application flow
    if(previuos_application_flow == 2.7){
        //Update the application number
        application_flow = 2.2;

        //Update the UI
        document.querySelector('.quick-search-option-container').style.display = 'flex'; // [2.2]

        //Update the title
        title_content = 'Quick Search [2.7]';

    } else if(previuos_application_flow == 2.3) {
        //Update the Application Flow
        application_flow = 2.3;

        //Update the UI
        document.querySelector('.locate-manually-search-option-container').style.display = 'flex'; // [2.2]
       
        //Update the ending location to null
        ending_location = null;

        //Update the title
        title_content = 'Locate the Destinastion Manually [2.3]';  
    } else if (previuosly_selected_GSAP == 2.1) {
        //Update the Application Flow
        application_flow = 2.1;

        //Update the UI
        document.querySelector('.books-and-journals-search-container').style.display = 'flex'; // [2.2]
       
        //Update the title
        title_content = 'Search the Book or Journal [2.1]';
    }

    //Update the previous application flow 
    previuos_application_flow = 2.4;

    //Reset the Library
    libraryScaleReset(()=>{
        console.log('Reset the Library from [2.4 to 2.2]')
    })

    //update the title
    document.querySelector('.title-content').innerHTML = title_content;
})



//-------------[2.7 to 2.4]--------------//
/**
 * The function will be triggered when the I select a specific GSAP when in specific Quick Search.
 * @param {string} gsap - Name of GSAP
 */
function onGsapSelectSpecificQuickSearch(gsap){
    //Update the application number
    if(tellApplicationFlow() !== 2.4){
        previuos_application_flow = application_flow;
        application_flow = 2.4;
    }

    //Make the search container and back button to appear [2.1]
    document.querySelector('.quick-search-floor-option-container').style.display = 'none';
    document.querySelector('.start-location-search-option-container').style.display = 'flex';

    //Update the Ending point
    ending_location = gsap;

    //Frustum and Node and Edges appear depending on the Floor selected.

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search Menu - [2.0]';
}




//---------------[2.4 to 2.5]------------------//
let path_gsap = []; //These are gsap in sequnce that are in the path between the starting and ending point
/**
 * This function will be trggered when a GSAP is selcted in the Start Location selection.
 * @param {string} gsap - Name of GSPA that will be activated when the 
 */

function onGsapSelectionStart(GSAP){
    //Update the application flow
    if(tellApplicationFlow() !== 2.5){
        previuos_application_flow = application_flow;
        application_flow = 2.5;
    }

    //Update the starting point
    starting_location = GSAP.name;

    //Use the A* start algorithm to  make the best route
    console.log(`Starting Location is ${starting_location} and Ending Location is ${ending_location}`);
    let path = a_star_init(starting_location,ending_location);
    console.log(path);

    //Push the interactive GSAP and scale them up depending on the floor.
    allGSAP_object.forEach((gsap_child)=>{
        if(gsap_child && path.includes(gsap_child.name)){
            path_gsap.push(gsap_child);
            gsap.fromTo(
                gsap_child.scale,
                {
                    x:0,
                    y:0,
                    z:0
                },
                {
                    x:1,
                    y:1,
                    z:1,
                    duration:1
                }
            );
        } else {
            if(gsap_child){
               gsap.to(
                    gsap_child.scale,
                    {
                        x:0,
                        y:0,
                        z:0,
                        duration:1
                    }
                ); 
            } 
        }
    });

    //Make every other gsap except for this path gsap to dimish their size


    //Turn on the frustum of the destination only depending on the floor.

    //Update the UI

    //Update the Target
    const title_content = 'Path has been shown';
    document.querySelector('.title-content').textContent = title_content;
}

//--------------[2.5 to 2]---------------//
document.querySelector('.search-shown-clear-button').addEventListener('click',()=>{
    //Update the application
    if(tellApplicationFlow() !== 2){
        previuos_application_flow = application_flow;
        application_flow = 2;
    }

    //Update the Starting and Ending Point
    starting_location = null;
    ending_location - null;

    //Rescale the library
    libraryScaleReset(()=>{
        console.log('Reseting the library before coming out of [2.5]');
    })

    //Disable all the frustum and make all the GSAp turn zero. Empty the Interactive objects.

    //Update the UI
    document.querySelector('.search-shown-option-container').style.display = 'none'; //Clear the floor option in [2.5]
    document.querySelector('.search-shown-clear-button').style.display = 'none'; //Clear the clear option in [2.5]
    document.querySelector('.search-option-container').style.display = 'flex'; //Make the search options appear.
    document.querySelector('.search-back-button').style.display = 'flex'; //Make the back option appear.
    
    //Update the Target
    const title_content = 'You are in Search Menu';
    document.querySelector('.title-content').textContent = title_content;
})

//--------------[2.5 to 2.6]---------------//
/**
 * This function will be trggered when a GSAP is selcted in the Location shwon mode.
 * @param {string} gsap - Name of GSPA that is clicked. 
 */
function onGsapSelectionLocationShown(GSAP){
    //Update the application flow
    if(tellApplicationFlow() !== 2.6){
        previuos_application_flow = application_flow;
        application_flow = 2.6;
    }

    //Make the library to rescaled.
    if(isLibraryReset == 0){
        libraryScaleReset(()=>{
            console.log('Library is rescaled before entering the [2.6] GSAp mode');
            isLibraryReset = 1;
        });
    }
        
    //Make all the GSAP in the path to turn on.
    enlargeGSAP(model,-2,true,true);

    //Find where is the GSAP in the sequence of path array
    let i=0;
    for(;i<path_gsap.length;i++){
        if(path_gsap[i].name == GSAP.name && i != path_gsap.length-1){
            i = i;
            break;
        } else if(i == path_gsap.length-1) {
            i = -1;
            break;
        }
    }

    let [x,y] = pointTowards(GSAP.name,path_gsap[i+1].name,0.1);

    //Make the GSAP to animate there
    animate_Selection(GSAP,18,x,y,path_gsap);

    //Update the UI
    document.querySelector('.percentage-bar-container').style.display = 'none'; //Percentage Bar Disappears
    document.querySelector('.gsap-container').style.display = 'flex'; // GSAP icons on the percentage bar disappears.
    document.querySelector('.search-shown-option-container').style.display = 'none'; //Floor Options Apppears

    //Update the title
    const title_content = 'Path Found (GSAP Mode)';
    document.querySelector('.title-content').textContent = title_content;
}


//--------------[2.6 to 2.5]---------------//
document.querySelector('.GSAP-search-shown-back-button').addEventListener('click',()=>{
    //Update the appl;ication flow
    if(tellApplicationFlow()!==2.5){
        previuos_application_flow = application_flow;
        application_flow = 2.5;
    }

    //Update the UI
    document.querySelector('.percentage-bar-container').style.display = 'none'; //Percentage Bar Disappears
    document.querySelector('.gsap-container').style.display = 'none'; // GSAP icons on the percentage bar disappears.
    document.querySelector('.search-shown-option-container').style.display = 'flex'; //Floor Options Apppears
    
    //Library will already be rescaled. frustrum will appear depending on the floor.

    //Update the title
    const title_content = 'Location Shown (Floor Mode)';
    document.querySelector('.title-content').textContent = title_content;
})



//-------------------LOADING PAGE----------------------//
const loadingManager = new THREE.LoadingManager();
const loading_page = document.querySelector('.loading-page-container');

loadingManager.onStart = function (URL,item,total){
    console.log('Loading has started');
    //Loading Page appears
    loading_page.style.display = 'block';
}

loadingManager.onProgress = function(url,i,total){
    console.log(`i = ${i}`);
}

loadingManager.onLoad = function(){
    console.log('Loading is finished');
    //Make the loading page disappear
    loading_page.style.display = 'none';
    
    //Start the Application by animating the camera
    camera_animate();
}

//Loading the World
const loader = new GLTFLoader(loadingManager);

let model = null;
const interactive_objects = [];
const bookshelfs_nearby = [];


//------------------RAY CASTING-------------------//

let selectedObject = null;
let GSAP_Selected = null;



//------------------ENTRANCE FRUSTUM---------------------//


let entrance_frustum = false;
const entranceFrustum = new THREE.Frustum();
//Entrance Pop Up elements in HTML
const Entrance1_pop_up = document.querySelector('#Entrance_1-pop-up');
const Entrance2_pop_up = document.querySelector('#Entrance_2-pop-up');
const Entrance3_pop_up = document.querySelector('#Entrance_3-pop-up');
const Entrance4_pop_up = document.querySelector('#Entrance_4-pop-up');

//Function this will update the scale of pop up to be resposive to zoom
function updatePopupScale(element){
    //Get the distance of camera from the target
    let distance = controls.getDistance();
    let pop_scale = 1.5 -  (distance - 341) * ((1.5 - 0)/(899 - 341));
    //Now update the pop up scale
    element.style.transform = `scale(${pop_scale})`;
    //Since the pop up has to scale from the top left point
    element.style.transformOrigin = "top left";
}

//This function will animate the entrance pop ups
function animateEntrancePopup(){
    //console.log('Inside the animate entrance pop up function');

    //Store the name of the object that needs to be used for showing the pop up
    const cameraViewProjectionMatrix = new THREE.Matrix4();
    cameraViewProjectionMatrix.multiplyMatrices(
        camera.projectionMatrix,      // projection
        camera.matrixWorldInverse     // camera world -> view
    );
    entranceFrustum.setFromProjectionMatrix(cameraViewProjectionMatrix);


    //Flags
    let entrance_1_visible = false;
    let entrance_2_visible = false;
    let entrance_3_visible = false;
    let entrance_4_visible = false;

    //console.log(entrance_popup_object);
    //Loop throuhg all the entrance pop up objects
    entrance_popup_object.forEach((obj)=>{
        const position = new THREE.Vector3();
        obj.getWorldPosition(position);
        //console.log(obj.name);
        //If any of them lies in the frustum of camera
        if(entranceFrustum.containsPoint(position)){
            //console.log(obj.name);
            //If it is entrnace 1
            if(obj.name == 'Entrance_1' && camera.position.z>0){
                entrance_1_visible = true;
                updatePopupCordinates(obj,Entrance1_pop_up);
                //Update the scale of pop up
                updatePopupScale(Entrance1_pop_up);
            }
            //If Entrance 2 is in the frustum
            if(obj.name == 'Entrance_2' && camera.position.z>0){
                entrance_2_visible = true;
                updatePopupCordinates(obj,Entrance2_pop_up);
                //Update the scale of pop up
                updatePopupScale(Entrance2_pop_up);
            }
            //If Entrance 3 is in the frustum
            if(obj.name == 'Entrance_3' && camera.position.z<0){
                entrance_3_visible = true;
                updatePopupCordinates(obj,Entrance3_pop_up);
                //Update the scale of pop up
                updatePopupScale(Entrance3_pop_up);
            }
            //If Entrance 4 is in the frustum
            if(obj.name == 'Entrance_4' && camera.position.z<0){
                entrance_4_visible = true;
                updatePopupCordinates(obj,Entrance4_pop_up);
                //Update the scale of pop up
                updatePopupScale(Entrance4_pop_up);
            }
            
        }
    });

    //console.log(`Entrance_1_visible = ${entrance_1_visible}`);

    //Now we display the pop up
    if(entrance_1_visible) {Entrance1_pop_up.style.display = 'block';}
    else Entrance1_pop_up.style.display = 'none';
    if(entrance_2_visible) Entrance2_pop_up.style.display = 'block';
    else Entrance2_pop_up.style.display = 'none';
    if(entrance_3_visible) Entrance3_pop_up.style.display = 'block';
    else Entrance3_pop_up.style.display = 'none';
    if(entrance_4_visible) Entrance4_pop_up.style.display = 'block';
    else Entrance4_pop_up.style.display = 'none';
}


//----------------RAYCASTING----------------//
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


document.addEventListener( 'click', onPointerMove );

//This function will take the slected GSPA and then animate the camera to that GSAP and will update the next GSAP also

function animate_Selection_complete(selectedObject){
    //Now if the application flow is in the explore mode
    if(application_flow == 1 || application_flow == 1.1){
        onGSAPselectionExplore(selectedObject);
    }

    //if the application flow is in the locate the destination manually
    else if(application_flow == 2.3){
        onGsapSelectionQuickSearch(selectedObject);
    }
    //if the application flow is to see the best path visible then
    else if(application_flow == 2.4){
        onGsapSelectionStart(selectedObject);
    } 
    //If the Application Flow is 2.6 (Location shown but in GSAP mode.
    else if(application_flow == 2.5 || application_flow == 2.6) {
        onGsapSelectionLocationShown(selectedObject);
    }
}

function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObject( model, true );

    if ( intersects.length > 0 ) {
        

        const res = intersects.filter( function ( res ) {

            return res && res.object;

        } )[ 0 ];

        if ( res && res.object ) {  
            
            //Could be used to selected anything.
            selectedObject = res.object;

            //if(selectedObject) console.log(`Name of the Selected object is ${selectedObject.name}`);

            //if the object clicked is the one which is clickable
            if(selectedObject  && !unclickables.includes(selectedObject.name)){
                console.log(selectedObject.name);

                // Will have to work on this
            
                animate_Selection_complete(selectedObject);
                
            }

            
        }
    }
}

//---- FRUSTUM-----//
const frustum = new THREE.Frustum();

//This will prepare the content inside the pop ups.
const stationary_pop_up = document.querySelector('#stationary-pop-up');
const seminar_pop_up = document.querySelector('#seminar-pop-up');
const reception_pop_up = document.querySelector('#reception-pop-up');
const kiosk_pop_up = document.querySelector('#kiosk-pop-up');
const computer_pop_up = document.querySelector('#computer-pop-up');
const DropBox1_pop_up = document.querySelector('#drop-box-1-pop-up');
const DropBox2_pop_up = document.querySelector('#drop-box-2-pop-up');
const Security_pop_up = document.querySelector('#security-pop-up');
const Text_Books_pop_up = document.querySelector('#Text-Books-Section-pop-up');
const Reading_Room_Pop_up = document.querySelector('#Reading-Room-pop-up');


//This function will update the cordinate of the pop up. So it find the cordinates of the object in the mesh where the pop needs to be placed and will update the cordinates of pop up div.
function updatePopupCordinates(obj,pop_up){
    let position = new THREE.Vector3();
    obj.getWorldPosition(position);

    // Convert to Normalized Device Coordinates
    position.project(camera);

    const rect = renderer.domElement.getBoundingClientRect();

    const x = (position.x * 0.5 + 0.5) * rect.width + rect.left;
    const y = (-position.y * 0.5 + 0.5) * rect.height + rect.top;


    //console.log(`X = ${x}px | Y = ${y}px`);
    // Position the popup
    pop_up.style.left = `${x}px`;
    pop_up.style.top = `${y}px`;
}

//This function is to make the pop up to disappear
function popupInvisible(){
    stationary_pop_up.style.display = 'none';
    seminar_pop_up.style.display = 'none';
    reception_pop_up.style.display = 'none';
    kiosk_pop_up.style.display = 'none';
    computer_pop_up.style.display = 'none';
    Security_pop_up.style.display = 'none';
    DropBox1_pop_up.style.display = 'none';
    DropBox2_pop_up.style.display  = 'none';
    Text_Books_pop_up.style.display = 'none';
    Reading_Room_Pop_up.style.display = 'none';
}

//This function is what will animate the position of the pop up.This will be called every time the scene needs to be rendered.
function animatePopUp(){
    //Store the name of the object that needs to be used for showing the pop up
    const cameraViewProjectionMatrix = new THREE.Matrix4();
    cameraViewProjectionMatrix.multiplyMatrices(
        camera.projectionMatrix,      // projection
        camera.matrixWorldInverse     // camera world -> view
    );
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    //console.log(popup_objects);

    //Flags to see if the objects are visible
    let stationary_shop_visible = false;
    let seminar_room_visible = false;
    let reception_room_visible = false;
    let computer_visible = false;
    let kiosk_visible = false;
    let Security_visible = false;
    let drop_box_1_visible = false;
    let drop_box_2_visible = false;
    let reading_room_visible = false;
    let text_book_visible = false;

    // Loop through all popup objects
    popup_objects.forEach(obj => {
        const position = new THREE.Vector3();
        obj.getWorldPosition(position); // get object's 3D world position

        if (frustum.containsPoint(position)) {
            
            //When the GSAP 13 which is the first GSAP inside the library is clicked then we activate this pop up
            if(GSAP_Selected && GSAP_Selected.name == "GSAP13"){

                //make the relevant pop ups appear on the screen wiht their location at the respective objects
                //console.log(obj.name);

                //Updating the Stationary Shop Flag
                if(obj.name == 'Stationary_Shop') {
                    stationary_shop_visible = true;
                    updatePopupCordinates(obj,stationary_pop_up);
                }
                //else stationary_shop_visible = false;

                //Updating the Seminar Room Flag
                if(obj.name == 'Seminar_Room') {
                    seminar_room_visible = true;
                    updatePopupCordinates(obj,seminar_pop_up);
                }
                //else seminar_room_visible = false;

                //Updating the Reception Room Flag
                if(obj.name == "Reception") {
                    reception_room_visible = true;
                    updatePopupCordinates(obj,reception_pop_up)
                }

                //Update the Kiosk Pop up
                if(obj.name == "Kiosk") {
                    kiosk_visible = true;
                    updatePopupCordinates(obj,kiosk_pop_up);
                }

                //Update the Computer Pop up
                if(obj.name == "Computer") {
                    computer_visible = true;
                    updatePopupCordinates(obj,computer_pop_up);
                }

                //Update the Security pop up
                if(obj.name == "Security"){
                    Security_visible = true;
                    updatePopupCordinates(obj,Security_pop_up);
                }

                //else reception_room_visible = false;
            }

            //These pop ups will appear when the GSAP9 is clicked which is the GSAP we get at the entrance of library
            if(GSAP_Selected && GSAP_Selected.name == "GSAP9"){
                //Update the Security pop up
                if(obj.name == "Security"){
                    Security_visible = true;
                    updatePopupCordinates(obj,Security_pop_up);
                }

                //Update the Drop Box 1 pop up
                if(obj.name == "Drop_Box_1"){
                    drop_box_1_visible = true;
                    updatePopupCordinates(obj,DropBox1_pop_up);
                }
            }

            //These pop ups will appear when GSAP20 is clicked.
            if(GSAP_Selected && GSAP_Selected.name == 'GSAP20'){
                //Update the Drop Box 2 pop up
                if(obj.name == "Drop_Box_2") {
                    drop_box_2_visible = true;
                    updatePopupCordinates(obj,DropBox2_pop_up);
                }
                //Update the New books pop up.
                if(obj.name == "Text_Books") {
                    text_book_visible = true;
                    updatePopupCordinates(obj,Text_Books_pop_up);
                }
                //Update the Reading Room pop up.
                if(obj.name == "Reading_Room") {
                    reading_room_visible = true;
                    updatePopupCordinates(obj,Reading_Room_Pop_up);
                }
            }
        }
    });


    //Change the visiblity of the pop up
    if(stationary_shop_visible) stationary_pop_up.style.display = 'block';
    else stationary_pop_up.style.display = 'none';
    if(seminar_room_visible) seminar_pop_up.style.display = 'block';
    else seminar_pop_up.style.display = 'none';
    if(reception_room_visible) reception_pop_up.style.display = 'block';
    else reception_pop_up.style.display = 'none';
    if(kiosk_visible) kiosk_pop_up.style.display = 'block';
    else kiosk_pop_up.style.display = 'none';
    if(computer_visible) computer_pop_up.style.display = 'block';
    else computer_pop_up.style.display = 'none';
    if(Security_visible) Security_pop_up.style.display = 'block';
    else Security_pop_up.style.display = 'none';
    if(drop_box_1_visible) DropBox1_pop_up.style.display = 'block';
    else DropBox1_pop_up.style.display = 'none';
    if(drop_box_2_visible) DropBox2_pop_up.style.display = 'block';
    else DropBox2_pop_up.style.display  = 'none';
    if(text_book_visible) Text_Books_pop_up.style.display = 'block';
    else Text_Books_pop_up.style.display = 'none';
    if(reading_room_visible) Reading_Room_Pop_up.style.display = 'block';
    else Reading_Room_Pop_up.style.display = 'none';
    
}


//-----------------SELECTION ANIMATION-----------------------//

//This function could be used to make the bouncy effect on the next GSAP.
function animateGSAP(GSAP, next){
    if(next && GSAP.name == next){
        gsap.to(GSAP.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.6,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
        });
    }
}

//Adding event listeners at the Entrance pop up
//Entrance 1 - GSAP5
document.querySelector('#Entrance_1-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP5');
    GSAP_Selected = selectedObject;

    console.log(`You have clicked the Entrance 1 pop up and now the slected object is ${selectedObject.name}`);

    animate_Selection(selectedObject,18,0.5,0);
    next_GSAP = 'GSAP6';

    //We could also update the inner html of the outer gsap icon in the percentage bar
    fillOuterGsapHTML(selectedObject);

    //And then add the eventlisteners at those GSAP
    add_EventListerners_On_Outter_Gsap_Icon('Entrance_1');
});

//Entrance 2 - GSAP4
document.querySelector('#Entrance_2-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP4');
    GSAP_Selected = selectedObject;
    animate_Selection(selectedObject,18,0.5,0);
    next_GSAP = 'GSAP8';

    //We could also update the inner html of the outer gsap icon in the percentage bar
    fillOuterGsapHTML(selectedObject);

    //And then add the eventlisteners at those GSAP
    add_EventListerners_On_Outter_Gsap_Icon('Entrance_2');
});

//Entrance 3 - GSAP3
document.querySelector('#Entrance_3-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP3');
    GSAP_Selected = selectedObject;
    animate_Selection(selectedObject,18,-0.5,0);
    next_GSAP = 'GSAP8';

    //We could also update the inner html of the outer gsap icon in the percentage bar
    fillOuterGsapHTML(selectedObject);

    //And then add the eventlisteners at those GSAP
    add_EventListerners_On_Outter_Gsap_Icon('Entrance_3');
});


//Entrance 4 - GSAP1
document.querySelector('#Entrance_4-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP1');
    GSAP_Selected = selectedObject;
    animate_Selection(selectedObject,18,-0.5,0);
    next_GSAP = 'GSAP9';

    //We could also update the inner html of the outer gsap icon in the percentage bar
    fillOuterGsapHTML(selectedObject);

    //And then add the eventlisteners at those GSAP
    add_EventListerners_On_Outter_Gsap_Icon('Entrance_4');
});

//--------------DIRECTION OF THE GSAP-------------//

/**
 * This function will take the information about the target and selcted gsap obejcts and will return the cordiantes of the final camera postion that will help in setting the animation.
 * @param {string} selected_gsap_name - This is the gsap object selected
 * @param {*} next_gsap_name = This is the gsap you are pointing towards
 * @param {number} distance - This is the offset distance betweent the target and the camera
 * @returns {Array} Returns the cordinates of the final location of the camera. 
 */
function pointTowards(selected_gsap_name,next_gsap_name,distance){

    //Position of the selected gsap and the target gsap
    let target_pos = new THREE.Vector3();
    let selected_pos = new THREE.Vector3();

    let selected_gsap = model.getObjectByName(selected_gsap_name);
    let next_gsap = model.getObjectByName(next_gsap_name);

    selected_gsap.getWorldPosition(selected_pos);
    next_gsap.getWorldPosition(target_pos);

    //Distance between the origins of target and next gsap is
    let AB = Math.sqrt(Math.pow((selected_pos.x - target_pos.x),2) + Math.pow((selected_pos.y - target_pos.y),2) + Math.pow((selected_pos.z - target_pos.z),2));

    // Derived Formula
    let x_pos = selected_pos.x - (distance/AB) * (- selected_pos.x + target_pos.x);
    let y_pos = selected_pos.z - (distance/AB) * (- selected_pos.z + target_pos.z);

    console.log(`Position of ${selected_gsap_name} is (x,y,z) =  ${selected_pos.x},${selected_pos.y},${selected_pos.z} and cordinates of ${next_gsap_name} is (x,y,z) = ${target_pos.x},${target_pos.y},${target_pos.z}`);
    console.log(`x_pos : ${x_pos} , y_pos : ${y_pos}`);

    return [x_pos,y_pos];

}

//This will bring the camera to the selected GSAP
function animate_Selection(selected_object,camera_height,camera_x_position,camera_y_position,other_gsap){

    console.log('You are in the animate selection function');

    let worldPos = new THREE.Vector3(); //To store the location of GSAP
    
    //Also when selected a GSPA location, all the mesh except for the bookshelf nearby must scale to 0
    // if(model){
    //     //This will make every thing in the library to be opaque.
    //     model.traverse((child)=>{
    //         if(child.isMesh && library_child.includes(child.name)){
    //             //console.log(`This makes the child named ${child.name} opaque`);
    //             gsap.to(
    //                 child.material,
    //                 {
    //                     opacity : 1,
    //                     duration : 1,
    //                     onComplete : ()=>{
    //                         child.material.depthWrite = true;
    //                         child.material.depthTest = true;
    //                     }
    //                 }
    //             )
    //         }       
    //     });
    // };
    //Since we are working with instances we could directly turn the nearby mesh to transparent
    //console.log(bookshelfs_nearby);
    // bookshelfs_nearby.forEach((i)=>{
    //     setInstanceScale(i-1,0.5,first_floor_bookshelf_instancedMesh);
    // })
    

    //Get the World cordinate of the selected object
    
    selected_object.getWorldPosition(worldPos);

    //Until the animation is finished make the controls disabled
    controls.enableRotate = false;

    //Make the camera go to the cordinate of Selected object
    // gsap.to(
    //     camera.position,
    //     {  
    //         x: worldPos.x - camera_orientation_x,
    //         y: worldPos.y + camera_height,
    //         z: worldPos.z - camera_orientation_y, 
    //         ease: "slow(0.7,0.7,false)",
    //         duration: 1,
    //         onComplete: ()=>{
    //             controls.enableRotate = true;
    //             controls.maxPolarAngle = Math.PI / 1;
    //             //Now I will update the selcted GSAP to Selected object
    //             GSAP_Selected = selectedObject; //TO avoid the problem of outline 
    //         }
    //     }, 
    // );
    gsap.to(
        camera.position,
        {  
            x: camera_x_position,
            y: worldPos.y + camera_height,
            z: camera_y_position, 
            ease: "slow(0.7,0.7,false)",
            duration: 1,
            onComplete: ()=>{
                controls.enableRotate = true;
                controls.maxPolarAngle = Math.PI / 1;
                controls.maxDistance = 0.1;
                //Now I will update the selcted GSAP to Selected object
                GSAP_Selected = selectedObject; //TO avoid the problem of outline 
            }
        }, 
    );

    gsap.to(
        controls,
        {
            maxDistance : 0.1,
            minDistance: 0.1,
            duration : 1
        }
    )

    gsap.to(
        controls.target,
        {
            x: worldPos.x,
            y: worldPos.y + camera_height,
            z: worldPos.z,
            duration : 1,
            // ease: "back.out(1.7)",
        }
    )

    //Scale up the remaining gsap other than the selected gsap
    other_gsap.forEach((child)=>{
        if(child && child.name != selectedObject.name){
            gsap.to(
                child.scale,
                {
                    x : 1,
                    y : 1,
                    z : 1,
                    duration : 1,
                }
            )
        }
        
    })

    //Make the Selected GSAP turn down the size.
    gsap.to(
        selected_object.scale,
        {
            x:0,
            y:0,
            z:0,
            duration : 1
        }
    );

    

    // Make all the Interactive GSAP other than the seletced GSAP's scale to 1
    // interactive_objects.forEach((child)=>{ 
    //     // Remove Animation from all the interactive GSAP
    //     gsap.killTweensOf(child.scale);
    //     if(child.name !== selectedObject.name && child.name !== next_GSAP){
    //         // console.log(child.name);
    //         gsap.to(
    //             child.scale,
    //             {
    //                 x:1,
    //                 y:1,
    //                 z:1,
    //                 duration:1,
    //                 onComplete : ()=>{
    //                     animateGSAP(child, next_GSAP);
    //                 }
    //             }
    //         )
    //     }   
    // });
    //
    // //Update the height of the percentage bar
    // let updated_height = updatePercentageBar(selectedObject,ID);
    // //And then the percentage bar could be animated
    // gsap.to(
    //     document.querySelector('.percentage-bar'),
    //     {
    //         height : `${updated_height}%`,
    //         duration : 1,
    //         ease: "power2.out",
    //     }
    // );
}

//-------------PERCENTAGE BAR--------------//

// This function will take the id of the book, and will fill the inner html of the inner gsap icon
function fillInnerGsapHTML(list){
    let number_of_inner_icon = 0;
    for(let j=list.length-1; j >= 0; j--){
        if(list[j] == 'GSAP9'){break;}
        else {
            const div1 = document.createElement("div");
            div1.classList.add('inner-gsap');
            const div2 = document.createElement("div");
            div2.classList.add('inner-gsap-image-position');

            const html_content = `<img class="${list[j]}-icon" src="./Icon/GSAP.png" alt=""/>`;
            div2.innerHTML = html_content;
            div1.appendChild(div2);

            document.querySelector('.inner-GSAP-icons-container').appendChild(div1);
            number_of_inner_icon++;
        }
    }

    //console.log(`Number of inner html are ${number_of_inner_icon}`);
    return;
}

//This fucntion will add innerhtmnl for the outer gsap icon in the html

function fillOuterGsapHTML_temp(innerhtml){
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");

    div1.innerHTML = innerhtml;
    div1.classList.add('outer-gsap-image-position');
    div2.appendChild(div1);
    div2.classList.add('outer-gsap');
    document.querySelector('.outer-GSAP-icons-container').appendChild(div2);
}

//This function will hard code the outer GSAP icon inner html. It will expect some input as the 
function fillOuterGsapHTML(currentGSAP){

    //First clear the innerhtml
    document.querySelector('.outer-GSAP-icons-container').innerHTML = '';

    //console.log(`Outer GSAP is clicked | currentGSAP = ${currentGSAP}`);

    let innerhtml1 = null;
    let innerhtml2 = null;
    if(currentGSAP.name == 'GSAP5'){
        //fill the gsap6 and gsap9 icon
        innerhtml1 = '<img class="GSAP6-icon" src="./Icon/GSAP.png" alt=""/>';
        innerhtml2 = '<img class="GSAP9-icon" src="./Icon/GSAP.png" alt=""/>';
    } else if(currentGSAP.name == 'GSAP4' || currentGSAP.name == 'GSAP3'){
        //fill the gsap8 and gsap9 icon
        innerhtml1 = '<img class="GSAP8-icon" src="./Icon/GSAP.png" alt=""/>';
        innerhtml2 = '<img class="GSAP9-icon" src="./Icon/GSAP.png" alt=""/>';
    } else if(currentGSAP.name == 'GSAP1'){
        //fill the gsap9
        innerhtml1 = '<img class="GSAP9-icon" src="./Icon/GSAP.png" alt=""/>';
    }

    if(innerhtml1){
        //console.log('Innerhtml1 is filled');
        fillOuterGsapHTML_temp(innerhtml1);
    }
    if(innerhtml2){
        //console.log('Innerhtml2 is filled');
        fillOuterGsapHTML_temp(innerhtml2);
    }
}

//This function will be used to update the percentage bar
function updatePercentageBar(GSAP,ID){

    //To store the GSAP after entering the library
    let list = [];
    let percentage = 0;

    //This is hard coded
    if(GSAP){
        if(GSAP.name == 'GSAP5' || GSAP.name == 'GSAP4' || GSAP.name == 'GSAP3' || GSAP.name == 'GSAP1'){percentage = 1;}
        else if(GSAP.name == 'GSAP6' || GSAP.name == 'GSAP8'){percentage = (100/9);}
        else if(GSAP.name == 'GSAP9'){percentage = (200/9);}
        else{
            //Depending on the ID percentage will be assigned
            if((ID >= 31 && ID <= 62) || (ID >= 6 && ID <= 20)){

                list = ['GSAP13', 'GSAP11', 'GSAP12', 'GSAP14' , 'GSAP15', 'GSAP18',getTargetGSAP(ID)];
            } else if ((ID >= 21 && ID <= 30) || (ID >= 1 && ID <= 5)) {
                list = ['GSAP13', 'GSAP11', 'GSAP12', 'GSAP14' , 'GSAP15',getTargetGSAP(ID)];
            } else if (ID == 63) {
                list = ['GSAP13','GSAP20','GSAP21','GSAP23'];
            } else if(ID == 64) {
                list = ['GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19'];
            }
            let i=0
            for(;i<list.length;i++){
                if(GSAP.name == list[i]) break;
            }

            //console.log(list);
            
            percentage = (200/9) + ((i+1)/(list.length))*(700/9);
        }
    }
    //console.log(`Function returned percentage = ${percentage}`)
    return percentage;
}

//Adding the event listeners to the GSAP locations I will make it look as if I am moving to that location directly but through all the subseqent GSAP
function add_EventListerners_On_Inner_Gsap_Icon(list){
    //List will contian all the inner GSAP
    for(let i = 0;i<list.length;i++){
        //console.log(list[i]);
        //console.log(`Event Listeners added to the ${list[i]}-icon`);
        //If the document contains this id of `${list[i]}-icon`
        const icon = document.querySelector(`.${list[i]}-icon`);
        if(icon) icon.addEventListener('click',()=>{ onIconClick(list[i])});
    }
}

//This will add the event listenrs at the 
function add_EventListerners_On_Outter_Gsap_Icon(entrance){
    //I dont have to remove the event listeners since it I am always clearing the outer gsap divs before recreatign them whent he user enters some other entrance

    //The booklshef must be added the event listenrs such that on clicking it the user comes to fist gsap
    const starting_location = document.querySelector('.destination-icon')
    if(entrance == 'Entrance_1'){

        starting_location.addEventListener('click',()=>{onIconClick('GSAP5')});
        //Event listenrs must be added the the class GSAP6-icon and GSAP9-icon
        document.querySelector('.GSAP6-icon').addEventListener('click',()=>{onIconClick('GSAP6')});

    } else if(entrance == 'Entrance_2'){

        starting_location.addEventListener('click',()=>{onIconClick('GSAP4')});
        //Event listenrs must eb added the the class GSAP6-icon and GSAP9-icon
        document.querySelector('.GSAP8-icon').addEventListener('click',()=>{onIconClick('GSAP8')});

    } else if(entrance == 'Entrance_3'){

        starting_location.addEventListener('click',()=>{onIconClick('GSAP3')});
        //Event listenrs must eb added the the class GSAP6-icon and GSAP9-icon
        document.querySelector('.GSAP8-icon').addEventListener('click',()=>{onIconClick('GSAP8')});

    } else if(entrance == 'Entrance_4'){
        starting_location.addEventListener('click',()=>{onIconClick('GSAP1')});
    }

    document.querySelector('.GSAP9-icon').addEventListener('click',()=>{onIconClick('GSAP9')});
}

//This function will make the camera animate to the location where the GSAP icon was clicked on the percentage
function onIconClick(gsap){
    console.log(`You have clicked on the icon named ${gsap}`);
    
    //First we wil find the object in the model named gsap
    const iconObject = model.getObjectByName(gsap);
    //and then we animate the camera
    selectedObject = iconObject;

    //Now we could make the gsap to move in sequence

    animate_Selection_complete(selectedObject);
}

//----------------  INITIATE -----------------//

/**
 * This function will reset the camera position and it's target which will reset it's orientation
 * @param {*} camera - Scene camera 
 * @param {*} controls - Scene Controls
 */
function resetCamera(camera,controls){

    //Camera
    gsap.to(
        camera.position,
        {
            x : 551.5,
            y : 318.043,
            z : 348.3,
            duration : 1,
        }
    )

    //Controls
    controls.target.set(0,0,0);
    controls.screenSpacePanning = false;
    controls.enablePan = false;
    controls.minDistance = 0;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;
}

/**
 * This function will set the camera and controls to different floors.
 * @param {*} camera - Scene Camera
 * @param {*} controls - Scene Controls
 * @param {string} floor - This is the floor you want to focus on
 */

function focusFloor(controls,floor){
    let pos = new THREE.Vector3();
    let origin;
    if(floor == 'Outer_Floor'){
        //Set the Focus to the origin
        pos = {
            x:  0,
            y : 0,
            z : 0,
        }

        gsap.to(
            controls.target,
            {
                x : pos.x,
                y : pos.y,
                z : pos.z,
                duration : 1,
            }
        )
        controls.enablePan = false;
        controls.maxDistance = 900;
        controls.minDistance = 340;

        return;

    } else if(floor == 'Ground_Floor'){
        console.log('Focus of the Ground Floor');
        //get the position of the ground floor origin.
        origin = model.getObjectByName('Ground_Library');
        controls.minDistance = 200;

    } else if (floor == 'First_Floor') {
        console.log('Focus of the First Floor');
        //get the position of the ground floor origin.
        origin = model.getObjectByName('First_Library');
        controls.minDistance = 300;
    } else if (floor == 'Second_Floor') {
        console.log('Focus of the Second Floor');
        //get the position of the ground floor origin.
        origin = model.getObjectByName('Second_Library');
        controls.minDistance = 310;
    } else {
        if(!origin) console.log('Floor name notfound to target');
    }

    origin.getWorldPosition(pos);

    //Set the controls focus on that location
    gsap.to(
        controls.target,
        {
            x : pos.x,
            y : pos.y,
            z : pos.z,
            duration : 1,
        }
    )

    controls.enablePan = false;
    controls.maxDistance = 900;
    
}

/**
 * This function will add or remove the lights from the app depending on the theme of the app. I will keep three themes. And they are Dark, Light.
 * @param {string} theme - This will be the theme of the lights 
 */
function addLights(theme){
    if(theme === 'Light_Theme'){
        // Light Theme of the 
        const color = 0xFFFFFF;
        const skyColor = 0xF1F0E4;  // Light Blue
        const groundColor = 0xFFE1D4;  // brownish orange SKY/BACKGROUND
        const intensity = 1;
        const light1 = new THREE.AmbientLight(color, intensity);
        const light2 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light1);
        scene.add(light2);

        const color_dir = 0xFFFFFF;
        const intensity_dir = 1;
        const light = new THREE.DirectionalLight(color_dir, intensity_dir);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);

        const color_dir2 = 0xFFFFFF;
        const intensity_dir2 = 0.8;
        const light_dir_2 = new THREE.DirectionalLight(color_dir2, intensity_dir2);
        light_dir_2.position.set(-790, 356, -0.91);
        light_dir_2.target.position.set(-5, 0, 0);
        scene.add(light_dir_2);
        scene.add(light_dir_2.target);
    } else if (theme === 'Dark_Theme'){
        console.log('Theme should change to dark theme')
    }
    
}


//Mesh to be instanced
let cycleMesh
let CycleStandMesh;
let AirConditioner_mesh;
let first_floor_table_instance;
let Ground_Floor_Table;
let First_Floor_Bookshelf_Instance;

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFFCDB2 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    //---------------------------------//
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    //This will set the camera position and the controls.
    resetCamera(camera,controls);
    
    
    
    // Loading the World
    loader.load( './Mesh.glb', function ( gltf ) {
        model = gltf.scene;

        // Here I have made the material of the model to be a bit more lighter.
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive = new THREE.Color(0xffffff); // same as color or lighter
                child.material.emissiveIntensity = 0.1; // increase to make it glow more
            }
        });

        scene.add( gltf.scene );

        //I would like to have the outline to be visible always
        changeOutline(1,model);

        // Mesh to be instanced
        cycleMesh = gltf.scene.getObjectByName('Cycle');
        CycleStandMesh = gltf.scene.getObjectByName('Cycle_Stand');
        AirConditioner_mesh = gltf.scene.getObjectByName('Air_Conditioner_Instance');
        first_floor_table_instance = gltf.scene.getObjectByName('First_Floor_Table_Instance');
        Ground_Floor_Table = gltf.scene.getObjectByName('Ground_Floor_Table_Instance');

        First_Floor_Bookshelf_Instance = gltf.scene.getObjectByName('First_Floor_Bookshelf_Instance');
        // const Direction_mesh = gltf.scene.getObjectByName('Direction_instance');

        if (!cycleMesh) {console.error('Mesh named "cycle" not found');return;}

        // Instancing
        createInstances(cycleMesh.geometry, cycleMesh.material,loadCycleTransforms);//Cycle Instance
        createInstances(First_Floor_Bookshelf_Instance.geometry,First_Floor_Bookshelf_Instance.material,loadFirstFloorBookshelfsTransform)//First Floor Bookshelf
        createInstances(CycleStandMesh.geometry,CycleStandMesh.material,loadCycleStandTransforms);//Cycle Stand Instance
        createInstances(AirConditioner_mesh.geometry,AirConditioner_mesh.material,loadAirConditionTransforms);//Air Conditioner Instance
        createInstances(first_floor_table_instance.geometry,first_floor_table_instance.material,loadFirstFloorTablesTransform)//First floor Tables
        createInstances(Ground_Floor_Table.geometry,Ground_Floor_Table.material,loadGroundFloorTablesTransform); //Ground Floor Tables.

        // This will form the grid object that will make the complete Nodes and Edges and GSAPs all arranged to be inter-connected.
        grid = makeGrid(model);

        //Initlaly all the gsap/nodes and edges will be gone
        enlargeGSAP(model,-2,false,false);
        controlEdgesNodes(model,-2,false,false);

        //Load the neccesary GSAPS
        allGsap.forEach((child)=>{
            let obj = model.getObjectByName(child);
            if(allGsap.includes(child)){
                allGSAP_object.push(obj);
            }

            if(outer_GSAP.includes(child)){
                outer_GSAP_object.push(obj);
            } else if(ground_floor_GSAP.includes(child)){
                ground_floor_GSAP_object.push(obj);
            } else if (first_floor_GSAP.includes(child)){
                first_floor_GSAP_object.push(obj);
            } else if (second_floor_GSAP.includes(child)){
                second_floor_GSAP_object.push(obj);
            }
            
            if(first_floor_bookshelf_gsap.includes(child)){
                first_floor_bookshelf_gsap_objects.push(obj);
            }
            
        });
        
    
    }, undefined, function ( error ) {

        console.error( error );

    } ); 

    
    
    //Add the Lightings to the scene
    addLights('Light_Theme');

    window.addEventListener( 'resize', onWindowResize );

}

init();

//------------  OCCUPANCY OF SEATS  -----------------//
//Data about the the seat occupied
function generateRandomData(number){
    let list = [];
    for(let i=0; i<number; i++){
        let temp = Math.random();
        if(Math.random() > 0.5) list.push(1);
        else list.push(0);   
    }
    return list;
}

//Generatign data about occupied setas 
const first_floor_occupied_seats = generateRandomData(50); // in first floor entrance (15 seats)
const ground_floor_occupied_seats = generateRandomData(50); // in ground floor entrance (40 seats)

//This function will make the tabke turn to brown (Reset)
function ColorReset(instancedMesh){
    let mesh = instancedMesh.instance;
    for(let i=0 ;i < instancedMesh.total; i++){
        console.log('Setting the color to brown');
        mesh.setColorAt(i,new THREE.Color(0x895129));
    }
    //important to keep on changing the color
    mesh.instanceColor.needsUpdate = true;
}
//This function will make the table turn thier color to red and green depending on the date
function setColor(instancedMesh,data){
    let mesh = instancedMesh.instance;
    for(let i=0 ;i < instancedMesh.total; i++){
        //When seat is occupied turn the table red
        if(data[i] == 0) { mesh.setColorAt(i,new THREE.Color( 0xFF2C2C )); }
        else if (data[i] == 1) { mesh.setColorAt(i,new THREE.Color( 0x5CE65C ));}
        else console.log('Check if the data entered is right');
    }
    //To allow changing the color
    mesh.instanceColor.needsUpdate = true;
}

// //Initially the color of benches will be set to brown and the crowd drop box will intilaly be node
// document.querySelector('.crowd-floor-option-container').style.display = 'none';
// ColorReset(first_floor_tables_instancedMesh);

// If the Crowd Option is Clicked.
document.querySelector('.crowd-option').addEventListener('click',()=>{
    //Floor mode options for the crowd must appear
    document.querySelector('.crowd-floor-option-container').style.display = 'flex';

    //All the tabels will be set to green and red color.
    setColor(first_floor_tables_instancedMesh,first_floor_occupied_seats);
    setColor(ground_floor_tables_instancedMesh,ground_floor_occupied_seats);
    console.log(`seat occupancy visible = ${seatOccupancyVisible}`);
});

//If the crowd back button is clicked then reset the colors of all the tables.
document.querySelector('.crowd-floor-back-button').addEventListener('clicked',()=>{
    //Reset the colors of the all the seats.
    ColorReset(first_floor_tables_instancedMesh);
    ColorReset(ground_floor_tables_instancedMesh);

    //And fianlly the crowd drop box will disappear
    document.querySelector('.crowd-floor-option-container').style.display = 'none';
});


//----------OUTLINE-------------//
//Now we can add the outline effect after creating the renderer.
const effect = new OutlineEffect( renderer );

/**
 * This fucntion will take the visibility and will set it to all the obejcts in the scenes.
 * @param {number} visiblity - Visiblity of outlien from 0 to 1
 * @param {*} mesh - This will be the model that is gltf.scene
 */
function changeOutline(visiblity, mesh){
    if(mesh){
        //Change the Visibility of all the objects in the mesh
        mesh.traverse((child)=>{
            if(child.isMesh){
                child.material.userData.outlineParameters = {
                    thickness: 0.003,
                    color: [0, 0, 0],
                    alpha: visiblity
                };
            }
        });

        console.log(`Changed ${mesh.name} outline visibilty to ${visiblity}`);
    } else {
        console.log('Mesh not found and thus no oultine could be assigned');
    }
}


//-------------------INSTANCING----------------------//

//This function could beused to scale the instance of the an instance
function setInstanceScale(id, newScale, instancedMesh) {

    const mesh = instancedMesh.instance;
    const t = instancedMesh.transform[id];

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion().setFromEuler(t.rotation);

    const scale = new THREE.Vector3(
        t.scale.x * newScale,
        t.scale.y * newScale,
        t.scale.z * newScale
    );

    matrix.compose(t.position, quaternion, scale);

    mesh.setMatrixAt(id, matrix);
    mesh.instanceMatrix.needsUpdate = true;
}

//Object whose instance needs to be controlled (like the bookshelfs, tables) could be stored here
let first_floor_bookshelf_instancedMesh = {};
let first_floor_tables_instancedMesh = {};
let ground_floor_tables_instancedMesh = {};
let airconditioner_instanced_mesh = {};

async function loadCycleTransforms() {
  const response = await fetch('./Instances/cycle_instances.json');
  return await response.json();
}
async function loadCycleStandTransforms() {
  const response = await fetch('./Instances/cycle_stand_instances.json');
  return await response.json();
}
async function loadAirConditionTransforms() {
  const response = await fetch('./Instances/Air_Conditioner_instances.json');
  return await response.json();
}
async function loadGroundFloorTablesTransform() { 
    const response = await fetch('./Instances/Ground_Floor_Table_Instance.json');
    return await response.json();
}
async function loadFirstFloorTablesTransform() { 
    const response = await fetch('./Instances/Tables_First_Floor_Instance.json');
    return await response.json();
}
async function loadFirstFloorBookshelfsTransform() { 
    const response = await fetch('./Instances/First_Floor_Bookshelfs_Instances.json');
    return await response.json();
}

async function createInstances(geometry, material,loadTransforms) {
    //Wait for the instancing data to arrive.
    const data = await loadTransforms();

    const count = data.length; //Number of Instancing

    //Instance created
    const instancedMesh = new THREE.InstancedMesh(
        geometry,
        material,
        count
    );

    //If the geomtry is First floor bookslhef (Store the instance mesh at once for now and then in the loop push the transforms of each instance)
    if(geometry == First_Floor_Bookshelf_Instance.geometry){
        //console.log('Found the mesh named First_Floor_Bookshelf_Instance');
        first_floor_bookshelf_instancedMesh = {
            instance : instancedMesh,
            transform : [],
            total : count
        }
    } else if(geometry == first_floor_table_instance.geometry){
        first_floor_tables_instancedMesh = {
            instance : instancedMesh,
            transform : [],
            total : count
        }
    } else if(geometry == Ground_Floor_Table.geometry){
        ground_floor_tables_instancedMesh = {
            instance : instancedMesh,
            transform : [],
            total : count
        }
    } else if(geometry == AirConditioner_mesh.geometry){
        airconditioner_instanced_mesh = {
            instance : instancedMesh,
            transform : [],
            total : count
        }
    }
        


    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
        const t = data[i];
        dummy.position.set(
        t.position.x,
        t.position.z,
        -t.position.y
        );

        dummy.rotation.set(
            t.rotation.x,
            t.rotation.z+ Math.PI,
            t.rotation.y
        );

        let scale_factor = 1;
        dummy.scale.set(
        scale_factor*t.scale.x,
        scale_factor*t.scale.y ,
        scale_factor*t.scale.z
        );

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        
        //Stroing the transform of instance to use later
        if(geometry == First_Floor_Bookshelf_Instance.geometry) { 
            first_floor_bookshelf_instancedMesh.transform.push(
                {
                    position : dummy.position.clone(),
                    rotation : dummy.rotation.clone(),
                    scale : dummy.scale.clone(),
                }
            );
        } else if(geometry == first_floor_table_instance.geometry){
            first_floor_tables_instancedMesh.transform.push(
                {
                    position : dummy.position.clone(),
                    rotation : dummy.rotation.clone(),
                    scale : dummy.scale.clone(),
                }
            )
        } else if(geometry == Ground_Floor_Table.geometry){
            ground_floor_tables_instancedMesh.transform.push(
                {
                    position : dummy.position.clone(),
                    rotation : dummy.rotation.clone(),
                    scale : dummy.scale.clone(),
                }
            )
        } else if(geometry == AirConditioner_mesh.geometry){
            airconditioner_instanced_mesh.transform.push(
                {
                    position : dummy.position.clone(),
                    rotation : dummy.rotation.clone(),
                    scale : dummy.scale.clone(),
                }
            )
        }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);
}

//----------Starting animation----------//
function camera_animate(){
    let screenWidth = window.innerHeight;
    let screenHeight = window.innerWidth;

    gsap.fromTo(
        ".main-menu",
        {
            opacity : 0,
            right : screenHeight/2,
            top : screenWidth/2,
        },
        {
            opacity : 1,
            top : `${10}vh`,
            right : 0,
            duration : 2,
            ease : "power4.out"
        }
    )

    gsap.fromTo(
        ".the-heading",
        {
            opacity : 0,
            left : screenHeight/2,
            top : screenWidth/2,
        },
        {
            opacity : 1,
            top : 0,
            left : 0,
            duration : 2,
            ease : "power4.out"
        }
    )
    
    gsap.fromTo(
        ".title-container",
        {
            opacity : 0,
            left : screenHeight/2,
            top : screenWidth/2,
        },
        {
            opacity : 1,
            top : 0,
            right : 0,
            duration : 2,
            ease : "power4.out"
        }
    )

    gsap.fromTo(
        ".footer-container",
        {
            marginBottom : screenWidth/2,
            opacity : 0
        },
        {
            marginBottom : 0,
            opacity  :1,
            duration : 2
        }
    )

    // gsap.fromTo(
    //     ".logo",
    //     {
    //         opacity: 0,
    //         scale: 0
    //     },
    //     {
    //         opacity: 1,
    //         scale: 1,
    //         duration: 1,
    //         ease: "power2.out"
    //     }
    // );

    gsap.fromTo( 
        camera.position,
        { 
            x: -328.746,
            y: 152.114,
            z: -150.176
        }, 
        { 
            x: 551.517,
            y: 318.043,
            z: 348.348,
            duration : 2,
            ease: "none",
            onComplete: ()=>{
                controls.minDistance = 340;
            }
        },
    );

    
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    //console.log(camera.position);
    
    controls.update();

    //Entrance Frustum Display
    if(entrance_frustum){
        animateEntrancePopup();
    }
    

    

    render();

}

function render() {

    //renderer.render( scene, camera );

    //Outline will be visible always
    effect.render( scene, camera ); 
}
