//----------CONTENT-------------//
/**
 * 1.   IMPORTS                         -   [Line 26]
 * 2.   APPLICATION FLOW                -   [Line 40]
 * 3.   A STAR ALGORTIHM                -   []
 * 4.   GSAP, EDGES, NODES CATEGORIES   -
 * 5.   LIBRARY FLOOR DISPLAY           -
 * 6.   ADMIN                           -
 * 7.   EVENT LISTENERS                 -
 * 8.   LOADING PAGE                    -
 * 9.   RAY CASTING                     -
 * 10.  ENTRANCE FRUSTUM                -
 * 11.  DIRECTION OF THE GSAP           -
 * 12.  PERCENTAGE BAR                  -
 * 13.  INITIATE                        -
 * 14.  LIGHTS                          -
 * 15.  OCCUPANCY OF SEATS              -
 * 16.  OUTLINE                         -
 * 17.  INSTANCING                      -
 * 18.  STARTING ANIMATION              -
 * 19.  EXPLORE SETTINGS                -
 */
//-----------------------------------//


//-------------IMPORTS---------------//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'; //To render the outline
import { DragControls } from 'three/addons/controls/DragControls.js';// To make the drag controls for the admin
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";





//----------------DRAG CONTROLS----------//
let draggableObjects = [];
const draggableNames = [];


let model = null;
let GSAP_Selected = null;

let camera, ortho_camera,controls, scene, renderer;

/**
 * @var {orbitalControls} - These are the controls that the user will have
 * @var {dragControls} - This is the controls that is for the admin
 * @var {transformControls} - This is the controls to be used by the admin
 */
let orbitalControls;
let dragControls;
let transformControls;

//This is the object that is clicked while attempting to transform it.
let transform_clickedObject;

//---------- APPLICATION FLOW ---------//
//This variable will guide us about the application flow
let application_flow = 0;
let previuos_application_flow = 0;

function tellApplicationFlow(){
    if(application_flow === 0){
        //console.log('You are in the "Main Menu"');
    }
    else if(application_flow === 1){
        //console.log('You are in the "Explore Floor Mode"');
    }
    else if(application_flow === 1.1){
        //console.log('You are in the "Explore GSAP Mode"');
    }
    else if(application_flow === 2){
        //console.log('You are in "Search Menu"');
    }
    else if(application_flow === 2.1){
        //console.log('You are in "Books Journal Search Menu"');
    }
    else if(application_flow === 2.2){
        //console.log('You are in "Quick Search"');
    }
    else if(application_flow === 2.3){
        //console.log('You are in "Locate Manually Search"');
    }
    else if(application_flow === 2.4){
        //console.log('You are in "Starting Point Search"');
    }
    else if(application_flow == 2.5){
        //console.log('You are in "Location Shown (Floor Mode)"');
    }
    else if(application_flow == 2.6){
        //console.log('You are in "Location Shown (GSAP Mode)"');
    }

    else if(application_flow == 3){
        //console.log('You are in "Crowd Analytics Mode (Floor Mode)"');
    }
    
    //Finally we could return the current application flow variable
    return application_flow;
}


//------------- A STAR ALGORITHM -------------//
let starting_location;//This will store the name of GSPA at the start
let ending_location; //This will store the name of GSAP at the destination.

/**
 * This function will be used to fill the nodes and the same surrounding the node. It returns the object.
 * @param {string} name - This is the name of the GSAP
 * @param {Array} nearNodes - This is the Array of names of GSAP that surrounds the added gsap
 * @returns - Return the object with the name of gsap and the nodes that connects it
 */
function makeGridObejct(name,nearNodes){
    let answer = {
        name : name,
        nearNodes : nearNodes,
    }
    return answer;
}

//Remember to make the arrange the edges and neighbouring nodes in the same order
function makeGrid(){
    const grid = { 
        //Outer Floor
        "GSAP_0_1" : makeGridObejct('GSAP_0_1',['GSAP_1_4','GSAP_0_2','GSAP_0_7','GSAP_0_11']),
        "GSAP_0_2" : makeGridObejct('GSAP_0_2',['GSAP_0_1','GSAP_0_3']),
        "GSAP_0_3" : makeGridObejct('GSAP_0_3',['GSAP_0_2']),
        "GSAP_0_4" : makeGridObejct('GSAP_0_4',['GSAP_0_5']),
        "GSAP_0_5" : makeGridObejct('GSAP_0_5',['GSAP_0_6','GSAP_0_4']),
        "GSAP_0_6" : makeGridObejct('GSAP_0_6',['GSAP_0_7','GSAP_0_5']),
        "GSAP_0_7" : makeGridObejct('GSAP_0_7',['GSAP_0_1','GSAP_0_6','GSAP_0_12','GSAP_0_8']),
        "GSAP_0_8" : makeGridObejct('GSAP_0_8',['GSAP_0_7','GSAP_0_9']),
        "GSAP_0_9" : makeGridObejct('GSAP_0_9',['GSAP_0_8','GSAP_0_10']),
        "GSAP_0_10" : makeGridObejct('GSAP_0_10',['GSAP_0_9']),
        "GSAP_0_11" : makeGridObejct('GSAP_0_11',['GSAP_0_1']),
        "GSAP_0_12" : makeGridObejct('GSAP_0_12',['GSAP_0_7','GSAP_0_13','GSAP_0_14']),
        "GSAP_0_13" : makeGridObejct('GSAP_0_13',['GSAP_0_12']),
        'GSAP_0_14' : makeGridObejct('GSAP_0_14',['GSAP_0_12']),

        //Ground Floor
        "GSAP_1_4" : makeGridObejct('GSAP_1_4',['GSAP_1_5','GSAP_1_6','GSAP_0_1']),
        "GSAP_1_6" : makeGridObejct('GSAP_1_6',['GSAP_1_7','GSAP_1_13','GSAP_1_24','GSAP_1_4','GSAP_1_25']),
        "GSAP_1_7" : makeGridObejct('GSAP_1_7',['GSAP_1_6','GSAP_1_13']),
        "GSAP_1_13" : makeGridObejct('GSAP_1_13',['GSAP_1_7','GSAP_1_14','GSAP_1_15','GSAP_1_16','GSAP_1_17','GSAP_1_19','GSAP_1_20','GSAP_1_25','GSAP_1_6']),
        "GSAP_1_15" : makeGridObejct('GSAP_1_15',['GSAP_1_14','GSAP_1_13','GSAP_1_20','GSAP_1_19','GSAP_1_16']),
        "GSAP_1_16" : makeGridObejct('GSAP_1_16',['GSAP_1_15','GSAP_1_13','GSAP_1_17']),
        "GSAP_1_17" : makeGridObejct('GSAP_1_17',['GSAP_1_16','GSAP_1_13','GSAP_1_19']),
        "GSAP_1_5" : makeGridObejct('GSAP_1_5',['GSAP_1_4']),
        "GSAP_1_19" : makeGridObejct('GSAP_1_19',['GSAP_1_13','GSAP_1_15','GSAP_1_17','GSAP_1_18','GSAP_1_32','GSAP_1_21','GSAP_1_22','GSAP_1_23','GSAP_1_20']),
        "GSAP_1_14" : makeGridObejct('GSAP_1_14',['GSAP_1_13','GSAP_1_15']),
        "GSAP_1_20" : makeGridObejct('GSAP_1_20',['GSAP_1_33','GSAP_1_25','GSAP_1_13','GSAP_1_15','GSAP_1_19']),
        "GSAP_1_18" : makeGridObejct('GSAP_1_18',['GSAP_1_19','GSAP_1_23','GSAP_1_22','GSAP_1_21','GSAP_1_32']),
        "GSAP_1_32" : makeGridObejct('GSAP_1_32',['GSAP_1_18','GSAP_1_19','GSAP_1_23','GSAP_1_21']),
        "GSAP_1_21" : makeGridObejct('GSAP_1_21',['GSAP_1_32','GSAP_1_18','GSAP_1_19','GSAP_1_23','GSAP_1_22']),
        "GSAP_1_22" : makeGridObejct('GSAP_1_22',['GSAP_1_21','GSAP_1_18','GSAP_1_19','GSAP_1_23']),
        "GSAP_1_23" : makeGridObejct('GSAP_1_23',['GSAP_1_22','GSAP_1_21','GSAP_1_32','GSAP_1_18','GSAP_1_19']),
        "GSAP_1_33" : makeGridObejct('GSAP_1_33',['GSAP_1_20','GSAP_2_1']),
        "GSAP_1_25" : makeGridObejct('GSAP_1_25',['GSAP_1_20','GSAP_1_13','GSAP_1_6','GSAP_1_26','GSAP_1_24']),
        "GSAP_1_24" : makeGridObejct('GSAP_1_24',['GSAP_1_25','GSAP_1_6','GSAP_1_26']),
        "GSAP_1_26" : makeGridObejct('GSAP_1_26',['GSAP_1_27','GSAP_1_24','GSAP_1_25','GSAP_1_6']),
        "GSAP_1_27" : makeGridObejct('GSAP_1_27',['GSAP_1_26','GSAP_1_30','GSAP_1_28','GSAP_1_29']),
        "GSAP_1_30" : makeGridObejct('GSAP_1_30',['GSAP_1_27','GSAP_1_28']),
        "GSAP_1_28" : makeGridObejct('GSAP_1_28',['GSAP_1_27','GSAP_1_29','GSAP_1_31','GSAP_1_30']),
        "GSAP_1_29" : makeGridObejct('GSAP_1_29',['GSAP_1_27','GSAP_1_28']),
        "GSAP_1_31" : makeGridObejct('GSAP_1_31',['GSAP_1_28']),

        //First Floor
        "GSAP_2_1" : makeGridObejct('GSAP_2_1',['GSAP_1_33','GSAP_2_2']),
        "GSAP_2_2" : makeGridObejct('GSAP_2_2',['GSAP_2_1','GSAP_2_4','GSAP_2_3','GSAP_2_5','GSAP_2_6','GSAP_2_12','GSAP_2_11']),
        "GSAP_2_3" : makeGridObejct('GSAP_2_3',['GSAP_2_2','GSAP_2_4','GSAP_2_5','GSAP_2_6']),
        "GSAP_2_4" : makeGridObejct('GSAP_2_4',['GSAP_2_3','GSAP_2_5','GSAP_2_6','GSAP_2_2']),
        "GSAP_2_5" : makeGridObejct('GSAP_2_5',['GSAP_2_4','GSAP_2_3','GSAP_2_2','GSAP_2_6']),
        "GSAP_2_6" : makeGridObejct('GSAP_2_6',['GSAP_2_7','GSAP_2_4','GSAP_2_5','GSAP_2_3','GSAP_2_2']),
        "GSAP_2_7" : makeGridObejct('GSAP_2_7',['GSAP_2_6','GSAP_2_8','GSAP_2_9','GSAP_2_10','GSAP_2_15','GSAP_3_1','GSAP_2_17']),
        "GSAP_2_8" : makeGridObejct('GSAP_2_8',['GSAP_2_7','GSAP_2_15','GSAP_2_10','GSAP_2_9']),
        "GSAP_2_9" : makeGridObejct('GSAP_2_9',['GSAP_2_7','GSAP_2_8','GSAP_2_15','GSAP_2_10']),
        "GSAP_2_10" : makeGridObejct('GSAP_2_10',['GSAP_2_7','GSAP_2_9','GSAP_2_8','GSAP_2_15']),
        "GSAP_2_15" : makeGridObejct('GSAP_2_15',['GSAP_2_7','GSAP_2_10','GSAP_2_8','GSAP_2_9']),
        "GSAP_2_11" : makeGridObejct('GSAP_2_11',['GSAP_2_2','GSAP_2_16','GSAP_2_12']),
        "GSAP_2_12" : makeGridObejct('GSAP_2_12',['GSAP_2_11','GSAP_2_2','GSAP_2_13',...first_floor_part_A_gsap,...first_floor_part_C_gsap]),
        "GSAP_2_13" : makeGridObejct('GSAP_2_13',['GSAP_2_12','GSAP_2_14',...first_floor_part_B_gsap,...first_floor_part_D_gsap]),
        "GSAP_2_14" : makeGridObejct('GSAP_2_14',['GSAP_2_13']),
        "GSAP_2_16" : makeGridObejct('GSAP_2_16',['GSAP_2_11']),
        "GSAP_2_17" : makeGridObejct('GSAP_2_17',['GSAP_2_7']),

        //Books Shelf GSAP

        "GSAP_T_1" : makeGridObejct( 'GSAP_T_1',['GSAP_2_12']),
        "GSAP_T_2" : makeGridObejct( 'GSAP_T_2',['GSAP_2_12']),
        "GSAP_T_3" : makeGridObejct( 'GSAP_T_3',['GSAP_2_12']),
        "GSAP_T_4" : makeGridObejct( 'GSAP_T_4',['GSAP_2_12']),
        "GSAP_T_5" : makeGridObejct( 'GSAP_T_5',['GSAP_2_12']),
        "GSAP_T_6" : makeGridObejct( 'GSAP_T_6',['GSAP_2_12']),

        "GSAP_T_21" : makeGridObejct('GSAP_T_21',['GSAP_2_12']),
        "GSAP_T_22" : makeGridObejct('GSAP_T_22',['GSAP_2_12']),
        "GSAP_T_23" : makeGridObejct('GSAP_T_23',['GSAP_2_12']),
        "GSAP_T_24" : makeGridObejct('GSAP_T_24',['GSAP_2_12']),
        "GSAP_T_25" : makeGridObejct('GSAP_T_25',['GSAP_2_12']),
        "GSAP_T_26" : makeGridObejct('GSAP_T_26',['GSAP_2_12']),
        "GSAP_T_27" : makeGridObejct('GSAP_T_27',['GSAP_2_12']),
        "GSAP_T_28" : makeGridObejct('GSAP_T_28',['GSAP_2_12']),
        "GSAP_T_29" : makeGridObejct('GSAP_T_29',['GSAP_2_12']),
        "GSAP_T_30" : makeGridObejct('GSAP_T_30',['GSAP_2_12']),

        "GSAP_T_13" : makeGridObejct('GSAP_T_13',['GSAP_2_13']),
        "GSAP_T_14" : makeGridObejct('GSAP_T_14',['GSAP_2_13']),
        "GSAP_T_15" : makeGridObejct('GSAP_T_15',['GSAP_2_13']),
        "GSAP_T_16" : makeGridObejct('GSAP_T_16',['GSAP_2_13']),
        "GSAP_T_17" : makeGridObejct('GSAP_T_17',['GSAP_2_13']),
        "GSAP_T_18" : makeGridObejct('GSAP_T_18',['GSAP_2_13']),
        "GSAP_T_19" : makeGridObejct('GSAP_T_19',['GSAP_2_13']),

        "GSAP_T_47" : makeGridObejct('GSAP_T_47',['GSAP_2_13']),
        "GSAP_T_48" : makeGridObejct('GSAP_T_48',['GSAP_2_13']),
        "GSAP_T_49" : makeGridObejct('GSAP_T_49',['GSAP_2_13']),
        "GSAP_T_50" : makeGridObejct('GSAP_T_50',['GSAP_2_13']),
        "GSAP_T_51" : makeGridObejct('GSAP_T_51',['GSAP_2_13']),
        "GSAP_T_52" : makeGridObejct('GSAP_T_52',['GSAP_2_13']),
        "GSAP_T_53" : makeGridObejct('GSAP_T_53',['GSAP_2_13']),
        "GSAP_T_54" : makeGridObejct('GSAP_T_54',['GSAP_2_13']),
        "GSAP_T_55" : makeGridObejct('GSAP_T_55',['GSAP_2_13']),
        "GSAP_T_56" : makeGridObejct('GSAP_T_56',['GSAP_2_13']),
        "GSAP_T_57" : makeGridObejct('GSAP_T_57',['GSAP_2_13']),
        "GSAP_T_58" : makeGridObejct('GSAP_T_58',['GSAP_2_13']),
        "GSAP_T_59" : makeGridObejct('GSAP_T_59',['GSAP_2_13']),
        "GSAP_T_60" : makeGridObejct('GSAP_T_60',['GSAP_2_13']),
        "GSAP_T_61" : makeGridObejct('GSAP_T_61',['GSAP_2_13']),
        "GSAP_T_62" : makeGridObejct('GSAP_T_62',['GSAP_2_13']),
        "GSAP_T_63" : makeGridObejct('GSAP_T_63',['GSAP_2_13']),
        "GSAP_T_64" : makeGridObejct('GSAP_T_64',['GSAP_2_13']),

        //Second Floor
        "GSAP_3_1" : makeGridObejct('GSAP_3_1',['GSAP_3_7','GSAP_3_2','GSAP_3_8','GSAP_3_9','GSAP_3_13','GSAP_3_12','GSAP_3_11','GSAP_3_10','GSAP_3_14']),
        "GSAP_3_2" : makeGridObejct('GSAP_3_2',['GSAP_3_3','GSAP_3_1','GSAP_3_17']),
        "GSAP_3_3" : makeGridObejct('GSAP_3_3',['GSAP_3_2','GSAP_3_4','GSAP_3_5','GSAP_3_6','GSAP_3_7','GSAP_3_15','GSAP_3_16']),
        "GSAP_3_4" : makeGridObejct('GSAP_3_4',['GSAP_3_3','GSAP_3_16']),
        "GSAP_3_5" : makeGridObejct('GSAP_3_5',['GSAP_3_3']),
        "GSAP_3_6" : makeGridObejct('GSAP_3_6',['GSAP_3_3']),
        "GSAP_3_7" : makeGridObejct('GSAP_3_7',['GSAP_3_3']),
        "GSAP_3_8" : makeGridObejct('GSAP_3_8',['GSAP_3_1']),
        "GSAP_3_9" : makeGridObejct('GSAP_3_9',['GSAP_3_1']),
        "GSAP_3_10" : makeGridObejct('GSAP_3_10',['GSAP_3_1']),
        "GSAP_3_11" : makeGridObejct('GSAP_3_11',['GSAP_3_1','GSAP_3_19']),
        "GSAP_3_12" : makeGridObejct('GSAP_3_12',['GSAP_3_1']),
        "GSAP_3_13" : makeGridObejct('GSAP_3_13',['GSAP_3_1']),
        "GSAP_3_14" : makeGridObejct('GSAP_3_14',['GSAP_3_1']),
        "GSAP_3_15" : makeGridObejct('GSAP_3_15',['GSAP_3_3']),
        "GSAP_3_16" : makeGridObejct('GSAP_3_16',['GSAP_3_4','GSAP_3_3']),
        "GSAP_3_17" : makeGridObejct('GSAP_3_17',['GSAP_3_2','GSAP_3_18']),
        "GSAP_3_18" : makeGridObejct('GSAP_3_18',['GSAP_3_17']),
        'GSAP_3_19' : makeGridObejct('GSAP_3_19',['GSAP_3_20','GSAP_3_11']),
        'GSAP_3_20' : makeGridObejct('GSAP_3_20',['GSAP_3_19'])
    }

    return grid;
}

//After filling the names of all the nodes and edges we will form the directionality of the graph
let grid;

// This will be an array of object that will have the key containign the node (gird type) and the weight (Edge_lenght)
const priority_queqe_cards = [];
//This will store the names of mesh that the algorithm has visited
const visited_node = [];

/**
 * Function takes Starting and Ending Node of grid and returns the object containing the information about the Edges and Nodes and GSAP in Squence to connect the Two Points.
 * @param {string} starting_location - Name of the Node at the Starting location
 * @param {string} ending_location - Name of the Node at the Ending Location.
 */
function a_star_init(model,starting_location,ending_location){

    priority_queqe_cards.length = 0;
    visited_node.length = 0;

    // Starting and Ending must have some name from the grid object
    const starting_grid_object = grid[starting_location];
    const ending_grid_object = ending_location;

    visited_node.push(starting_grid_object.name);

    let initial_card = {
        node : starting_grid_object,
        edge_length : 0,
        path_array : [starting_grid_object.name],
    }

    //Then pass the starting grid object along with the parent edge lenght
    return a_star_algorithm(model,initial_card.node,ending_grid_object,initial_card.edge_length,initial_card.path_array);
}

/**
 * 
 * @param {object} current_node - This is the starting location gsap object
 * @param {object} destination_node - This is the destination location gsap object
 * @param {number} edge_length - This is the lenght of the total distance that is travelled
 * @param {Array} path - This is the array that contians all the GSAP obejcts in the path
 * @returns - This is the paht that the function returns. (Array of all the gsap that needs to be activated)
 */
function a_star_algorithm(model,current_node,destination_node,edge_length,path){

    //We will first check if we are dealing with the destination node
    if(current_node.name == destination_node){
        //Then return the path of all the nodes.
        return path;
    }

    // Find the neighbours of current node
    current_node.nearNodes.forEach((child)=>{
        
        //And if there exist any unvisited node.
        if(!visited_node.includes(child)){
            // Get the lenght of the edge
            let length = A_to_B_Distance(model,child,current_node.name,1) + edge_length;

            //console.log(`Current_Child = ${current_node.name} | child name is ${child.name} | lenght = ${lenght}`);

            let card = {
                node : grid[child],
                edge_length : length,
                path_array : [...path,child], //maintain an array that contains the information about the path travelled
            }

            //And then push this into the priority qeuqe
            priority_queqe_cards.push(card);
        };
    })

    //Now once all the neighbours are put into the priority card we can now pick the item from the priority with minimum edge length
    let edge = [];
    priority_queqe_cards.forEach((child)=>{edge.push(child.edge_length);})
    let min_edge = Math.min(...edge);
    let next_node = null;

    //console.log(`At the tiem when current child is ${current_node.name} | priority queue is ${priority_queqe_cards}`);

     //If the prioritry card is empty
    if(priority_queqe_cards.length === 0){
        console.log("No path found");
        return null;
    }

    //Select the Card with minimum edge lenght.
    priority_queqe_cards.forEach((child)=>{
        
        if(child && child.edge_length === min_edge){
            //When the child is with minimum edge lenght
            let index = priority_queqe_cards.indexOf(child);
            //Pop it out of the priority queue.
            if(index !== -1){
                priority_queqe_cards.splice(index,1);
            }
            //Store that child in this variable named next node.
            next_node = child;

            if(!next_node.node){
                //console.log(`Check for the node ${next_node.node} which is the child of ${current_node.name}`);
            }
            //And push this to the visited node's name
            visited_node.push(next_node.node.name);
        }
    });

    // And now we will again call this function but with the current node equal to next_node.node, and edge_lenght of next_node.edge_lenght
    return a_star_algorithm(model,next_node.node,destination_node,next_node.edge_length,next_node.path_array);;
}

/**
 * This function will be used to find the distance between the two nodes A and B. Enter the object itself
 * @param {*} A_node - This is the name of one GSAP 
 * @param {*} B_node - This is the name of another GSAP
 * Penalty will be equal to 1 for now.
 */
function A_to_B_Distance(model,A_node,B_node,penalty){
    //If they are the same object then return 0
    if(A_node == B_node){return 0;}

    // And then find the distance between them
    let position1 = new THREE.Vector3();
    let position2 = new THREE.Vector3();

    // Get the object by the name
    A_node = model.getObjectByName(A_node);
    B_node = model.getObjectByName(B_node);

    A_node.getWorldPosition(position1);
    B_node.getWorldPosition(position2);

    //And now find the distance ebtween them
    let distance = Math.sqrt( Math.pow(( (position1.x - position2.x) ) ,2) + Math.pow(( position1.y - position2.y ) , 2) + Math.pow( ( position1.z  - position2.z) , 2));
    let weight = distance * penalty;

    return weight;
}




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
        for(let i = 1 ;i <= 17; i++){
            first_floor_GSAP.push(`GSAP_${floor+1}_${i}`);
        }
    } 
    //Filling the Second Floor GSAP
    else if(floor == 2){
        for(let i = 1 ;i <= 20; i++){
            second_floor_GSAP.push(`GSAP_${floor+1}_${i}`);
        }
    }
}

//Also add the first floor GSAP with books depending on thier nomenclature
const first_floor_part_A_gsap = [];
const first_floor_part_B_gsap = [];
const first_floor_part_C_gsap = [];
const first_floor_part_D_gsap = [];


for(let i=1 ; i<=64 ; i++){
    let part_gsap = null;
    if(i >= 1 && i <= 6){
        part_gsap = first_floor_part_A_gsap;
    }
    else if(i >= 13 && i <= 19){
        part_gsap = first_floor_part_B_gsap;
    }
    else if(i >= 21 && i <= 30){
        part_gsap = first_floor_part_C_gsap;
    }
    else if(i >= 47 && i <= 64){
        part_gsap = first_floor_part_D_gsap;
    }

    if(part_gsap){
        part_gsap.push(`GSAP_T_${i}`);
    }
}

//This is the namesof all the booksl;hes that will be used to scale them down
const first_floor_bookshelf = [];
for(let i = 1; i<=64 ; i++){first_floor_bookshelf.push(String(i));}
const first_floor_bookshelf_object = [];

const first_floor_bookshelf_gsap = [...first_floor_part_A_gsap,...first_floor_part_B_gsap,...first_floor_part_C_gsap,...first_floor_part_D_gsap];
const first_floor_bookshelf_gsap_objects = [];
//Update the Second Floor GSAP
first_floor_GSAP.push(...first_floor_bookshelf_gsap);

//All the GSAPs
const allGsap = [...outer_GSAP,...ground_floor_GSAP,...first_floor_GSAP,...second_floor_GSAP,];
const allGSAP_object = [];

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

//This function is to update the locatino of the GSAP
async function createGsapInfo(){

    let {data,error} = await supabase
        .from('gsap_database')
        .select('*')

    if(error){
        console.error(error);
    } else {
        for(let i=0;i<data.length;i++){
            //console.log(`Loaded ${data[i].gsap_mesh_name} GSAP objects`);

            let gsap_name = data[i].gsap_mesh_name;
            let gsap_obj = model.getObjectByName(gsap_name);

            if(gsap_obj){
                //And then update the gsap cordinates
                gsap_obj.position.set(data[i].x_pos , data[i].y_pos , data[i].z_pos);
                gsap_obj.rotation.set(data[i].x_rot , data[i].y_rot , data[i].z_rot);
            }

            //console.log(`i = ${i}`);
        }
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
for (let i = 1; i <= 9;i++){ 
    first_floor_library_child.push(`${first_floor_library_child[0]}_${i}`); 
}
//Also the bookshelf will be added into the first floor
const first_floor_bookshelf_name = [];
for(let i=1; i<=64; i++){
    if(i!=54){
        first_floor_bookshelf_name.push(`${i}`);
    }
    
}




//And then push this bookshelfs into the first floor bookshelfs
first_floor_library_child.push(...first_floor_bookshelf_name);

// Second Floor (Cube1178, Cube1178_1 ... Cube1178_6)
const second_floor_library_child = [];
second_floor_library_child.push('Cube1178');
for (let i = 1; i <= 7;i++){ second_floor_library_child.push(`${second_floor_library_child[0]}_${i}`); }
second_floor_library_child.push('Plane')

/**************** Tables *******************/
const ground_floor_table_names = [];
const first_floor_table_2_names = [];
const first_floor_table_names = [];
const second_floor_tables_names = [];

for(let i = 1 ; i<=111 ; i++){second_floor_tables_names.push(`Second_Floor_Table_Instance_${i}`);}
for(let i=1 ; i<=7 ; i++){first_floor_table_2_names.push(`First_Floor_Table_2_instance_${i}`);}
for(let i=1 ; i<=34 ; i++){first_floor_table_names.push(`First_Floor_Table_Instance_${i}`);}
for (let i=1 ; i<=26 ;i++){ground_floor_table_names.push(`Ground_Floor_Table_Instance_${i}`);}

//Pushing the tables inside the childs of different floors of the library
ground_floor_library_child.push(...ground_floor_table_names);
first_floor_library_child.push(...first_floor_table_2_names,...first_floor_table_names);
second_floor_library_child.push(...second_floor_tables_names);

const allTables  = [
    ...ground_floor_table_names, 
    ...first_floor_table_names,
    ...second_floor_tables_names,
    ...first_floor_table_2_names,
];


//This will put the tables in the right position according to database
async function createTablesInfo() {
    let { data, error } = await supabase
        .from('table_database')
        .select('*');

    if (error) {
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        console.warn('No table data found');
        return;
    }

    const tableMap = {};

    data.forEach(item => {
        tableMap[item.table_mesh_name] = item;
    })

    for (let i = 0; i < allTables.length; i++) {

        let table_name = allTables[i];
        let table = model.getObjectByName(table_name);

        if (!table) {
            console.warn(`Table not found: ${table_name}`);
            continue;
        }

        let item = tableMap[table_name];

        table.position.set(item.x_pos, item.y_pos, item.z_pos);
        table.rotation.set(item.x_rot, item.y_rot, item.z_rot);
        table.scale.set(item.x_sca, item.y_sca, item.z_sca);
    }
}

/*********************************************************************************/

// Wall of the Library
const wall_library = [];
wall_library.push('Cube018');
for (let i = 1; i <= 8;i++){ wall_library.push(`${wall_library[0]}_${i}`);}

// Ground to First Stairs
const ground_to_first_stair = 'Ground_First_Stairs';

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
    'First_Floor_Table_2_instance',
    ...library_child, //Spread Operator
    ground_to_first_stair,
    first_to_second_stairs
];

//All the GSAP and all the bookshelf in the first floor will be draggable
draggableNames.push(...allGsap);
draggableNames.push(...first_floor_bookshelf);
draggableNames.push(...allTables);
draggableNames.push()

//Push them in the respective floor childs

/**
 * 
 * @param {string} floor - "Basement_Floor" , "Ground_Floor" , "First_Floor" , "Second_Floor" 
 */
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
        //Make everythign in the first floor to be of the scale zero.
        model.traverse((child)=>{
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
        //Make the instances of all the aicondiitoners to zero
        for(let i=0; i < airconditioner_instanced_mesh.total;i++){setInstanceScale(i,0,airconditioner_instanced_mesh);}
        //make the instances of all the switch borads in the firts floor to be zero
        for(let i=0; i < first_floor_switch_board_instanceMesh.total;i++){setInstanceScale(i,0,first_floor_switch_board_instanceMesh);}

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
                            // Airconditioner Instances scale reset
                            for(let i=0; i < airconditioner_instanced_mesh.total;i++){setInstanceScale(i,1,airconditioner_instanced_mesh);}
                            // Switch Board at the first floor reset
                            for(let i=0; i < first_floor_switch_board_instanceMesh.total;i ++){setInstanceScale(i,1,first_floor_switch_board_instanceMesh);}
                            //Switch Board at the ground floor reset
                            for(let i=0; i < ground_floor_switch_board_instanceMesh.total;i ++){setInstanceScale(i,1,ground_floor_switch_board_instanceMesh);}

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
            //console.log('Library reset. No callback function');
            isLibraryReset = 1;
        });

        current_floor = -1;

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1 || application_flow == 4.3){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
            model.getObjectByName(ending_location).scale.set(0,0,0);
        } else if(application_flow == 2.7){
            //When the ground floor is clicked I will make all the GSAP at the firat and second floor which also included in the quick searhc to scale zero
            quickSearch_GSAP.forEach((child)=>{
                if(child){
                    //if the gsap is in the first floor or inthe second floor make it's scale to zero.
                    if(!outer_GSAP.includes(child.name)){
                        gsap.to(
                            child.scale,
                            {
                                x : 0,
                                y : 0,
                                z : 0,
                                duration : 1
                            }
                        )
                    } else {
                        gsap.to(
                            child.scale,
                            {
                                x : 1,
                                y : 1,
                                z : 1,
                                duration : 1
                            }
                        )
                    }
                } 
            })
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
            //console.log('Library is rest and now the ground floor has appeared');
            isLibraryReset = 0;
        })

        //update the current floor
        current_floor = 0;

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1 || application_flow == 4.3){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.7){
            //When the ground floor is clicked I will make all the GSAP at the firat and second floor which also included in the quick searhc to scale zero
            quickSearch_GSAP.forEach((child)=>{
                if(child){
                    //if the gsap is in the first floor or inthe second floor make it's scale to zero.
                    if(!ground_floor_GSAP.includes(child.name)){
                        gsap.to(
                            child.scale,
                            {
                                x : 0,
                                y : 0,
                                z : 0,
                                duration : 1
                            }
                        )
                    } else {
                        gsap.to(
                            child.scale,
                            {
                                x : 1,
                                y : 1,
                                z : 1,
                                duration : 1
                            }
                        )
                    }
                } 
            })
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
            //Make the first floor of the library visible
            makeVisible('First_Floor');
            //console.log('Library is rest and now the first floor has appeared');
            isLibraryReset = 0;
        })

        current_floor = 1;

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1 || application_flow == 4.3){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);

            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
            model.getObjectByName(ending_location).scale.set(0,0,0);
        } else if(application_flow == 2.7){
            //When the ground floor is clicked I will make all the GSAP at the second floor which also included in the quick search to scale zero
            quickSearch_GSAP.forEach((child)=>{
                //if the gsap is in the first floor or inthe second floor make it's scale to zero.
                if(child){
                    //if the gsap is in the first floor or inthe second floor make it's scale to zero.
                    if(!first_floor_GSAP.includes(child.name)){
                        gsap.to(
                            child.scale,
                            {
                                x : 0,
                                y : 0,
                                z : 0,
                                duration : 1
                            }
                        )
                    } else {
                        gsap.to(
                            child.scale,
                            {
                                x : 1,
                                y : 1,
                                z : 1,
                                duration : 1
                            }
                        )
                    }
                }
            })
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
            //console.log('Library is rest and now the second floor has appeared');
            isLibraryReset = 0;
        })

        current_floor = 2;

        //console.log(application_flow)

        //if we are in [1], we must show all the gsap in the ground floor
        if(application_flow == 1 || application_flow == 4.3){
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
        } else if(application_flow == 2.3){
            
            //First make all the other gsap to zero
            enlargeGSAP(model,-2,false,false);

            //Then make the outer gspa to scale one
            enlargeGSAP(model,current_floor,false,true);

        } else if(application_flow == 2.4){
            //Enable all the gsap dependinng on the floor except for the starting gsap
            enlargeGSAP(model,-2,false,false);
            enlargeGSAP(model,current_floor,false,true);
            model.getObjectByName(ending_location).scale.set(0,0,0);
        } else if(application_flow == 2.7){
            //When the ground floor is clicked I will make all the GSAP at the second floor which also included in the quick search to scale zero
            quickSearch_GSAP.forEach((child)=>{
                //Scale up the gsap at the second floor
                if(child){
                    //if the gsap is in the first floor or inthe second floor make it's scale to zero.
                    if(!second_floor_GSAP.includes(child.name)){
                        gsap.to(
                            child.scale,
                            {
                                x : 0,
                                y : 0,
                                z : 0,
                                duration : 1
                            }
                        )
                    } else {
                        gsap.to(
                            child.scale,
                            {
                                x : 1,
                                y : 1,
                                z : 1,
                                duration : 1
                            }
                        )
                    }
                }
            })
        }
    })
})


//------------------ADMIN------------------//

//When the admin button is clicked
const admin_option = document.querySelector('.Admin-option');

//-------------[0 to 4]-------------//
admin_option.addEventListener('click',onAdminClick);
function onAdminClick(){
    //Update the application flow
    if(application_flow != 4){
        previuos_application_flow = application_flow;
        application_flow = 4;
    }

    console.log('Admin Option is clicked');
    

    //Make the login page to appear
    document.querySelector('.login-position').style.display = 'flex';
}

//-------------[4 to 0]-------------//
document.querySelectorAll('.Admin-login-back-button').forEach((back)=>{
    back.addEventListener('click',()=>{
        if(application_flow != 0){
            previuos_application_flow = application_flow;
            application_flow = 4;
        }

        console.log('Back is clicked')

        //Make the login page disappear
        document.querySelector('.login-position').style.display = 'none';
        //Make the fail login pop up also to disappear
        document.querySelector('.login-fail-position').style.display = 'none';
    })
})

//------------[4 to 4.1 or 0]-----------//
const URL = 'https://ucgglihqtekveakwhigf.supabase.co'; //The URL to access the database
let KEY = 'sb_publishable_-3BA_lJu2juHcf_7ofpWOg_R_leY0aA';//This is the API Key
const supabase = createClient(URL, KEY);
/**
 * This functino will be used to tap into the API and get the password from the environment variable of the Supabase.
 * @param {pass} - This is the password that will be checked
 */

//This will test the api key and will return boolean depending on the right key entered
async function testAPI(id,pass) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: id,
        password: pass
    });

    if(error){
        console.error(error);
        return false;

    } else{
        console.log(data);
        return true;
    }
}

//------------[4 to 4.1]-----------------//
const admin_form = document.querySelector('#loginForm');
const admin_id = document.querySelector('#Admin_id');
const admin_pass = document.querySelector('#Admin_pass');

admin_form.addEventListener('submit', async function (e) {

    e.preventDefault();

    let id  = (String)(admin_id.value);
    let pass = (String)(admin_pass.value);

    

    //Make the login page to disappear
    document.querySelector('.login-position').style.display = 'none';

    //Check if the pass word is the right one
    if(await testAPI(id,pass)){
        //Successful login

        //Update the application flow
        if(application_flow != 4.1){
            previuos_application_flow = application_flow;
            application_flow = 4.1;
        }

        //Change the UI
        document.querySelectorAll('.main-menu-option').forEach((child)=>{
            child.style.display = 'none';
        });
        document.querySelector('.Admin-option-drop-box').style.display = 'flex';
        document.querySelector('.admin-option-container').style.display = 'flex';

    } else {
        //Error in login

        //Update the application flow
        if(application_flow != 0){
            previuos_application_flow = application_flow;
            application_flow = 0;
        }

        //Make the Fail pop up to appear
        document.querySelector('.login-fail-position').style.display = 'flex';

    }

    admin_form.reset();
});

//Now I can add the eventlistener to enable the user to click a specific key
document.addEventListener('keydown',(event)=>{
    if(event.key == 'r'){
        transformControls.setMode('rotate');
    } else if (event.key == 'g'){
        transformControls.setMode('translate');
    } else if (event.key == 's'){
        transformControls.setMode('scale');
    }
})

//-------------[4.1 to 4.4]-------------//
document.querySelector('.connections-admin-option').addEventListener('click',async ()=>{
    console.log('Here the admin must be able to change the connection of GSAP');

})

//-------------[4.1 to 4.3]--------------//
document.querySelector('.transform-admin-option').addEventListener('click',async ()=>{
    console.log('You are inside the bookshelf option')
    
    //Update the application flow
    if(application_flow != 4.3){
        previuos_application_flow = application_flow;
        application_flow = 4.3;
    } 
    
    //Update the 

    //Update the controls
    orbitalControls.enabled = true;
    transformControls.enabled = true;
    controls = transformControls;
    
    //add the helper in the scene
    scene.add(transformControls.getHelper());

    //By Default keep the transform to translate
    transformControls.setMode('translate');

    //Update the UI
    document.querySelector('.admin-floor-option-container').style.display = 'flex';
    document.querySelector('.admin-option-container').style.display = 'none';

    //Make the admin info for bookshelf to appear
    document.querySelector('.admin-info-position').style.display = 'block';
    document.querySelector('.admin-bookshelf-info').style.display = 'flex';
})

//-------------[4.1 to 4.2]---------------//
document.querySelector('.frustum-admin-option').addEventListener('click',()=>{
    //Update the application flow
    if(application_flow != 4.2){
        previuos_application_flow = application_flow;
        application_flow = 4.2;
    }

    //Keep the transform disabled (Since we are only required to change the frustum)

    //Update the UI
    document.querySelector('.admin-floor-option-container').style.display = 'flex';
    document.querySelector('.admin-option-container').style.display = 'none';

    //Make the admin info for the frustum UI to appear
    document.querySelector('.admin-info-position').style.display = 'block';
    document.querySelector('.admin-frustum-info').style.display = 'flex';

});

//This is the from for the frustum that will be used to save and make chnages int he frusutm settigns
const frustum_edit_form = document.querySelector('#admin-frustum-range');
const frustum_edit_search = document.querySelector('.admin-frustum-quick-search');
const frustum_edit_link = document.querySelector('.admin-frustum-website');
const frustum_edit_content = document.querySelector('.admin-frustum-content');
const frustum_edit_heading = document.querySelector('.admin-frustum-heading');

//This is the selected frustum object
let selected_frustum_edit_obejct = null;

frustum_edit_form.addEventListener('submit',async (e)=>{
    e.preventDefault();

    const heading = (String)(frustum_edit_heading.value);
    const content = (String)(frustum_edit_content.value);
    const link = (String)(frustum_edit_link.value);
    const search = (String)(frustum_edit_search.value);

    //Print the input of the frustum form
    console.log(`Frustum Heading : ${heading}`);
    console.log(`Content : ${content}`);
    console.log(`Link : ${link}`);
    console.log(`search : ${search}`);

    //Update the Frustum of the selected object
    frustum_info[selected_frustum_edit_obejct.name].heading = heading;
    frustum_info[selected_frustum_edit_obejct.name].content = content;
    frustum_info[selected_frustum_edit_obejct.name].website = link;
    frustum_info[selected_frustum_edit_obejct.name].quick_search = search;

    //Update the Frustum content in the Databse
    document.querySelector('.loading-text').textContent = 'Saving Frustum...';
    loading_page.style.display = 'block'
    
    let {data,error} = await supabase
        .from('frustum_database')
        .update({
            frustum_heading: heading,
            frustum_content: content,
            frustum_website: link,
            frustum_search: search
        })
        .eq('frustum_mesh_name', selected_frustum_edit_obejct.name);

    if(error){
        console.log(error);
    }

    loading_page.style.display = 'none';

    //Make the selected object to be white again
    if(selected_frustum_edit_obejct){
        //Make the obejct color to white again
        selected_frustum_edit_obejct.material.color.set(0xffffff);
    }

    frustum_edit_form.reset();
})

function onObjectSelectFrustumEdit(selected_object){
    if(selected_frustum_edit_obejct){
        //Make the obejct color to white again
        selected_frustum_edit_obejct.material.color.set(0xffffff);
    }

    //Then make the object selected red in color to be identified
    selected_frustum_edit_obejct = selected_object;
    selected_frustum_edit_obejct.material.color.set(0xFF0000);
    
    //Update the Frustum heading and content and link of this frustum of this object
    frustum_edit_heading.value = frustum_info[selected_object.name].heading;
    frustum_edit_content.value = frustum_info[selected_object.name].content;
    frustum_edit_link.value = frustum_info[selected_object.name].website;
    frustum_edit_search.value = frustum_info[selected_object.name].quick_search;

    //Update the object and the gsap heading
    document.querySelector('.frustum-info-object-name').textContent = `${selected_object.name}`;
    document.querySelector('.frustum-info-gsap-name').textContent = `${frustum_info[selected_object.name].gsap_name}`;

}

//------------[4.3 to 4.1]----------//
document.querySelector('.admin-floor-back-button').addEventListener('click',()=>{
    console.log('You are in the main admin menu');
    if(application_flow !== 4){
        previuos_application_flow = application_flow;
        application_flow = 4;
    }

    //Empty the draggable objects
    //draggableObjects = [];

    //Update the controls
    transformControls.enabled = false;
    controls = orbitalControls;
    //Remove the helper
    scene.remove(transformControls.getHelper());

    //Reset the library
    libraryScaleReset(()=>{
        console.log('');
    });

    //Reset the camera
    resetCamera(camera,controls);

    //Update the UI
    document.querySelector('.admin-floor-option-container').style.display = 'none';
    document.querySelector('.admin-option-container').style.display = 'flex';
    //Admin info must disappear
    document.querySelector('.admin-info-position').style.display = 'none';
    document.querySelectorAll('.admin-info').forEach((child)=>{child.style.display = 'none';})

    //Update the title and the helper content
})

//------------[4.1 to 4]-----------//


document.querySelector('.admin-save-button').addEventListener('click',async ()=>{
    //When the save button is clicked update all the bookshelfs and frustum and the gsap in the database, and then copy the location of book;sejfs and gsap and frustum from the dtaabse before logging out.

    //Make the loading page to appear
    loading_page.style.display = 'block';
    loading_page.querySelector('.loading-text').textContent = 'Saving Bookshelves...';

    //Update the transform of all the bookshelf
    for(let i = 0; i<first_floor_bookshelf_name.length; i++){

        //I have the booksehlf
        let bookshelf = model.getObjectByName(first_floor_bookshelf_name[i]);

        //Then i find it's location
        let pos = new THREE.Vector3();
        bookshelf.getWorldPosition(pos);
        let rot = bookshelf.rotation;
        let sca = bookshelf.scale;
        

        //Then update that to the database
        let {data,error} = await supabase
            .from('bookshelf_database')
            .update({
                x_pos : pos.x,
                y_pos : pos.y,
                z_pos : pos.z,

                x_rot : rot.x,
                y_rot : rot.y,
                z_rot : rot.z,

                x_sca : sca.x,
                y_sca : sca.y,
                z_sca : sca.z
            })
            .eq('mesh_name', `${bookshelf.name}`)

        if (error) {
            console.error("Update failed:", error);
        }
    }

    loading_page.querySelector('.loading-text').textContent = 'Saving GSAP...';

    // //Update the transform of all the GSAP
    for(let i = 0; i<allGsap.length; i++){
        //Get the GSAP
        let gsap_obj = model.getObjectByName(allGsap[i]);
        if(gsap_obj){
            //Find the transform
            let pos = new THREE.Vector3();
            gsap_obj.getWorldPosition(pos);
            let rot = gsap_obj.rotation;
            let sca = gsap_obj.scale;

            //Then update that to the database
            let {data,error} = await supabase
                .from('gsap_database')
                .update({
                    x_pos : pos.x,
                    y_pos : pos.y,
                    z_pos : pos.z,

                    x_rot : rot.x,
                    y_rot : rot.y,
                    z_rot : rot.z,

                    x_sca : sca.x,
                    y_sca : sca.y,
                    z_sca : sca.z
                })
                .eq('gsap_mesh_name', `${gsap_obj.name}`);

            if (error) {
                console.error("Update failed:", error);
            }
        }  
    }

    loading_page.querySelector('.loading-text').textContent = 'Saving Tables...';

    //Update the transform of all the Tables
    for(let i = 0; i<allTables.length; i++){
        //Get the Tabl
        let table_obj = model.getObjectByName(allTables[i]);
        //Find the transform
        let pos = new THREE.Vector3();
        table_obj.getWorldPosition(pos);
        let rot = table_obj.rotation;
        let sca = table_obj.scale;

        //Then update that to the database
        let {data,error} = await supabase
            .from('table_database')
            .update({
                x_pos : pos.x,
                y_pos : pos.y,
                z_pos : pos.z,

                x_rot : rot.x,
                y_rot : rot.y,
                z_rot : rot.z,

                x_sca : sca.x,
                y_sca : sca.y,
                z_sca : sca.z
            })
            .eq('table_mesh_name', `${table_obj.name}`)

        if (error) {
            console.error("Update failed:", error);
        }
        
    }

    //Update the UI
    document.querySelector('.admin-option-container').style.display = 'none';
    document.querySelector('.Admin-option-drop-box').style.display = 'none';
    document.querySelectorAll('.main-menu-option').forEach((child)=>{
        child.style.display = 'flex';
    });

    //Log out the user
    loading_page.querySelector('.loading-text').textContent = 'Logging Out...'
    await supabase.auth.signOut();

    //Make the loading page to disappear
    loading_page.style.display = 'none';

    //Reset the camera
    resetCamera(camera,controls);

});

/**
 * This function will help to update the UI such that the admin can change the range of the bookshelf.
 * @param {object} clicked_object - this is the obejct that is clicked and has the transform helper located
 */
async function updateTransformClicked(clicked_object){
    if(first_floor_bookshelf_name.includes(clicked_object.name)){
        let {data , error} = await supabase
            .from('bookshelf_database')
            .select('mesh_name, range_high, range_low')
            .eq('mesh_name',(String)(clicked_object.name))
        
        if(!error){
            //Display the Bookshelf range in the UI
            console.log(`Update the high range to be ${data[0].range_high} and low range to be ${data[0].range_low}`);

            document.querySelector('.bookshelf-name').textContent = `Number : ${data[0].mesh_name}`;
            document.querySelector('.bookshelf-low-range').textContent = `Low Range : ${data[0].range_low}`;
            document.querySelector('.bookshelf-high-range').textContent = `High Range : ${data[0].range_high}`;

        } else {
            console.log(error);
        }
    }
}


//----------------  EVENT LISTENERS  ------------------------//

//hide menu button
let isMenuOpen = false;
//Main menu will be hidden after entering the application
document.querySelector('.expand-menu-icon').addEventListener('click',()=>{
    //if the menu is hidden
    if(!isMenuOpen){
        //hide the hide menu option
        document.querySelector('.expand-menu-icon').style.display = 'none';
        //Dispaly the main menu
        document.querySelector('.main-menu-container').style.display = 'block';
        isMenuOpen = true;
    }
});

//This is the event listener for the frustum option
let isFrusutm = false;
document.querySelector('.frustum-icon').addEventListener('click',()=>{
    console.log('Frustum is clicked');
    isFrusutm = !isFrusutm;

    console.log(`Now the Frustum option is ${isFrusutm}`);
})

//Event Listeners for Helper pop up
const helper_pop_up = document.querySelector('.help-pop-up-position');
document.querySelector('.cross').addEventListener('click',()=>{
    //console.log('The Helper pop up will be hiden now.');
    helper_pop_up.style.display = 'none';
    
});
// Eventlistener to add the helping pop up
document.querySelector('.help').addEventListener('click',()=>{
    fillHelperFunction();
    helper_pop_up.style.display = 'flex';
})

//This will fill the helper function depending on the application flow
const helper_content = document.querySelector('.helper-content');
function fillHelperFunction(){
    switch (application_flow) {
        case 0:
            helper_content.textContent = 'This is the the helper content for application 0';
            break;
        case 1:
            helper_content.textContent = 'This is the the helper content for application 1';
            break;
        case 1.1:
            helper_content.textContent = 'This is the the helper content for application 1.1';
            break;
        case 2:
            helper_content.textContent = 'This is the the helper content for application 2';
            break;
        case 2.2:
            helper_content.textContent = 'This is the the helper content for application 2.2';
            break;
        
        default:
            break;
    }
}

//This is to hide the the main menu
document.querySelector('.hide-main-menu').addEventListener('click',()=>{
    //If the menu is open
    if(isMenuOpen){
        //hide the hide menu option
        document.querySelector('.expand-menu-icon').style.display = 'block';
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
        //console.log('Library is set to scale one after clicking the explore option');
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

    // Every Frustum appear depending on the floor. 
    popupFloorVisible(-1);
    // And GSAP appear depending on the floor.
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
            //console.log('Scale of the library is set to one after clicking the back button');
        });
        isLibraryReset = 1;
        current_floor = -2;
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

    //Reset the camera
    resetCamera(camera,controls);

    console.log('Frustum must disappear completely.');

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
        //console.log('Library is reset to make the GSAP mode activated.');
        isLibraryReset = 1;
        current_floor = -2;
    });

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
            animate_Selection(gsap,14,pos.x+0.1,pos.z,[...outer_GSAP_object,...ground_floor_GSAP_object]);
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

    //Activate the Frusutm depending on the gsap. for now I am not worrying about the frustum
    popupInvisible();

    //update the title
    document.querySelector('.title-content').innerHTML = 'Explore (GSAP Mode) - [1.1]';
}

//Add the event listeners on the frustum and gsap enable and disable.
let isGsapEnabled = true;
document.querySelector('.gsap-option').addEventListener('click',()=>{
    if(application_flow == 1.1){
        if(isGsapEnabled){
            //Make all the GSAP to disappear
            allGSAP_object.forEach((child)=>{
                if(child){
                    gsap.to(
                        child.scale,
                        {
                            x : 0,
                            y : 0,
                            z : 0,
                        }
                    )
                }
            })
        } else {
            // Make all the GSAP to appear
            allGSAP_object.forEach((child)=>{
                if(child){
                    gsap.to(
                        child.scale,
                        {
                            x : 0.5,
                            y : 0.5,
                            z : 0.5,
                        }
                    )
                }
            })
        }

        isGsapEnabled = !isGsapEnabled;
    }
})

//For Changing the theme of the app
let isLightTheme = true;
document.querySelector('.theme-option').addEventListener('click',()=>{
    if(application_flow == 1.1){
        if(isLightTheme){
            // Make the Dark Theme
            addLights('Dark_Theme',true);
            addLights('Light_Theme',false);

            console.log('Theme must be Dark');

        } else {
            // Make the Light theme
            addLights('Dark_Theme',true);
            addLights('Light_Theme',false);
            console.log('Theme must be Light');
        }


        isLightTheme = !isLightTheme;
    }
})

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
    //Update the current floor to be the -1
    current_floor = -1;

    //Make the GSAp optino in the 1.1 to be enabled
    isGsapEnabled = true;

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

    //Update the camera
    resetCamera(camera,controls);

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
let quickSearch_GSAP = [];//This will store all the GSAP associated to the the quick search
let quick_search_selected = null;//This will store the quick search

const quick_search_options = document.querySelectorAll('.quick-search-sub-option');
for(let i=0;i<quick_search_options.length;i++){
    quick_search_options[i].addEventListener('click',(e)=>{
        if(tellApplicationFlow() !== 2.7){
            previuos_application_flow = application_flow;
            application_flow = 2.7; 
        }

        //Make the previous UX to disappear
        document.querySelector('.quick-search-option-container').style.display = 'none';

        //Turn on the Floor mode.
        document.querySelector('.quick-search-floor-option-container').style.display = 'flex';

        if(e.currentTarget.classList.contains('entryway-quick-search')){ //If the selected currentTarget is Office
             //Quick search selected is Entry Way
             quick_search_selected = "Entry_Way";
            
            //Change the title of the application
            const text_content = 'Choose the Entry Ways';
            document.querySelector('.title-content').innerHTML = text_content;

        } else if(e.currentTarget.classList.contains('dustbin-quick-search')) { //If the selected currentTarget is Dustbin
            //Update the selected quick search
            quick_search_selected = 'Dustbin';

            //Change the title of the application
            const text_content = 'Choose the Dustbins';
            document.querySelector('.title-content').innerHTML = text_content;
            
        } else if(e.currentTarget.classList.contains('machine-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Machine';

            //Change the title of the application
            const text_content = 'Choose the Machines';
            document.querySelector('.title-content').innerHTML = text_content;
            
        } else if(e.currentTarget.classList.contains('computer-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Computer';

            //Change the title of the application
            const text_content = 'Choose the Computers';
            document.querySelector('.title-content').innerHTML = text_content;
            
        } else if(e.currentTarget.classList.contains('helpdesk-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Help_Desk';

            //Change the title of the application
            const text_content = 'Choose the Help Desk';
            document.querySelector('.title-content').innerHTML = text_content;
            
        } else if(e.currentTarget.classList.contains('utility-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Utility';

            //Change the title of the application
            const text_content = 'Choose the Utility';
            document.querySelector('.title-content').innerHTML = text_content;
            
        } else if(e.currentTarget.classList.contains('releases-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Releases';

            //Change the title of the application
            const text_content = 'Choose the Releases';
            document.querySelector('.title-content').innerHTML = text_content;  
        } else if(e.currentTarget.classList.contains('emergency-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Emergency';

            //Change the title of the application
            const text_content = 'Choose the Emergency';
            document.querySelector('.title-content').innerHTML = text_content;  
        } else if(e.currentTarget.classList.contains('rooms-quick-search')) { //If the selected currentTarget is Emergency Exit
            //Update the selected quick search
            quick_search_selected = 'Rooms';

            //Change the title of the application
            const text_content = 'Choose the Rooms';
            document.querySelector('.title-content').innerHTML = text_content;  
        } else console.log('Check the quick searhc function [2.2 to 2.7]');


        //Make the GSAP corresponding to those keys to scale up
        for(let key in frustum_info){
            if(frustum_info[key].quick_search == quick_search_selected){
                allGSAP_object.forEach((child)=>{
                    if(child && child.name == String(frustum_info[key].gsap_name)){
                        //Fill the quick search gsap
                        quickSearch_GSAP.push(child);
                        //Scale up the GSAPs
                        gsap.to(child.scale,{x : 1 , y : 1 , z : 1 , duration : 1});
                    }
                })
            }
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
        current_floor = -1;
    });

    //Reset the camera
    resetCamera(camera,controls);

    //Make all the GSAP to scale down
    allGSAP_object.forEach((child)=>{
        if(child){
            gsap.to(child.scale,{x : 0 , y : 0 , z : 0 , duration : 1});
        }
    });

    quickSearch_GSAP = [];
    quick_search_selected = null;

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
            //console.log('Library is rescaled [2.3 to 2]');
            isLibraryReset = 1;
            current_floor = -1;
        })
    }

    //Reset the Camera 
    resetCamera(camera,controls);

    //Also kill all the gsap
    enlargeGSAP(model,-2,false,false);
    

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search Menu - [2.0]';
})


//-----------[2.1 to 2.4 or 2.8]----------//
const form = document.querySelector('#searchForm');
const bookID = document.querySelector('#fname'); //This will store the ID of the book
let ID = null;
let bookshelf_ID = null;
let bookshelf_side = null;
let bookshelf = null;
let target_bookshelf_object = null;
let target_gsap = null;

form.addEventListener('submit',async function (e){
    //Prevent the website from reloading after submittin the form
    e.preventDefault();

    ID = bookID.value; //ID of the bookshelf

    //Assuming the the library is reset.

    //Find the index of the bookshelf using the ID

    //Now here I will have to check if the ID entered is a name of some subject or is it the number of the bookshelf.
    if(isNaN(ID)){
        //This is a text
        console.log('This is the text');
        ID = String(ID);

        //Update the Application flow
        if(tellApplicationFlow() !== 2.8){
            previuos_application_flow = application_flow;
            application_flow = 2.8
        }

        

        //Check which subject does it match (This will make the bookshelf colored and will also update the legend of the bookshelf subjects). This will also update the UI
        loading_page.style.display = 'block';
        document.querySelector('.loading-text').textContent = 'Loading Bookshelves...';
        await getSubjectBookshelf(ID);
        loading_page.style.display = 'none';

        //Then make all the gsap corresponding to some specific bookshelf to lit up

        //Then the user will have to select the gsap


    } else {
        console.log('This is number');
        ID = Number(ID);

        //Update the application flow
        if(tellApplicationFlow() !== 2.4){
            previuos_application_flow = application_flow;
            application_flow = 2.4
        }
        
        // Make the UI as [2.4]
        document.querySelector('.start-location-search-option-container').style.display = 'flex';
        document.querySelector('.books-and-journals-search-container').style.display = 'none';

        //This will return the bookshelf and it's target GSAP
        loading_page.style.display = 'block';
        document.querySelector('.loading-text').textContent = 'Loading Bookshelf...';
        [bookshelf,target_gsap] = await getTargetBookshelf(ID);
        loading_page.style.display = 'none';

        //Update the ending location of the path
        if(target_gsap){
            ending_location = target_gsap;
        } else {console.error('Target GSAP not found');}
            

        //Activate the Frustum at that ending location and All the gsap and Nodes and edges will remain disabled.

        //Make the target to be of red color.
        let bookshelf_number = bookshelf;
        bookshelf_ID = bookshelf;
        first_floor_bookshelf_object.forEach((child)=>{
            if(child.name == String(bookshelf_number)){
                target_bookshelf_object = child;
            }
        })
        //Make the target bookshelf to be of red color.
        if(target_bookshelf_object) target_bookshelf_object.material.color.set(0xFF0000);
        else console.log('bookshelf mesh not found');
        

        //Update the title
        document.querySelector('.title-content').innerHTML = 'Starting Location - [2.4]';
    }

    //And then use the 
    form.reset();
});

let subjects = [];
let subject_colors = [];
/**
 * This functino will take in the subject and it will return the array of names of bookshelfs that is related to that search.
 * @param {string} subject - this is the subjetc entered as it is. 
 */
async function getSubjectBookshelf(subject_text){
    console.log(subject_text);

    // Clear previous results
    subjects = [];
    subject_colors = [];

    let { data : data_subject, error : error1 } = await supabase
        .from('subject_bookshelf')
        .select('*')
        .ilike('subject_text',`%${(String)(subject_text)}%`);

    
    let { data : data_books, error : error2 } = await supabase
        .from('bookshelf_database')
        .select('mesh_name , range_high , range_low , gsap_name')
    
    if(error1 || error2){
        console.error('Subject fetch error:', error1);
        console.error('Bookshelf fetch error:', error2);
        return;
    } else if (!data_subject || data_subject.length == 0){
        console.log('No Bookshelves for this Search');
        return;
    } else {

        //Update the UI
        document.querySelector('.subjects-legend-position').style.display = 'block';
        document.querySelector('.books-and-journals-search-container').style.display = 'none';
        document.querySelector('.books-subject-search-container').style.display = 'flex';

        console.log(`Lenght : ${data_subject.length}`);

        for(let i=0;i<data_subject.length;i++){
 
            console.log(`i = ${i}`);

            //Fill the subejct text in the array
            subjects.push(data_subject[i].subject_text);
            //Push the subject color in the array
            subject_colors.push(data_subject[i].subject_color_code);

            let subject_code_number = (Number)(data_subject[i].subject_code);

            //Make the color of bookshelves that lies in this subejct to that color
            data_books.forEach((bookshelf)=>{
                let bookshelf_low_range = (Number)(bookshelf.range_low);
                let bookshlef_high_range = (Number)(bookshelf.range_high);
                
                
                //If lets say the bookshelf high is 612 and low range is 674.6 then this lies in between the range 600 and 700. And thus this specific bookshlef will be made the color of the that specific subject
                if(
                    bookshelf_low_range >= subject_code_number &&
                    bookshlef_high_range <= (subject_code_number + 10) 
                ){
                    console.log(`bookshelf mesh name: ${bookshelf.mesh_name} | bookshelf high range : ${bookshelf.range_high} | low range : ${bookshelf.range_low} | data_subject[i].subject_code : ${data_subject[i].subject_code}`);
                    //Make the mesh of this bookshekf to be of the color of the subejct code
                    let bookshelf_object = model.getObjectByName(bookshelf.mesh_name);
                    let target_gsap = model.getObjectByName(bookshelf.gsap_name);

                    bookshelf_object.material.color.set(data_subject[i].subject_color_code);

                    //Make the GSAP corrsponding to that to lit up
                    gsap.to(target_gsap.scale,{x:1,y:1,z:1,duration:1});
                }
            });  
        }

        //And then I update the legend
        updateSubjectLegend(subjects,subject_colors);

        subjects = [];
        subject_colors = [];
    }
}

/**
 * 
 * @param {Array} subjects - This is the array of all the subjects that contians the name searched. So if the searched subject is phy, then it will show the results of all the subejct that has 'phy' in it.
 */
function updateSubjectLegend(subjects,subject_color){

    const subject_container = document.querySelector('.subjects-legend-flex');

    for(let i = 0;i<subjects.length;i++){
        //For each subejct make the div
        let div = document.createElement('div');
        div.classList.add('subject');

        let subject_color_div = document.createElement('div');
        subject_color_div.classList.add('subject-color');
        subject_color_div.style.backgroundColor = subject_color[i];

        let subject_name_div = document.createElement('div');
        subject_name_div.textContent = `- ${subjects[i]}`;

        div.appendChild(subject_color_div);
        div.appendChild(subject_name_div);

        subject_container.appendChild(div);
    }
}

/**
 * This is the real database that needs to be at the backend. This function will return the names of gsap and the bookshelf
 * @param {ID} - This is the numeric form of the input (Book ID)
 */
async function getTargetBookshelf(ID){
    //Here I will use the Supabse databse to check for the bookshelf
    let {data,error} = await supabase
        .from('bookshelf_database')
        .select('mesh_name, range_high, range_low, gsap_name')
    
    if(error){
        console.error(error);
        return null;
    }

    //Then go through all the data and find the name and the gsap target of the required bookshelf
    for (let i = 0; i < data.length; i++) {
        let child = data[i];

        if (child.range_low <= ID && child.range_high >= ID) {
            return [child.mesh_name, child.gsap_name];
        }
    }

    alert('Bookshelf not found');
    return null;
}

//---------[2.8 to 2.1]-------//
document.querySelector('.subject-search-shown-clear-button').addEventListener('click',()=>{
    //Update the Application Flow
    application_flow = 2.1;

    //Update the UI
    document.querySelector('.subjects-legend-position').style.display = 'none';
    document.querySelector('.books-and-journals-search-container').style.display = 'flex';
    document.querySelector('.books-subject-search-container').style.display = 'none';

    //Reset the librayr
    libraryScaleReset(()=>{
        current_floor = -1;
        isLibraryReset = true;
        focusFloor(controls,'Outer_Floor');
    });

    //Make the color of all the bookshelves to be white again
    first_floor_bookshelf_object.forEach((child)=>{
        child.material.color.set(0xffffff);
    })
    //Make all the GSAP to the scale 1
    first_floor_bookshelf_gsap_objects.forEach((child)=>{
        gsap.to(child.scale,{x : 0,y : 0,z : 0});
    })

    previuos_application_flow = 2.8;
    
    //Update the title
    document.querySelector('.title-content').innerHTML = 'Search the Book or Journal [2.1]';
})


//--------------[2.3 to 2.4]------------//
/**
 * This function will be trggered when a GSAP is selcted in the manual location search.
 * @param {string} GSAP - Name of GSPA that will be activated when the 
 */
function onGsapSelectionManualSearch(GSAP){

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
    //console.log(`Ending location is ${ending_location}`);

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
    } else if (previuos_application_flow == 2.1 || previuos_application_flow == 2.8) {
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
        //console.log('Reset the Library from [2.4 to 2.2]')
    })

    //update the title
    document.querySelector('.title-content').innerHTML = title_content;
})



//-------------[2.7 to 2.4]--------------//
/**
 * The function will be triggered when the I select a specific GSAP when in specific Quick Search.
 * @param {string} gsap - Name of GSAP
 */
function onGsapSelectSpecificQuickSearch(GSAP){
    //Update the application number
    if(tellApplicationFlow() !== 2.4){
        previuos_application_flow = application_flow;
        application_flow = 2.4;
    }

    //Make the search container and back button to appear [2.1]
    document.querySelector('.quick-search-floor-option-container').style.display = 'none';
    document.querySelector('.start-location-search-option-container').style.display = 'flex';

    //Update the Ending point
    ending_location = GSAP.name;

    //Make the GSAP curresponding to that current floor to lite up
    let current_floor_gsap;
    switch (current_floor) {
        case -1:
            current_floor_gsap = outer_GSAP_object;
            break;
        case 0 : 
            current_floor_gsap = ground_floor_GSAP_object;
            break;
        case 1:
            current_floor_gsap = first_floor_GSAP_object;
            break;
        case 2 : 
            current_floor_gsap = second_floor_GSAP_object;
            break;
        default:
            break;
    }
    current_floor_gsap.forEach((child)=>{
        if(child){
            if(child.name != GSAP.name){
                gsap.to(
                    child.scale,
                    {x : 1, y : 1, z : 1, duration : 1}
                )
            } else {
                gsap.to(
                    child.scale,
                    {x : 0, y : 0, z : 0, duration : 1}
                )
            }
        }  
    });

    //Update the title
    document.querySelector('.title-content').innerHTML = 'Starting Location [2.4]';
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
    let path = a_star_init(model,starting_location,ending_location);
    //console.log(path);

    //Push the interactive GSAP and scale them up depending on the floor.
    allGSAP_object.forEach((gsap_child)=>{
        if(gsap_child && path.includes(gsap_child.name)){
            //find at which index does the gsap_child lies in the path?
            let index = path.indexOf(gsap_child.name);
            //push the gsap_child into the path_gsap at the same index as above
            path_gsap[index] = gsap_child;
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

    //Add the last element to be the last element of the path gsap so that on selecting the last gsap, it faces the last object
    let bookshelf_object = model.getObjectByName(String(bookshelf_ID));
    path_gsap.push(bookshelf_object);
    
    
    console.log(`Path GSAP : `);console.log(path_gsap);

    //Turn on the frustum of the destination only depending on the floor.

    //Make the Percentage bar to appear
    document.querySelector('.percentage').style.display = 'block';
    updatePercentageBar();

    //Update the UI
    document.querySelector('.start-location-search-option-container').style.display = 'none';
    document.querySelector('.search-shown-option-container').style.display = 'flex';

    //Update the Target
    const title_content = 'Path has been shown';
    document.querySelector('.title-content').textContent = title_content;
}

function updatePercentageBar(){
    //I will first see the selected object and the path_gsap, and then find the total distance covered and then update the height of the percentgae
    if(selected_gsap == null){
        //make the percentage bar zero
        document.querySelector('.percentage-bar').style.height = '0%';
        return;
    } else {
        let i=0;

        //Find the index of the selected object in the path_gsap
        if(path_gsap){
            for(;i<path_gsap.length;i++){
                if(path_gsap[i] && path_gsap[i].name == selected_gsap.name){
                    break;
                }
            }
        }

        //And then update the percentage of the bar
        let percentage = (i/(path_gsap.length-2))*100;
        console.log(`Percentage is equal to ${percentage}`);
        document.querySelector('.percentage-bar').style.height = `${percentage}%`;
        return;
    }
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

    //Focus on the outer library
    focusFloor(controls,'Outer_Floor');

    //Scale down all the GSAP
    path_gsap.forEach((child)=>{
        if(child){
            gsap.to(
                child.scale,
                {
                    x : 0,
                    y : 0,
                    z : 0,
                    duration : 1,
                }
            )
        }
    });

    //Empty the path gsap
    path_gsap = [];

    //Make the ID to be null, and also make the bookshelf that was turned red to be white again
    if(target_bookshelf_object){
        ID = null;
        //Change the color of the target bookshelf to white again
        target_bookshelf_object.material.color.set(0xFFFFFF);
    }

    //Update the UI
    document.querySelector('.search-shown-option-container').style.display = 'none'; //Clear the floor option in [2.5]
    document.querySelector('.search-option-container').style.display = 'flex'; //Make the search options appear.
    document.querySelector('.percentage').style.display = 'none';

    //Update the Target
    const title_content = 'You are in Search Menu';
    document.querySelector('.title-content').textContent = title_content;
})

//--------------[2.5 to 2.6]---------------//
/**
 * Location is shown. And the user has selected some GSAP. Everttime the user clicks on any GSPA at this time, this function will be triggered.
 * @param {string} gsap - Name of GSPA that is clicked. 
 */
function onGsapSelectionLocationShown(GSAP){
    //Update the application flow
    if(tellApplicationFlow() !== 2.6){
        previuos_application_flow = application_flow;
        application_flow = 2.6;
    }

    //Update the UI
    document.querySelector('.search-shown-gsap-option-container').style.display = 'flex'; // GSAP icons on the percentage bar disappears.
    
    document.querySelector('.search-shown-option-container').style.display = 'none';

    //Make the library to rescaled.
    if(isLibraryReset == 0){
        libraryScaleReset(()=>{
            //console.log('Library is rescaled before entering the [2.6] GSAp mode');
            isLibraryReset = 1;
        });
    }
        
    //Make all the GSAP in the path to turn on.
    enlargeGSAP(model,-2,true,true);

    //Find where is the GSAP in the sequence of path array
    let i=0;
    for(;i<path_gsap.length;i++){

        //console.log(`i = ${i}`);

        if(path_gsap[i].name == GSAP.name && i != path_gsap.length-1){
            //console.log(`At i = ${i} we have the path_gsap[i] : ${path_gsap[i].name} same as GSAP : ${GSAP.name}`);
            break;
        } else if(i == path_gsap.length-1) {
            i = -1;
            break;
        }
    }

    //console.log(`You have selected GSAP ${GSAP.name} | and the camera must now point to next gsap which is ${path_gsap[i+1].name}`);

    let x,y;
    if(path_gsap[i+1]){
        [x,y] = pointTowards(GSAP.name,path_gsap[i+1].name,0.1);
    } else {
        //When there is no next item then point to the origin
        x = 0;
        y = 0;

    }

    //Update the percentage bar
    console.log(`selected object is ${selectedObject.name} and the gsap_name is ${selected_gsap.name}`);
    updatePercentageBar();

    //console.log(`Pointing towards, ${path_gsap[i+1].name}`);

    //Make the GSAP to animate there
    animate_Selection(GSAP,18,x,y,path_gsap);

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
    document.querySelector('.search-shown-option-container').style.display = 'flex'; //Floor Options Apppears
    document.querySelector('.search-shown-gsap-option-container').style.display = 'none';//GSAP options disappears

    //Library will already be rescaled. frustrum will appear depending on the floor.

    //The gsap that are on the path will scale up again
    path_gsap.forEach((child)=>{
        if(child){
            gsap.to(
                child.scale,
                {
                    x : 1,
                    y : 1,
                    z :1,
                    duration : 1,
                }
            );
        }    
    });

    //Reset the camera
    resetCamera(camera,controls);

    //Update the percentage bar
    selected_gsap = null;
    updatePercentageBar();

    //Update the title
    const title_content = 'Location Shown (Floor Mode)';
    document.querySelector('.title-content').textContent = title_content;
})



//-------------------LOADING PAGE----------------------//
const loadingManager = new THREE.LoadingManager();
const loading_page = document.querySelector('.loading-page-container');

loadingManager.onStart = function (URL,item,total){
    //console.log('Loading has started');
    //Loading Page appears
    loading_page.style.display = 'block';
}

loadingManager.onProgress = function(url,i,total){
    //console.log(`i = ${i}`);
}

loadingManager.onLoad = function(){
    
    //Start the Application by animating the camera
    camera_animate();
}

//Loading the World
const loader = new GLTFLoader(loadingManager);


let selectedObject = null;

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
        onGsapSelectionManualSearch(selectedObject);
    }
    //if the application flow is to see the best path visible then
    else if(application_flow == 2.4){
        onGsapSelectionStart(selectedObject);
    } 
    //If the application fow is 2.7 (User clicks on the GSAP from the Quick search)
    else if(application_flow == 2.7) {
        onGsapSelectSpecificQuickSearch(selectedObject);
    }
    //If the Application Flow is 2.6 (Location shown but in GSAP mode)
    else if(application_flow == 2.5 || application_flow == 2.6) {
        onGsapSelectionLocationShown(selectedObject);
    }
    
}

function onPointerMove( event ) {

    //This will work in mobile and the computersboth.
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObject( model, true );

    if ( intersects.length > 0 ) {
        

        const res = intersects.filter( function ( res ) {

            return res && res.object;

        } )[ 0 ];

        if ( res && res.object ) {  
            
            //Could be used to selected anything.
            selectedObject = res.object;

            //console.log(`Selected Obejct Name : ${selectedObject.name}`);

            //If the selected object is the GSAP then update the it
            if(allGsap && allGsap.includes(selectedObject.name)){
                selected_gsap = selectedObject;
            }

            //if(selectedObject) console.log(`Selected Object is ${selectedObject.name}`);

            //if the object clicked is the one which is clickable
            if(selectedObject  && !unclickables.includes(selectedObject.name)){
                console.log(selectedObject.name);
                animate_Selection_complete(selectedObject);
            }

            //If in the admin mode
            if(
                application_flow == 4.3 ||
                application_flow == 4 ||
                application_flow == 4.1
            ){
                if(draggableObjects.includes(selectedObject)){
                    if(transform_clickedObject) transform_clickedObject.material.emissive.set(0xffffff);
                   transform_clickedObject = selectedObject;
                   transformControls.attach(transform_clickedObject);

                   //Update the UI
                   updateTransformClicked(transform_clickedObject);
                }
                
            }

            //If the application is in the Frustum Edit Section
            if (application_flow == 4.2 && popup_objects.includes(selectedObject)){
                onObjectSelectFrustumEdit(selectedObject);
            }
        }
    }
}

//---- FRUSTUM-----//
const frustum = new THREE.Frustum();

//Outer Library
// const outer_library_Frustum = [
//     'Entrance_1',
//     'Entrance_2',
//     'Entrance_3',
//     'Entrance_4',
//     'Entrance_5',
//     'Entrance_6',
//     'Library_Entrance',
//     'Dustbin_1',
//     'Dustbin_2',
//     'Dustbin_3',
//     'Dustbin_4'
// ];
const outer_library_Frustum = [];

//First Floor
const ground_library_Frustum = [];
//Second floor library
const first_library_Frustum = [];
//Third Floor Library
const second_library_Frustum = [];

const allFrustum = []

let frustum_info = {};

async function createFrustumInfo(){
    //Call the supabse
    let { data , error } = await supabase
        .from('frustum_database')
        .select('*')

    if(!error){
        
        const frustum_container = document.querySelector('.pop-up-container');
        for(let i = 0; i < data.length; i++){

            //HTML FILLER
            //Make a div
            let frustum_div = document.createElement('div');
            //Add the CSS class to this div
            frustum_div.classList.add('pop-up');
            //Add the id of the div
            frustum_div.id = data[i].frustum_div_id;
            //Fill the Heading
            let frustum_heading = document.createElement('div');
            //Fill the heading
            frustum_heading.classList.add('heading');
            let h3 = document.createElement('h3');
            h3.textContent = data[i].frustum_heading;
            frustum_heading.appendChild(h3);
            //Add this to the main frustum
            frustum_div.appendChild(frustum_heading);
            //Now append the frustum div to the main frustum continaer
            frustum_container.appendChild(frustum_div);

            //FRUSTUM INFO MAKER
            
            //now make the obejct that will be contain this above div
            frustum_info[data[i].frustum_mesh_name] = {
                div : frustum_div,
                heading : data[i].frustum_heading,
                content : data[i].frustum_content,
                website : data[i].frustum_website,
                quick_search : data[i].frustum_search,
                floor : data[i].frustum_floor,
                gsap_name : data[i].frustum_gsap_name,
                isDisplay : false
            }

            //Create the allFrustum
            if(data[i].frustum_floor == -1){ outer_library_Frustum.push(data[i].frustum_mesh_name); }
            else if(data[i].frustum_floor == 0){ ground_library_Frustum.push(data[i].frustum_mesh_name); }
            else if(data[i].frustum_floor == 1){ first_library_Frustum.push(data[i].frustum_mesh_name); }
            else if(data[i].frustum_floor == 2){ second_library_Frustum.push(data[i].frustum_mesh_name); }

            //Add Event listener on each frustum
            frustum_div.addEventListener('click',()=>{
                //Make the frustum pop up to appear
                document.querySelector('.pop-up-heading-text').textContent = `${data[i].frustum_heading}`;
                document.querySelector('.pop-up-content-text').textContent = `${data[i].frustum_content}`;
                document.querySelector('.pop-up-image').src = `${data[i].frustum_image_url}`;

                //And then make the pop up to appear
                document.querySelector('.help-pop-up-position').style.display = 'flex';
            })
        }

        //fianlly add all the frustum inside the allGSAP
        allFrustum.push(...outer_library_Frustum,...ground_library_Frustum, ...first_library_Frustum , ...second_library_Frustum);

        basement_floor_library_child.push(...outer_library_Frustum);
        ground_floor_library_child.push(...ground_library_Frustum);
        first_floor_library_child.push(...first_library_Frustum);
        second_floor_library_child.push(...second_library_Frustum);

        library_child.push(...outer_library_Frustum,...ground_library_Frustum,...first_library_Frustum,...second_library_Frustum)

        unclickables.push(...outer_library_Frustum,...ground_library_Frustum,...first_library_Frustum,...second_library_Frustum);

        //console.log(allFrustum);

        //And then put these objects inside the pop up objects
        model.traverse((child)=>{
            //Store the Frustum objects into the popup_obejcts
            if(allFrustum.includes(child.name)){
                popup_objects.push(child);
            }
        })

    } else {
        console.error(error);
    }    
}

const popup_objects = [];

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

//This function will find he distance between the camer and some object
function distance_Cam_and_obj(camera,obj){
    //I will first find the distance between the camera and obj origin
    let camera_position = camera.position;
    let obj_position = new THREE.Vector3();

    obj.getWorldPosition(obj_position);

    //Find the distance between the camera and object position
    let distance = Math.pow( ( Math.pow( 
            (camera_position.x - obj_position.x) ,2) + 
            Math.pow( (camera_position.y - obj_position.y) ,2) + 
            Math.pow( (camera_position.z - obj.position.z) ,2) ) 
        , 0.5 )

        return distance;
}

/**
 * 
 * @param {*} div - This is the frustum_objects[key].div that is the element thta needs to scaled
 * @param {*} obj - This is the obj that is linked to this div that is used as the origin of this frustum
 */
function updatePopupScale(div,obj){

    let distance = distance_Cam_and_obj(camera,obj);

    let pop_scale = 1 -  (distance - 50) * ((1 - 0)/(1000 - 50));
    //Now update the pop up scale
    div.style.transform = `translate(-50%, -50%) scale(${pop_scale})`;
    //Since the pop up has to scale from the top left point
    div.style.transformOrigin = "top left";
}

//This function is to make all the pop up to disappear
function popupInvisible(){
    for (let key in frustum_info) {
        const item = frustum_info[key];
        item.div.style.display = 'none';
    }
}

//This function will make the frustum appear depending on the floor selected
function popupFloorVisible(floor){
    for(let key = 0; key < frustum_info.length; key++){
        if(frustum[key].floor == floor){
            frustum[key].div.style.display = 'block';
        } else frustum[key].div.style.display = 'none';
    }
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

    popupInvisible();

    // Loop through all popup objects
    popup_objects.forEach(obj => {
        const position = new THREE.Vector3();
        obj.getWorldPosition(position); // get object's 3D world position

        if (frustum.containsPoint(position)) {

            //If in the application flow equal to 1 then display the frustum depending on the floor selected
            if(application_flow == 1 || application_flow == 2.3 || application_flow == 2.4){

                if(
                    (
                        (current_floor == -1 && outer_library_Frustum.includes(obj.name)) ||
                        (current_floor == 0 && ground_library_Frustum.includes(obj.name)) ||
                        (current_floor == 1 && first_library_Frustum.includes(obj.name)) ||
                        (current_floor == 2 && second_library_Frustum.includes(obj.name))
                    ) &&
                    distance_Cam_and_obj(camera,obj) < 400
                ){
                    //Ensure it;s a valid object and the distance between the pop up and the object is less than 500
                    if(frustum_info[String(obj.name)]){
                        frustum_info[String(obj.name)].isDisplay = true;
                        //Update the pop up scale
                        updatePopupScale(frustum_info[String(obj.name)].div,obj);
                        //Update the pop up cordinates
                        updatePopupCordinates(obj,frustum_info[String(obj.name)].div);
                    }
                } else {
                    //This is to hide the pop ups when the floor changes
                    if(frustum_info[String(obj.name)]) frustum_info[String(obj.name)].isDisplay = false;
                }

            } else if (application_flow == 1.1 || application_flow == 0 || application_flow == 2.1 || application_flow == 2.2 || application_flow == 2 || application_flow == 2.6) {

                //But for now I am setting it to none
                if(frustum_info[String(obj.name)]) 
                    frustum_info[String(obj.name)].isDisplay = false;

            } else if (application_flow == 2.7) { 

                if(frustum_info[String(obj.name)] && frustum_info[String(obj.name)].floor == current_floor && frustum_info[String(obj.name)].quick_search == quick_search_selected && distance_Cam_and_obj(camera,obj) < 500){

                    frustum_info[String(obj.name)].isDisplay = true;
                    updatePopupScale(frustum_info[String(obj.name)].div,obj);
                    updatePopupCordinates(obj,frustum_info[String(obj.name)].div);
                } else {
                    //This is to hide the pop ups when the floor changes
                    if(frustum_info[String(obj.name)]) frustum_info[String(obj.name)].isDisplay = false;
                }

            } else if (application_flow == 2.5) {
            } else {
                //This is to hide the pop up when the object is not in the frustum
                if(frustum_info[String(obj.name)]) frustum_info[String(obj.name)].isDisplay = false;

            }
        } else {
            //This is the most important else statement to make the frustum to set to none when not in the frame.
            if(frustum_info[String(obj.name)]) frustum_info[String(obj.name)].isDisplay = false;
        }
    });


    //Change the visiblity of the pop up that has crossed he above frustum and is true depending on the 
    for (let key in frustum_info) {
        const item = frustum_info[key];
    
        if (item.isDisplay) {
            item.div.style.display = 'block';
        } else {
            item.div.style.display = 'none';
        }
    } 
}


//-----------------SELECTION ANIMATION-----------------------//
let selected_gsap = null;
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

    selected_gsap = model.getObjectByName(selected_gsap_name);
    let next_gsap = model.getObjectByName(next_gsap_name);

    selected_gsap.getWorldPosition(selected_pos);
    next_gsap.getWorldPosition(target_pos);

    //Distance between the origins of target and next gsap is
    let AB = Math.sqrt(Math.pow((selected_pos.x - target_pos.x),2) + Math.pow((selected_pos.y - target_pos.y),2) + Math.pow((selected_pos.z - target_pos.z),2));

    // Derived Formula
    let x_pos = selected_pos.x - (distance/AB) * (- selected_pos.x + target_pos.x);
    let y_pos = selected_pos.z - (distance/AB) * (- selected_pos.z + target_pos.z);

    //console.log(`Position of ${selected_gsap_name} is (x,y,z) =  ${selected_pos.x},${selected_pos.y},${selected_pos.z} and cordinates of ${next_gsap_name} is (x,y,z) = ${target_pos.x},${target_pos.y},${target_pos.z}`);
    //console.log(`x_pos : ${x_pos} , y_pos : ${y_pos}`);

    return [x_pos,y_pos];

}

//This will bring the camera to the selected GSAP
function animate_Selection(selected_object,camera_height,camera_x_position,camera_y_position,other_gsap){

    //console.log('You are in the animate selection function');

    let worldPos = new THREE.Vector3(); //To store the location of GSAP
    //Get the World cordinate of the selected object
    
    selected_object.getWorldPosition(worldPos);

    //console.log(`Selected_Object is ${selected_object.name} and the it's location is (x,y,z) : (${worldPos.x}, ${worldPos.y}, ${worldPos.z})`);


    //Until the animation is finished make the controls disabled
    controls.enableRotate = false;
    controls.minDistance = 0; //To solve the problem of the controls

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
                controls.minDistance = 0.1;
                //Now I will update the selcted GSAP to Selected object
                GSAP_Selected = selectedObject; //TO avoid the problem of outline 
            }
        }, 
    );

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
    let final_scale_other_gsap = 0.5;
    // if(application_flow == 1.1){final_scale_other_gsap = 0.5;}
    // else final_scale_other_gsap = 1;
    other_gsap.forEach((child)=>{
        if(child && child.name != selectedObject.name){
            gsap.to(
                child.scale,
                {
                    x : final_scale_other_gsap,
                    y : final_scale_other_gsap,
                    z : final_scale_other_gsap,
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
    controls.minDistance = 344;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;
}

/**
 * This function will set the camera and controls to different floors.
 * @param {*} camera - Scene Camera
 * @param {*} controls - Scene Controls
 * @param {string} floor - This is the floor you want to focus on. This could be 'Outer_Floor' , 'Ground_Floor' , 'First_Floor' , 'Second_Floor'
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
        //console.log('Focus of the Ground Floor');
        //get the position of the ground floor origin.
        origin = model.getObjectByName('Ground_Library');
        controls.minDistance = 200;

    } else if (floor == 'First_Floor') {
        //console.log('Focus of the First Floor');
        //get the position of the ground floor origin.
        origin = model.getObjectByName('First_Library');
        controls.minDistance = 300;
    } else if (floor == 'Second_Floor') {
        //console.log('Focus of the Second Floor');
        //get the position of the ground floor origin.
        origin = model.getObjectByName('Second_Library');
        controls.minDistance = 310;
    } else {
        if(!origin) console.log('Floor name not found to target');
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

//--------------------LIGHTS----------------------//
//This is the main lights of the scene.
let scene_light;

//Initialte the lights
let color = 0xFFFFFF;
let intensity = 1;
let groundColor = 0xFFE1D4;
let skyColor = 0xffc9b0;

let color_dir1 = 0xFFFFFF;
let color_dir2 = 0xFFFFFF;

// let color = 0xC9D6FF;      // soft moonlight ambient
// let intensity = 1;       // dimmer overall light

// let groundColor = 0xFFE1D4; // very dark ground reflection
// let skyColor = 0x9A7CFF;    // deep indigo sky light

// let color_dir1 = 0xD6E3FF;  // cool moon directional light
// let color_dir2 = 0xB8C6FF;  // secondary soft blue light


function init_lights(){
    scene.background = new THREE.Color( skyColor );

    const light1 = new THREE.AmbientLight(color, intensity);
    const light2 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light1);
    scene.add(light2);

    const light_dir_1 = new THREE.DirectionalLight(color_dir1, intensity);
    light_dir_1.position.set(0, 10, 0);
    light_dir_1.target.position.set(-5, 0, 0);
    scene.add(light_dir_1);
    scene.add(light_dir_1.target);

    const light_dir_2 = new THREE.DirectionalLight(color_dir2, intensity);
    light_dir_2.position.set(-790, 356, -0.91);
    light_dir_2.target.position.set(-5, 0, 0);
    scene.add(light_dir_2);
    scene.add(light_dir_2.target);

    return {
        AmbientLight : light1,
        HemisphereLight : light2,
        DirectionalLight1 : light_dir_1,
        DirectionalLight2 : light_dir_2,
    }
}

//----------OUTLINE-------------//
// //Now we can add the outline effect after creating the renderer.
let effect;

// /**
//  * This fucntion will take the visibility and will set it to all the obejcts in the scenes.
//  * @param {number} visiblity - Visiblity of outlien from 0 to 1
//  * @param {*} mesh - This will be the model that is gltf.scene
//  */
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

        //console.log(`Changed ${mesh.name} outline visibilty to ${visiblity}`);
    } else {
        //console.log('Mesh not found and thus no oultine could be assigned');
    }
}


//Mesh to be instanced
let cycleMesh
let CycleStandMesh;
let AirConditioner_mesh;
let First_Floor_Table_Instance;
let Ground_Floor_Table;
let First_Floor_Table_2_Instance;
let Ground_Floor_Switch_Board_Instance;
let First_Floor_Switch_Boards_Instance;

function init() {

    scene = new THREE.Scene();


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    effect = new OutlineEffect( renderer );

    //---------------------------------//
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

    //Set an orthographic camera for the admin
    ortho_camera = new THREE.OrthographicCamera(window.innerWidth / - 2,window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    //scene.add( ortho_camera );

    // controls
    orbitalControls = new OrbitControls( camera, renderer.domElement );
    dragControls = new DragControls(draggableObjects, camera, renderer.domElement);
    transformControls = new TransformControls(camera, renderer.domElement);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitalControls.enabled = !event.value;
    });
    

    dragControls.enabled = false;
    transformControls.enabled = false;
    
    

    controls = orbitalControls;
    controls.listenToKeyEvents( window ); // optional
    
    //Initially the user controls will be enabled.
    controls.enabled = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
    controls.maxDistance = 899;


    //This will set the camera position and the controls.
    // resetCamera(camera,controls);
    
    // Loading the World
    loader.load( './Mesh.glb', async function( gltf ) {
        model = gltf.scene;

        // Here I have made the material of the model to be a bit more lighter.
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive = new THREE.Color(0xffffff); // same as color or lighter
                child.material.emissiveIntensity = 0.15; // increase to make it glow more
            }

            //Store the objects of the all the bookshelfs
            if(first_floor_bookshelf.includes(child.name)){
                first_floor_bookshelf_object.push(child);
            }

            //Add the Draggbale objects
            if(draggableNames.includes(child.name)){
                draggableObjects.push(child);
            }

        });

        scene.add( gltf.scene );

             

        //I would like to have the outline to be visible always
        changeOutline(1,model);

        // Mesh to be instanced
        cycleMesh = gltf.scene.getObjectByName('Cycle');
        CycleStandMesh = gltf.scene.getObjectByName('Cycle_Stand');
        AirConditioner_mesh = gltf.scene.getObjectByName('Air_Conditioner_Instance');
        Ground_Floor_Switch_Board_Instance = gltf.scene.getObjectByName('Cube858');
        First_Floor_Switch_Boards_Instance = gltf.scene.getObjectByName('Cube858');

        // const Direction_mesh = gltf.scene.getObjectByName('Direction_instance');

        if (!cycleMesh) {console.error('Mesh named "cycle" not found');return;}

        // Instancing
        createInstances(cycleMesh.geometry, cycleMesh.material,loadCycleTransforms);//Cycle Instance
        createInstances(CycleStandMesh.geometry,CycleStandMesh.material,loadCycleStandTransforms);//Cycle Stand Instance
        createInstances(AirConditioner_mesh.geometry,AirConditioner_mesh.material,loadAirConditionTransforms);//Air Conditioner Instance
        createInstances(Ground_Floor_Switch_Board_Instance.geometry,Ground_Floor_Switch_Board_Instance.material,loadGroundFloorSwitchBoardTransform)//Switch Board Instance (Ground Floor)
        createInstances(First_Floor_Switch_Boards_Instance.geometry,First_Floor_Switch_Boards_Instance.material,loadFirstFloorSwitchBoardTransform)//Switch Board Instance (First Floor)
        

        //Initlaly all the gsap/nodes and edges will be gone
        enlargeGSAP(model,-2,false,false);

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

    //Make the Grid
    grid = makeGrid();

    //Add the Lightings to the scene
    scene_light = init_lights();

    window.addEventListener( 'resize', onWindowResize );

}




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
const first_floor_occupied_seats = generateRandomData(100); // in first floor entrance (15 seats)
const ground_floor_occupied_seats = generateRandomData(50); // in ground floor entrance (40 seats)

//This function will make the tabke turn to brown (Reset)
function ColorReset(instancedMesh){
    let mesh = instancedMesh.instance;
    for(let i=0 ;i < instancedMesh.total; i++){
        //console.log('Setting the color to brown');
        mesh.setColorAt(i,new THREE.Color(0xffffff));
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

//------------[0 to 3]--------------//
document.querySelector('.miscellaneous-option').addEventListener('click',()=>{
    if(application_flow != 3){
        previuos_application_flow = application_flow;
        application_flow = 3;
    }

    //Update the UI
    document.querySelectorAll('.main-menu-option').forEach((child)=>{ child.style.display = 'none';});
    document.querySelector('.miscellaneous-option-drop-box').style.display=  'flex';
    document.querySelector('.miscellaneous-option-container').style.display=  'flex';

    //Update the title

})

//--------------[3 to 3.1]--------------//
document.querySelector('.crowd-miscellaneous-option').addEventListener('click',()=>{
    //Update the application number
    if(application_flow != 3.1 ){
        previuos_application_flow = 0;
        application_flow = 3.1;
    }

    //Floor mode options for the crowd must appear
    document.querySelector('.miscellaneous-option-container').style.display = 'none';
    document.querySelector('.miscellaneous-floor-option-container').style.display=  'flex';
    

    //All the tabels will be set to green and red color.
    
    //console.log(`seat occupancy visible = ${seatOccupancyVisible}`);
});

//-----------------[3.1/3.2/3.3 to 3]----------------//
document.querySelector('.miscellaneous-floor-back-button').addEventListener('click',()=>{
    //Update the application number
    if(application_flow != 3 ){
        previuos_application_flow = application_flow;
        application_flow = 3;
    }

    //Reset the library
    libraryScaleReset(()=>{})

    //if previusly in the crowd option
    if(previuos_application_flow == 3.1){
        //Reset the colors of the all the seats.
        
    }

    //And fianlly the crowd drop box will disappear
    document.querySelector('.miscellaneous-floor-option-container').style.display = 'none';
    document.querySelector('.miscellaneous-option-container').style.display = 'flex';

    //Update the Tilte and the helper content

});

//------------------[3 to 0]---------------//
document.querySelector('.miscellaneous-back-button').addEventListener('click',()=>{
    if(application_flow != 0){
        previuos_application_flow = application_flow;
        application_flow = 0;
    }

    //Update the UI
    document.querySelector('.miscellaneous-option-container').style.display = 'none';
    document.querySelector('.miscellaneous-option-drop-box').style.display = 'none';
    document.querySelectorAll('.main-menu-option').forEach((child)=>{child.style.display = 'flex';})
})


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
let ground_floor_switch_board_instanceMesh = {};
let first_floor_switch_board_instanceMesh = {};
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
async function loadGroundFloorSwitchBoardTransform(){
    const response = await fetch('./Instances/Ground_Floor_Switch_Board_Instance.json');
    return await response.json();
}
async function loadFirstFloorSwitchBoardTransform(){
    const response = await fetch('./Instances/First_Floor_Switch_Board_Instance.json');
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
    if(geometry == AirConditioner_mesh.geometry){
        airconditioner_instanced_mesh = {
            instance : instancedMesh,
            transform : [],
            total : count
        }
    } else if(geometry == Ground_Floor_Switch_Board_Instance.geometry){
        ground_floor_switch_board_instanceMesh = {
            instance : instancedMesh,
            transform : [],
            total : count
        }
    } else if(geometry == First_Floor_Switch_Boards_Instance.geometry){
        first_floor_switch_board_instanceMesh = {
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
        
        //Stroing the transform of instance to use later (Scaling the booklshelfs when in the floor mode)
        if(geometry == AirConditioner_mesh.geometry){
            airconditioner_instanced_mesh.transform.push(
                {
                    position : dummy.position.clone(),
                    rotation : dummy.rotation.clone(),
                    scale : dummy.scale.clone(),
                }
            )
        } else if(geometry == Ground_Floor_Switch_Board_Instance.geometry){
            ground_floor_switch_board_instanceMesh.transform.push(
                {
                    position : dummy.position.clone(),
                    rotation : dummy.rotation.clone(),
                    scale : dummy.scale.clone(),
                }
            )
        } else if(geometry == First_Floor_Switch_Boards_Instance.geometry){
            first_floor_switch_board_instanceMesh.transform.push(
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

//----------STARTING ANIMATION----------//
async function helper_pop_up_init(controls){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        },1500);
    });
}

function camera_animate(){
    //update the bookshelf 
    loading_page.querySelector('.loading-text').textContent = 'Loading Database...';
    update_Bookshelf(model)
    .then(async ()=>{
        //Load the Frustums
        document.querySelector('.loading-text').textContent = 'Loading Frustums...';
        await createFrustumInfo();
    }).then(async ()=>{
        //Load the tables
        document.querySelector('.loading-text').textContent = 'Loading Tables...';
        await createTablesInfo();
    }).then(async ()=>{
        //Load the GSAPs
        document.querySelector('.loading-text').textContent = 'Loading GSAP...';
        await createGsapInfo()
    })
    .then(()=>{
        loading_page.style.display = 'none';
        let screenWidth = window.innerHeight;
        let screenHeight = window.innerWidth;

        gsap.fromTo(
            ".main-menu",
            {
                opacity : 0,
                top : screenHeight/2,
                right : screenWidth/2,
            },
            {
                opacity : 1,
                top : `calc(${10}vh + 50px)`,
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
                right : screenHeight/2,
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
                    controls.minDistance = 344;
                    
                    helper_pop_up_init(controls).then(()=>{
                        //And then make the first pop up to appear
                        document.querySelector('.help-pop-up-position').style.display = 'flex';
                    });
                    
                }
            },
        );
    })
}

init();

//After loading the first floor bookshelf position could be updated
async function update_Bookshelf(model) {

    // Call out all the data all at once
    const { data, error } = await supabase
        .from('bookshelf_database')
        .select('mesh_name, x_pos, y_pos, z_pos, x_rot, y_rot, z_rot, x_sca, y_sca, z_sca')
        .in('mesh_name', first_floor_bookshelf_name);
    
    if(data){
        // Create a look up obejct just be used to fill the data
        const bookshelfMap = {};

        data.forEach(item => {
            bookshelfMap[item.mesh_name] = item;
        });
        
        for (let i = 0; i < first_floor_bookshelf_name.length; i++) {

            let bookshelf_name = first_floor_bookshelf_name[i];
            let bookshelf = model.getObjectByName(bookshelf_name);

            if (!bookshelf) {
                console.error(`Bookshelf ${bookshelf_name} not found`);
                continue;
            }

            let item = bookshelfMap[bookshelf_name];

            if (!item) {
                console.warn(`No DB entry for ${bookshelf_name}`);
                continue;
            }

            bookshelf.position.set(item.x_pos, item.y_pos, item.z_pos);
            bookshelf.rotation.set(item.x_rot, item.y_rot, item.z_rot);
            bookshelf.scale.set(item.x_sca, item.y_sca, item.z_sca);
        }

        console.log('Bookshelfs are updated according to the database')
    } else if(error){
        console.log('Error has occured')
    } else {
        console.log('Not Error or Data retrieved');
    }

    
}





//Responsive Website
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    //console.log(camera.position);
    //console.log(camera.rotation);

    //console.log(`Application flow : ${application_flow}`);
    
    controls.update();

    //Frustum Display
    if(isFrusutm){
        animatePopUp();
    } else {
        if(!isFrusutm) popupInvisible()    
    }
    render();
}

function render() {
    //renderer.render( scene, camera );
    //Outline will be visible always
    effect.render( scene, camera ); 
}
