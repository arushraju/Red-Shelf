//-------------IMPORTS---------------//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'; //To render the outline
import { Reflector } from 'three/addons/objects/Reflector.js'; //To render the reflection of the windows (Glass)

let camera, controls, scene, renderer;

//Make the back button disappear
document.querySelector('.flex-vertical-button').style.display = 'none';



//For the frustum
const popup_name = ["Stationary_Shop", "Seminar_Room" , "Reception" , "Computer" , 'Kiosk','Drop_Box_1','Drop_Box_2','Security','Text_Books','Reading_Room'];
const entrancePopup_name = ['Entrance_1','Entrance_2','Entrance_3','Entrance_4'];

const popup_objects = [];
const entrance_popup_object = [];

//---------------------LIBRARY FLOOR CONTROL ---------------------//

//This contains everything inside the library (All material of all the parts of library)


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

const library_child = [
    // 'Cube003', 
    // 'Cube003_1', 
    // 'Cube003_2', 
    // 'Cube003_3', 
    // 'Cube003_4', 
    // 'Cube003_5', 
    // 'Cube003_6', 
    // 'Cube003_7', 
    // 'Cube003_8', 
    // 'Cube003_9', 
    // 'Cube003_10', 
    // 'Cube003_11',
    'Reflectors',
    ...basement_floor_library_child,
    ...ground_floor_library_child,
    ...second_floor_library_child,
    ...wall_library
];


let first_and_second_floor; // First and Second Floor
let ground_and_first_floor; //Ground and First Floor

// These functions will allow us to change the opcaity of the different parts fo the library
function makeVisible(floor){
    //I will first make the entrance pop up to go away
    entrance_frustum = false;
    document.querySelector('.entrance-pop-up-container').style.display = 'none';
    
    // //And also make the entrance gsap to scale 0
    // model.traverse((child)=>{
    //     if(
    //         child.name == 'GSAP1' ||
    //         child.name == 'GSAP3' ||
    //         child.name == 'GSAP4' ||
    //         child.name == 'GSAP5'
    //     ){ child.scale.set(0,0,0); }
    // })

    //Then the floor drop down option to none
    floor_drop_down.style.display = 'none';
    is_floor_drop_down = false;

    // And then the reset-button will appear and the floor button will disappear
    document.querySelector('.reset-button').style.display = 'block';
    document.querySelector('.floor-button').style.display = 'none';

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

//This will reset the scale of all the library
function librartScaleReset(){
    //Then the floor drop down option to none
    floor_drop_down.style.display = 'none';

    // And then the reset-button will disappear and the floor button will appear
    document.querySelector('.reset-button').style.display = 'none';
    document.querySelector('.floor-button').style.display = 'block';


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
                    duration : 0.5,
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

                        ///I will first make the entrance pop up to appear
                        entrance_frustum = true;
                        document.querySelector('.entrance-pop-up-container').style.display = 'block';
                    }
                }
            )
        }
    });

    
}

// When 2D floor button is clicked
let is_floor_drop_down = false;
const floor_drop_down = document.querySelector('.drop-down-refresh-options');

//Initially the floor drop down is closed
floor_drop_down.style.display = 'none';

//Initially reset button will be set to none
document.querySelector('.reset-button').style.display = 'none';

//When floor button is clicked
document.querySelector('.floor-button').addEventListener('click',()=>{
    console.log(`Floor button is clicked | floor_drop_dwon = ${is_floor_drop_down}`);
    if(!is_floor_drop_down){
        floor_drop_down.style.display = 'flex';
        is_floor_drop_down = true;
    } else {
        floor_drop_down.style.display = 'none';
        is_floor_drop_down = false;
    }
});

//When the reset button is clicked
document.querySelector('.reset-button').addEventListener('click',()=>{
    //Now I will reset the size of all the mesh and instancesw
    librartScaleReset();
})

// When the floor is selected

//When the Basement option is clicked
document.querySelector('#basement-floor-option').addEventListener('click',()=>{
    //Make the basement of the librayr visible
    makeVisible('Basement_Floor');
});
//When the Ground Floor option is clicked
document.querySelector('#ground-floor-option').addEventListener('click',()=>{
    //Make the ground floor of the library visible
    makeVisible('Ground_Floor');
});
//When the First Floor option is clicked
document.querySelector('#first-floor-option').addEventListener('click',()=>{
    //Make the ground floor of the library visible
    makeVisible('First_Floor');
});
//When the Second Floor option is clicked
document.querySelector('#second-floor-option').addEventListener('click',()=>{
    
    //Make the ground floor of the library visible
    makeVisible('Second_Floor');
})



//----------------------------------------//

//This list will contain all the elements that I dont want to be clicked. This includes library and instances which doesn't have to clicked but can also not be the part of library
const unclickables = [
    'Cycle',
    'Cycle_Stand',
    'First_Floor_Table_Instance',
    'Ground_Floor_Table_Instance',
    ...library_child //Spread Operator
];

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
    //Make the loading poage disappear
    loading_page.style.display = 'none';
    
    //Make the Pop up disappear
    stationary_pop_up.style.display = 'none';
    
    //Start the Application by animating the camera
    camera_animate();
}

//------------GEOLOCATION-------------//
function success(pos){
    console.log(`lat = ${pos.coords.latitude} | lon = ${pos.coords.longitude}`);
}

function error(err){
    console.log(err);
    //if the user has denied the permission
    if(err.code == 1){alert('Please allow the website to use your current location :)');}
    else alert('Due to some technical issue the website can not use the live location :(');
}

const options = {
    enableHighAccurcy : true,
}

function geolocationTracker(){
    if(!window.navigator.geolocation){
        throw new Error('Geo-location is not available');
    } else{
        //console.log('Geolocation is Available');
        //Continue using it
        window.navigator.geolocation.getCurrentPosition(success, error, options);
    }
}

let geolocation = false;

document.querySelector('.geolocation-option').addEventListener('click',()=>{
    document.querySelector('.drop-down-options').style.display = 'none';
    isDropDownOpen = false;
    console.log('Geo-location is clicked');
    if(!geolocation) geolocation = true;
    else geolocation = false;
})


//Can actually go on programming what would happen on clicking on the options button
const option_button = document.querySelector('.options');
let isDropDownOpen = false;

//When options button is clicked
option_button.addEventListener('click',()=>{
    console.log('Options is clicked');
    //Display the drop box if not displayed
    if(!isDropDownOpen){
        document.querySelector('.drop-down-options').style.display = 'flex';
        isDropDownOpen = true;
    } else {
        document.querySelector('.drop-down-options').style.display = 'none';
        isDropDownOpen = false;
    }
});

//Event listener at the Frustum options
let Frustum = false;
document.querySelector('.frustum-option').addEventListener('click',()=>{
    document.querySelector('.drop-down-options').style.display = 'none';
    isDropDownOpen = false;
    if(!Frustum) Frustum = true;
    else Frustum = false;
});

//Percentage bar option button
let percentageDisplay = false;
document.querySelector('.percentage-bar-container').style.display = 'none';
document.querySelector('.gsap-container').style.display = 'none';

document.querySelector('.percentage-bar-option').addEventListener('click',()=>{
    console.log('Percentage Bar option was clicked');
    document.querySelector('.drop-down-options').style.display = 'none';
    isDropDownOpen = false;
    if(!percentageDisplay){
        percentageDisplay = true;
        document.querySelector('.percentage-bar-container').style.display = 'flex';
        document.querySelector('.gsap-container').style.display = 'flex';
    } else{
        percentageDisplay = false;
        document.querySelector('.percentage-bar-container').style.display = 'none';
        document.querySelector('.gsap-container').style.display = 'none';
    }

    // Now we can think of adding the 
})

//Loading the World
const loader = new GLTFLoader(loadingManager);

let model = null;
const interactive_objects = [];
const bookshelfs_nearby = [];

//Initially the refresh and floor button will be none
document.querySelector('.refresh-button-container').style.display = 'none';

//-------------CARTTONIFY MODEL-----------------//
function cartoonify_Model(model){
    model.traverse((child) => {
        if (child.isMesh) {

            // Create outline material
            const outlineMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.BackSide
            });

            // Create outline mesh
            const outlineMesh = new THREE.Mesh(
                child.geometry,
                outlineMaterial
            );

            // Copy position, rotation, scale
            outlineMesh.position.copy(child.position);
            outlineMesh.rotation.copy(child.rotation);
            outlineMesh.scale.copy(child.scale);

            // Slightly enlarge
            outlineMesh.scale.multiplyScalar(1.0005);

            // Add outline to same parent
            child.parent.add(outlineMesh);
        }
    });
}

//------------------RAY CASTING-------------------//

let selectedObject = null;
let GSAP_Selected = null;
let previuosly_selected_GSAP = null;
let next_GSAP = null;

//------------------FORM SUBMIT---------------------//
const form = document.querySelector('#searchForm');

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

const bookID = document.querySelector('#fname'); //This will store the ID of the book
let ID = bookID.value;

form.addEventListener('submit',function (e){
    //Prevent the website from reloading after submittin the form
    e.preventDefault();

    //Make the Entrance Frustum Visible
    entrance_frustum = true;

    //By default I would like to have the outline turned off.
    changeOutline(0);
    
    
    //Now the form disappers and the refresh and floor button appears instead
    document.querySelector('.refresh-button-container').style.display = 'flex';
    //back and option container must not appear yet
    document.querySelector('.back-option-container').style.display = 'none';
    //Search bar has to disappear
    form.style.display = 'none';
    //Now instaed of library turning it's opacity to 0.5 I will make the opcaity option appear
    // document.querySelector('.Floor-options-container').style.display = 'block';


    document.querySelector('.button-24').style.background = 'rgb(139, 0, 0)';
    document.querySelector('.button-24').style.color = 'rgba(255, 255, 255, 1)';
    

    //After pressing the submit button make the library to change it's opacity to 0.5 and for now all the GSAP will turn their scale to zero.
    let list = [
        'GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19','GSAP20','GSAP21','GSAP22','GSAP23',
        'GSAP_T_1', 'GSAP_T_2', 'GSAP_T_3', 'GSAP_T_4', 'GSAP_T_5', 'GSAP_T_13', 'GSAP_T_14', 'GSAP_T_15', 'GSAP_T_16', 'GSAP_T_17', 'GSAP_T_18', 'GSAP_T_19',
    ];
    for (let i = 21 ; i <= 30 ; i++){list.push(`GSAP_T_${i}`);}
    for (let i = 47 ; i <= 63 ; i++){list.push(`GSAP_T_${i}`);}


    model.traverse((child) => {
        //Push the child into the entrance frustum object
        if(entrancePopup_name.includes(child.name)){
            entrance_popup_object.push(child);
        }
        //push the child that is into the frustum object.
        if(popup_name.includes(child.name)){
            popup_objects.push(child);
            //console.log(popup_objects);
        }
        //GSAP turning their scale to zero.
        if(list.includes(child.name)){
            child.scale.x = 0;
            child.scale.y = 0;
            child.scale.z = 0;
        }
    });

    ID = bookID.value;
    
    //This function will make the Entrance GSAP to scale up, Update the interactive objects array, and will also make the bookshelf nearby to enter into the list bookshelf_nearby
    gsap_and_bookshelf(ID,list);

    //And then make the shelf and the corresponding GSAP red, and scaled up. Note that this will only work if the user wants to find a book
    if(ID >= 1 && ID <= 62){
        makeShelfRed(ID);
        makeVisible('First_Floor'); //Make the scale of that specific floor to zero.
    } else if(ID == 64){
        makeVisible('Second_Floor');
    } else if(ID == 63){
        makeVisible('Ground_Floor');
    }

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
        // // Only the entrance GSAP will be truned up
        // if(
        //     child.name == 'GSAP5' || 
        //     child.name == 'GSAP4' || 
        //     child.name == 'GSAP1' || 
        //     child.name == 'GSAP3'
        // ){
        //     gsap.to(
        //         child.scale,
        //         {
        //             x : 1,
        //             y : 1,
        //             z : 1,
        //             duration : 1
        //         }
        //     );
        // }

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

//----------------------Refresh-------------------------//
document.querySelector('.refresh').addEventListener('click',()=>{
    //console.log('You have clicked the Refresh button')
    window.location.reload();
})


//-----------------BACK BUTTON------------------//
document.querySelector(".back").addEventListener('click',()=>{

    //I will first make the scale of target shelf to zero. And also set the target instance to be visible.
    if(ID >= 1 && ID <= 62) makeShelfRed(ID);
    
    //After pressing the back button the opcaity of mesh must turn back to normal
    //console.log(ID);
    if(ID !== ""){
        //refresh and floor button appears
        document.querySelector('.refresh-button-container').style.display = 'flex';
        //back and option container must not appear yet
        document.querySelector('.back-option-container').style.display = 'none';

        //Make the booklshef nearby to scale up
        bookshelfs_nearby.forEach((i)=>{
            setInstanceScale(i-1,1,first_floor_bookshelf_instancedMesh);
        })
    }
    //If there is no book ID selected then make the make the search bar appear
    else{
        //console.log("You haven't entered any bookID");
        document.querySelector('.form').style.display = 'block';
    }
        
    //console.log('You have clicked the back button');
    //Make the back button disapper
    
    document.querySelector('.flex-vertical-button').style.display = 'none';
    

    //Reset the Controls
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.enablePan = false;
    controls.minDistance = 0;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;

    //Reset the Camera
    gsap.to(
        camera.position,
        {
            x: 551.5,
            y: 318.043,
            z: 348.3,
            duration: 1,
            onComplete : ()=>{
                controls.minDistance = 340;
            }
        }
    );
    
    gsap.to(
        controls.target,
        {
            x: 0,
            y: 0,
            z: 0,
            duration: 1
        }
    )

    // //Reset size of all the meshes
    //Then only the entrance GSAP to scale up and the rest of all the interactive objects will be turned to zero. 
    interactive_objects.forEach((child)=>{
        //console.log(child.name);
        if(child.name == 'GSAP5' || child.name == 'GSAP4' || child.name == 'GSAP3' || child.name == 'GSAP1'){
            gsap.to(
                child.scale,
                {
                    x:1,
                    y:1,
                    z:1,
                    duration:1
                }
            )
        } else {
            gsap.to(
                child.scale,
                {
                    x:0,
                    y:0,
                    z:0,
                    duration:1,
                    onComplete : ()=>{
                        gsap.killTweensOf(child.scale);
                    }
                }
            )
        }
    });

    //make the gsap selected null
    GSAP_Selected = null;

    //Make the percentage bar scale to zero
    //And then the percentage bar coul;d be animated
    gsap.to(
        document.querySelector('.percentage-bar'),
        {
            height : `${0}%`,
            duration : 1,
            ease: "power2.out",
        }
    );

    //Make the Entrance Frustum Visible
    entrance_frustum = true;
    //make the Entrance pop up disppaer
    document.querySelector('.entrance-pop-up-container').style.display=  'block';

});

//This function will display the back option
function displayBack(){
    //Make the Form Disapper
    document.querySelector('.form').style.display = 'none';
    //Disapper the refresh and floor button
    document.querySelector('.refresh-button-container').style.display = 'none';
    //document.querySelector('.book').style.display = 'block';
    document.querySelector('.back-option-container').style.display = 'block';
    document.querySelector('.flex-vertical-button').style.display = 'flex';
}

//----------------RAYCASTING----------------//
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let worldPos = new THREE.Vector3(); //To store the location of GSAP

document.addEventListener( 'click', onPointerMove );

//This function will take the slected GSPA and then animate the camera to that GSAP and will update the next GSAP also

function animate_Selection_complete(selectedObject){
    //This will track the next gsap from all the entrance to the entrance of the library.
    if(selectedObject.name == "GSAP1"){
        //console.log("Do what you want to with GSAP1");
        animate_Selection(selectedObject,18,-0.5,0);
        next_GSAP = 'GSAP9';
    } else if(selectedObject.name == "GSAP3") {
        //console.log("Do what you want to with GSAP3");
        animate_Selection(selectedObject,18,-0.5,0);
        next_GSAP = 'GSAP8'
    } else if(selectedObject.name == "GSAP4") {
        //console.log("Do what you want to with GSAP4");
        animate_Selection(selectedObject,18,0.5,0);
        next_GSAP = 'GSAP8'
    } else if(selectedObject.name == "GSAP5") {
        //console.log("Do what you want to with GSAP5");
        animate_Selection(selectedObject,18,0.5,0);
        next_GSAP = 'GSAP6';
    } else if(selectedObject.name == "GSAP6") {
        //console.log("Do what you want to with GSAP6");
        animate_Selection(selectedObject,18,0.5,0);
        next_GSAP = 'GSAP9';
    } else if(selectedObject.name == "GSAP8") {
        //console.log("Do what you want to with GSAP8");
        animate_Selection(selectedObject,18,0,+0.5);
        next_GSAP = 'GSAP9';
    } else if(selectedObject.name == "GSAP9") {
        //console.log("Do what you want to with GSAP9");
        animate_Selection(selectedObject,15,0,0.5);
        next_GSAP = 'GSAP13'
    } 
    
    //From here the next GSAP will depend on the ID
    else if(selectedObject.name == "GSAP11") {
        //console.log("Do what you want to with GSAP9");
        animate_Selection(selectedObject,16,0,-0.5);
        next_GSAP = 'GSAP12'; //This is the bottom part of the stairs (Obviously to move up. No matter waht ID)
    } else if(selectedObject.name == "GSAP12") {
        //Move the camera to the location
        animate_Selection(selectedObject,16,0.5,0);
        //Doesnt depend on the ID
        next_GSAP = 'GSAP14';
    } 
    
    //If the value of ID is equal to 63 then the user wants to go to Reading Room
    //if the value of ID is between 1 and 62 then the user wants to go to First Floor
    //If the value of ID is equal to 64 then the user wants to go to Second Floor
    else if(selectedObject.name == "GSAP13") {
        
        if((ID >= 1 && ID <= 62) || ID == 64){ 
            animate_Selection(selectedObject,16,-0.5,0);
            next_GSAP = 'GSAP11';
        }
        else if(ID == 63) { 
            animate_Selection(selectedObject,16,-0.5,-0.5);
            next_GSAP = 'GSAP20'; 
        }
    } 
    
    //If ID is between 1 to 62 the user wants to go to the bookshelfs.
    else if(selectedObject.name == "GSAP14") {
        if(ID >= 1 && ID <= 62){
            animate_Selection(selectedObject,16,0,-0.5);
            next_GSAP = 'GSAP15';
        } else if(ID == 64){
            animate_Selection(selectedObject,16,0,0.5);
            next_GSAP = 'GSAP16';
        }
        
    } 
    
    //This will depend on lots of things.
    else if(selectedObject.name == "GSAP15") {
        if(ID >= 1 && ID <= 5){
            animate_Selection(selectedObject,17,0.5,0);
            next_GSAP = getTargetGSAP(ID); //This will make the next GSAP to be the target GSAP
        } else if(ID >= 6 && ID <= 20) {
            animate_Selection(selectedObject,17,0,-0.5);
            next_GSAP = 'GSAP18';
        } else if (ID >= 21 && ID <= 30) {
            animate_Selection(selectedObject,17,-0.5,0);
            next_GSAP = getTargetGSAP(ID); //This will make the next GSAP to be the target GSAP
        } else if (ID >= 31 && ID <= 62) {
            animate_Selection(selectedObject,17,0,-0.5);
            next_GSAP = 'GSAP18';
        }  
    } 
    
    else if(selectedObject.name == "GSAP16") {
        animate_Selection(selectedObject,16,-0.5,0);
        next_GSAP = 'GSAP17';
    } else if(selectedObject.name == "GSAP17") {
        animate_Selection(selectedObject,16,0,-0.5);
        next_GSAP = 'GSAP19';//The next step would definitely be to move up the stairs.
    } 
    
    else if(selectedObject.name == "GSAP18") {
        if(ID >= 5 && ID <= 20){
            animate_Selection(selectedObject,16,0.5,0);
            next_GSAP = getTargetGSAP(ID);
        } else if (ID >= 31 && ID <=62) {
            animate_Selection(selectedObject,16,-0.5,0);
            next_GSAP = getTargetGSAP(ID);
        }   
    } else if(selectedObject.name == "GSAP19") {
        animate_Selection(selectedObject,16,0.5,0);
        next_GSAP = null;
    } else if(selectedObject.name == "GSAP20") {
        animate_Selection(selectedObject,16,-0.5,0);
        next_GSAP = 'GSAP21';
    } else if(selectedObject.name == "GSAP21") {
        animate_Selection(selectedObject,16,-0.1,0.1);
        next_GSAP = 'GSAP23';
    } else if(selectedObject.name == 'GSAP22') {
        animate_Selection(selectedObject,)
        next_GSAP = null;
    } else if(selectedObject.name == 'GSAP23'){
        animate_Selection(selectedObject,16,-0.1,-0.1);
        next_GSAP = null;
    }

    //Animating the target GSAP Selection
    for(let i = 1; i <= 5; i++){
        if(selectedObject.name == `GSAP_T_${i}`){
            animate_Selection(selectedObject,16,0,0.5);
            next_GSAP = null;
            break;
        }
    }
    for(let i = 13; i <= 20; i++){
        if(selectedObject.name == `GSAP_T_${i}`){
            if(ID >= 6 && ID <= 12){
                animate_Selection(selectedObject,16,0,0.5);
                next_GSAP = null;
                break;
            } else if(ID >= 13 && ID <= 19){
                animate_Selection(selectedObject,16,0,-0.5);
                next_GSAP = null;
                break;
            }
        }
    }
    for(let i = 21; i <= 30; i++){
        if(selectedObject.name == `GSAP_T_${i}`){
            animate_Selection(selectedObject,16,0,0.5);
            next_GSAP = null;
            break;
        }
    }
    for(let i = 31; i <= 62; i++){
        if(selectedObject.name == `GSAP_T_${i}`){
            if(ID >= 31 && ID <= 46){
                animate_Selection(selectedObject,16,0,0.5);
                next_GSAP = null;
                break;
            } else if(ID >= 47 && ID <= 62){
                animate_Selection(selectedObject,16,0,-0.5);
                next_GSAP = null;
                break;
            }
        }
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
                //Remove gsap for the previous GSAP
                if(GSAP_Selected) {
                    previuosly_selected_GSAP = GSAP_Selected;
                    //console.log(`Previously Selected object is ${previuosly_selected_GSAP.name}`);
                }
                
            }
            
            animate_Selection_complete(selectedObject);

            // //This will track the next gsap from all the entrance to the entrance of the library.
            // if(selectedObject.name == "GSAP1"){
            //     //console.log("Do what you want to with GSAP1");
            //     animate_Selection(selectedObject,18,-0.5,0);
            //     next_GSAP = 'GSAP9';
            // } else if(selectedObject.name == "GSAP3") {
            //     //console.log("Do what you want to with GSAP3");
            //     animate_Selection(selectedObject,18,-0.5,0);
            //     next_GSAP = 'GSAP8'
            // } else if(selectedObject.name == "GSAP4") {
            //     //console.log("Do what you want to with GSAP4");
            //     animate_Selection(selectedObject,18,0.5,0);
            //     next_GSAP = 'GSAP8'
            // } else if(selectedObject.name == "GSAP5") {
            //     //console.log("Do what you want to with GSAP5");
            //     animate_Selection(selectedObject,18,0.5,0);
            //     next_GSAP = 'GSAP6';
            // } else if(selectedObject.name == "GSAP6") {
            //     //console.log("Do what you want to with GSAP6");
            //     animate_Selection(selectedObject,18,0.5,0);
            //     next_GSAP = 'GSAP9';
            // } else if(selectedObject.name == "GSAP8") {
            //     //console.log("Do what you want to with GSAP8");
            //     animate_Selection(selectedObject,18,0,+0.5);
            //     next_GSAP = 'GSAP9';
            // } else if(selectedObject.name == "GSAP9") {
            //     //console.log("Do what you want to with GSAP9");
            //     animate_Selection(selectedObject,15,0,0.5);
            //     next_GSAP = 'GSAP13'
            // } 
            
            // //From here the next GSAP will depend on the ID
            // else if(selectedObject.name == "GSAP11") {
            //     //console.log("Do what you want to with GSAP9");
            //     animate_Selection(selectedObject,16,0,-0.5);
            //     next_GSAP = 'GSAP12'; //This is the bottom part of the stairs (Obviously to move up. No matter waht ID)
            // } else if(selectedObject.name == "GSAP12") {
            //     //Move the camera to the location
            //     animate_Selection(selectedObject,16,0.5,0);
            //     //Doesnt depend on the ID
            //     next_GSAP = 'GSAP14';
            // } 
            
            // //If the value of ID is equal to 63 then the user wants to go to Reading Room
            // //if the value of ID is between 1 and 62 then the user wants to go to First Floor
            // //If the value of ID is equal to 64 then the user wants to go to Second Floor
            // else if(selectedObject.name == "GSAP13") {
                
            //     if((ID >= 1 && ID <= 62) || ID == 64){ 
            //         animate_Selection(selectedObject,16,-0.5,0);
            //         next_GSAP = 'GSAP11';
            //     }
            //     else if(ID == 63) { 
            //         animate_Selection(selectedObject,16,-0.5,-0.5);
            //         next_GSAP = 'GSAP20'; 
            //     }
            // } 
            
            // //If ID is between 1 to 62 the user wants to go to the bookshelfs.
            // else if(selectedObject.name == "GSAP14") {
            //     if(ID >= 1 && ID <= 62){
            //         animate_Selection(selectedObject,16,0,-0.5);
            //         next_GSAP = 'GSAP15';
            //     } else if(ID == 64){
            //         animate_Selection(selectedObject,16,0,0.5);
            //         next_GSAP = 'GSAP16';
            //     }
                
            // } 
            
            // //This will depend on lots of things.
            // else if(selectedObject.name == "GSAP15") {
            //     if(ID >= 1 && ID <= 5){
            //         animate_Selection(selectedObject,17,0.5,0);
            //         next_GSAP = getTargetGSAP(ID); //This will make the next GSAP to be the target GSAP
            //     } else if(ID >= 6 && ID <= 20) {
            //         animate_Selection(selectedObject,17,0,-0.5);
            //         next_GSAP = 'GSAP18';
            //     } else if (ID >= 21 && ID <= 30) {
            //         animate_Selection(selectedObject,17,-0.5,0);
            //         next_GSAP = getTargetGSAP(ID); //This will make the next GSAP to be the target GSAP
            //     } else if (ID >= 31 && ID <= 62) {
            //         animate_Selection(selectedObject,17,0,-0.5);
            //         next_GSAP = 'GSAP18';
            //     }  
            // } 
            
            // else if(selectedObject.name == "GSAP16") {
            //     animate_Selection(selectedObject,16,-0.5,0);
            //     next_GSAP = 'GSAP17';
            // } else if(selectedObject.name == "GSAP17") {
            //     animate_Selection(selectedObject,16,0,-0.5);
            //     next_GSAP = 'GSAP19';//The next step would definitely be to move up the stairs.
            // } 
            
            // else if(selectedObject.name == "GSAP18") {
            //     if(ID >= 5 && ID <= 20){
            //         animate_Selection(selectedObject,16,0.5,0);
            //         next_GSAP = getTargetGSAP(ID);
            //     } else if (ID >= 31 && ID <=62) {
            //         animate_Selection(selectedObject,16,-0.5,0);
            //         next_GSAP = getTargetGSAP(ID);
            //     }   
            // } else if(selectedObject.name == "GSAP19") {
            //     animate_Selection(selectedObject,16,0.5,0);
            //     next_GSAP = null;
            // } else if(selectedObject.name == "GSAP20") {
            //     animate_Selection(selectedObject,16,-0.5,0);
            //     next_GSAP = 'GSAP21';
            // } else if(selectedObject.name == "GSAP21") {
            //     animate_Selection(selectedObject,16,-0.1,0.1);
            //     next_GSAP = 'GSAP23';
            // } else if(selectedObject.name == 'GSAP22') {
            //     animate_Selection(selectedObject,)
            //     next_GSAP = null;
            // } else if(selectedObject.name == 'GSAP23'){
            //     animate_Selection(selectedObject,16,-0.1,-0.1);
            //     next_GSAP = null;
            // }

            // //Animating the target GSAP Selection
            // for(let i = 1; i <= 5; i++){
            //     if(selectedObject.name == `GSAP_T_${i}`){
            //         animate_Selection(selectedObject,16,0,0.5);
            //         next_GSAP = null;
            //         break;
            //     }
            // }
            // for(let i = 13; i <= 20; i++){
            //     if(selectedObject.name == `GSAP_T_${i}`){
            //         if(ID >= 6 && ID <= 12){
            //             animate_Selection(selectedObject,16,0,0.5);
            //             next_GSAP = null;
            //             break;
            //         } else if(ID >= 13 && ID <= 19){
            //             animate_Selection(selectedObject,16,0,-0.5);
            //             next_GSAP = null;
            //             break;
            //         }
            //     }
            // }
            // for(let i = 21; i <= 30; i++){
            //     if(selectedObject.name == `GSAP_T_${i}`){
            //         animate_Selection(selectedObject,16,0,0.5);
            //         next_GSAP = null;
            //         break;
            //     }
            // }
            // for(let i = 31; i <= 62; i++){
            //     if(selectedObject.name == `GSAP_T_${i}`){
            //         if(ID >= 31 && ID <= 46){
            //             animate_Selection(selectedObject,16,0,0.5);
            //             next_GSAP = null;
            //             break;
            //         } else if(ID >= 47 && ID <= 62){
            //             animate_Selection(selectedObject,16,0,-0.5);
            //             next_GSAP = null;
            //             break;
            //         }
            //     }
            // }
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


//This will bring the camera to the selected GSAP
function animate_Selection(selected_object,camera_height,camera_orientation_y,camera_orientation_x){

    //I will make the target mesh to be at the target instance of bookshelf and the target insatcne to scale down
    if(ID >= 1 && ID <= 62){makeTargetShelf(ID);}
     

    //Also when selected a GSPA location, all the mesh except for the bookshelf nearby must scale to 0
    if(model){
        //This will make every thing in the library to be opaque.
        model.traverse((child)=>{
            if(child.isMesh && library_child.includes(child.name)){
                //console.log(`This makes the child named ${child.name} opaque`);
                gsap.to(
                    child.material,
                    {
                        opacity : 1,
                        duration : 1,
                        onComplete : ()=>{
                            child.material.depthWrite = true;
                            child.material.depthTest = true;
                        }
                    }
                )
            } 

            
        });
    };
    
    //Since we are working with instances we could directly turn the nearby mesh to transparent
    //console.log(bookshelfs_nearby);
    bookshelfs_nearby.forEach((i)=>{
        setInstanceScale(i-1,0.5,first_floor_bookshelf_instancedMesh);
    })
    

    //Get the World cordinate of the selected object
    selected_object.getWorldPosition(worldPos);
    //console.log(`World Position = (${worldPos.x}, ${worldPos.y}, ${worldPos.z})`);

    //Make the camera go to the cordinate of Selected object
    gsap.to(
        camera.position,
        {  
            x: worldPos.x,
            y: worldPos.y + camera_height,
            z: worldPos.z, 
            ease: "slow(0.7,0.7,false)",
            duration: 1,
            onComplete: ()=>{
                controls.enableRotate = true;
                controls.maxPolarAngle = Math.PI / 1;
                displayBack();
                //Make the entrance frustum display to none
                entrance_frustum = false;
                //make the Entrance pop up disppaer
                document.querySelector('.entrance-pop-up-container').style.display=  'none';
                //Now I will update the selcted GSAP to Slected object
                GSAP_Selected = selectedObject; //TO avoid the problem of outline
                
            }
        }, 
    );

    gsap.to(
        controls,
        {
            maxDistance : camera_height,
            minDistance: camera_height,
            duration : 1
        }
    )

    gsap.to(
        controls.target,
        {
            x: worldPos.x - camera_orientation_x,
            y: worldPos.y + camera_height,
            z: worldPos.z - camera_orientation_y,
            duration : 1,
            // ease: "back.out(1.7)",
        }
    )

    // Make all the Interactive GSAP other than the seletced GSAP's scale to 1
    interactive_objects.forEach((child)=>{ 
        // Remove Animation from all the interactive GSAP
        gsap.killTweensOf(child.scale);
        if(child.name !== selectedObject.name && child.name !== next_GSAP){
            // console.log(child.name);
            gsap.to(
                child.scale,
                {
                    x:1,
                    y:1,
                    z:1,
                    duration:1,
                    onComplete : ()=>{
                        animateGSAP(child, next_GSAP);
                    }
                }
            )
        }
        
    });

    //make the scale of Selected object zero.
    gsap.to(
        selected_object.scale,
        {
            x:0,
            y:0,
            z:0,
            duration : 1
        }
    )

    //Update the height of the percentage bar
    let updated_height = updatePercentageBar(selectedObject,ID);
    //And then the percentage bar could be animated
    gsap.to(
        document.querySelector('.percentage-bar'),
        {
            height : `${updated_height}%`,
            duration : 1,
            ease: "power2.out",
        }
    );
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



//----------------DIRECTIONS---------------//

//This function will take the arguments as the particular GSAP's and also the penalty and will return the weight
function getWeight(gsap1,gsap2,penalty,model){
    //Find the object named gsap1 and gsap2
    let gsap1_object = model.getObjectByName(gsap1);
    let gsap2_object = model.getObjectByName(gsap2);

    // And then find the distance between them
    let position1 = new THREE.Vector3();
    let position2 = new THREE.Vector3();

    gsap1_object.getWorldPosition(position1);
    gsap2_object.getWorldPosition(position2);

    //And now find the distance ebtween them
    let distance = Math.sqrt( Math.pow(( (position1.x - position2.x) ) ,2) + Math.pow(( position1.y - position2.y ) , 2) + Math.pow( ( position1.z  - position2.z) , 2));
    let weight = distance * penalty;

    return weight;
}

// This will store all the directions objects and their connecting edges
const penalty_flat_floor = 1;
const penalty_stairs = 2;

const direction = [];
const searched_direction = [];

function initDirectionObjects(model){
    let direction_1 = {
        name : "direction_1",
        node  : ["GSAP4" , "GSAP8"],
        weight : getWeight("GSAP4","GSAP8",penalty_flat_floor,model),
    }
    //Pushing the objects into the direction object
    direction.push(direction_1);

    let direction_2 = {
        name : 'direction_2',
        node : ['GSAP5','GSAP6'],
        weight : getWeight("GSAP5",'GSAP6',penalty_flat_floor,model),
    }
    //Pushing the objects into the direction object
    direction.push(direction_2);

    let direction_3 = {
        name : 'direction_3',
        node : ['GSAP8','GSAP9'],
        weight : getWeight("GSAP8",'GSAP9',penalty_stairs,model),
    }
    //Pushing the objects into the direction object
    direction.push(direction_3);

    let direction_4 = {
        name : 'direction_4',
        node : ['GSAP8'],
        weight : 0,
    }
    //Pushing the objects into the direction object
    direction.push(direction_4);

    let direction_5 = {
        name : 'direction_5',
        node : ['GSAP8','GSAP3'],
        weight : getWeight("GSAP8",'GSAP3',penalty_flat_floor,model),
    }
    //Pushing the objects into the direction object
    direction.push(direction_5);

    let direction_6 = {
        name : 'direction_6',
        node : ['GSAP5','GSAP9'],
        weight : getWeight("GSAP5",'GSAP9',penalty_flat_floor,model),
    }
    //Pushing the objects into the direction object
    direction.push(direction_6);

    let direction_7 = {
        name : 'direction_7',
        node : ['GSAP9'],
        weight : 0,
    }
    //Pushing the objects into the direction object
    direction.push(direction_7);
}

//This function will add mateirls to the every element in the directions and will also scale them down
function resetDirections(model){
    const properties = {
        color: 0xff0000,
        emissive: 0xff0000,
        transparent: true,
        opacity: 0.5  
    }
    // Mesh Standard Materials
    // const material = new THREE.MeshStandardMaterial( properties );
    const material = new THREE.MeshToonMaterial( properties );
    

    direction.forEach((child)=>{
        //Get the obejct from the mesh
        let obj = model.getObjectByName(child.name);
        if(obj){
            //And then set the materilas of the obejct
            obj.material = material;
            
            //And the set the scale of every direction object to zero
            obj.scale.set(0,0,0);
        } else { console.log(`Some direction obejct is missing | name = ${child.name}`); } 
    })
}

//This function will take the id of the search and will scale up the neccesary directions using the Dijkstra Algorithm
function scaleDirections(model,id){
    //Here we will find the 
}


//----------------  INITIATE --------------//

//This function will reset the camera and the control target
function resetCamera(camera,controls){
    //Setting the camera position
    camera.position.set( 551.5, 318.043, 348.3 );
    //Reset the controls

    //controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    //controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    //To disable the pan motion
    controls.enablePan = false;
    controls.minDistance = 0;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;
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
    loader.load( './Test/Mesh_Test.glb', function ( gltf ) {
        model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive = new THREE.Color(0xffffff); // same as color or lighter
                child.material.emissiveIntensity = 0.1; // increase to make it glow more
            }
        });

        //Also make all the gsap turn the scale down
        let list = ['GSAP1','GSAP3','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP15','GSAP16','GSAP17','GSAP18','GSAP19','GSAP20','GSAP21'];

        if(model){
            model.traverse((child)=>{
                if(list.includes(child.name)){
                    child.scale.x = 0;
                    child.scale.y = 0;
                    child.scale.z = 0;
                }
            });
        }

        scene.add( gltf.scene );

        //Mesh to be instanced
        cycleMesh = gltf.scene.getObjectByName('Cycle');
        CycleStandMesh = gltf.scene.getObjectByName('Cycle_Stand');
        AirConditioner_mesh = gltf.scene.getObjectByName('Air_Conditioner_Instance');
        first_floor_table_instance = gltf.scene.getObjectByName('First_Floor_Table_Instance');
        Ground_Floor_Table = gltf.scene.getObjectByName('Ground_Floor_Table_Instance');

        First_Floor_Bookshelf_Instance = gltf.scene.getObjectByName('First_Floor_Bookshelf_Instance');
        //const Direction_mesh = gltf.scene.getObjectByName('Direction_instance');

        if (!cycleMesh) {console.error('Mesh named "cycle" not found');return;}

        //Instancing
        createInstances(cycleMesh.geometry, cycleMesh.material,loadCycleTransforms);//Cycle Instance
        createInstances(First_Floor_Bookshelf_Instance.geometry,First_Floor_Bookshelf_Instance.material,loadFirstFloorBookshelfsTransform)//First Floor Bookshelf
        createInstances(CycleStandMesh.geometry,CycleStandMesh.material,loadCycleStandTransforms);//Cycle Stand Instance
        createInstances(AirConditioner_mesh.geometry,AirConditioner_mesh.material,loadAirConditionTransforms);//Air Conditioner Instance
        createInstances(first_floor_table_instance.geometry,first_floor_table_instance.material,loadFirstFloorTablesTransform)//First floor Tables
        createInstances(Ground_Floor_Table.geometry,Ground_Floor_Table.material,loadGroundFloorTablesTransform); //Ground Floor Tables.

        // Will fill the direction data into the object named 'direction'
        initDirectionObjects(model);
        // This will set the material of the directions and will also scale them down
        resetDirections(model);

    
    }, undefined, function ( error ) {

    console.error( error );

    } );  

    
    

    // lights
    const color = 0xFFFFFF;
    const skyColor = 0xF1F0E4;  // light blue
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
    //

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
//This function will make the table turn thier color to red and green dependig on the date
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

//Initially the color of benches will be set to brown
let seatOccupancyVisible = false;
//ColorReset(first_floor_bookshelf_instancedMesh);

// If the Occupancy is clicked
document.querySelector('.seat-availability-option').addEventListener('click',()=>{
    //make the option drop down disappear
    document.querySelector('.drop-down-options').style.display = 'none';
    isDropDownOpen = false;

    //If the option is clicked
    if(!seatOccupancyVisible){
        seatOccupancyVisible = true;
        //Make the seats red and green
        setColor(first_floor_tables_instancedMesh,first_floor_occupied_seats);
        setColor(ground_floor_tables_instancedMesh,ground_floor_occupied_seats)
    } else{
        seatOccupancyVisible = false;
        //Reset all the colors.
        ColorReset(first_floor_tables_instancedMesh);
        ColorReset(ground_floor_tables_instancedMesh);
    }

    console.log(`seat occupancy visible = ${seatOccupancyVisible}`);
});


//----------OUTLINE-------------//
//Now we can add the outline effect after creating the renderer.
const effect = new OutlineEffect( renderer );

let outlineVisible = false;
const outline_option = document.querySelector('.outline-option');
outline_option.addEventListener('click',()=>{
    if(!outlineVisible) outlineVisible = true;
    else outlineVisible = false;
    document.querySelector('.drop-down-options').style.display = 'none';
    isDropDownOpen = false;
});

//This function can make the outline of librayr to any value
function changeOutline(visiblity){
    if(model){
        //Collect the name of mesh you wnat to change the outline of
        let mesh = [ 
            model.getObjectByName('Cycle'),
            model.getObjectByName('Cycle_Stand'),
            model.getObjectByName('Air_Conditioner_Instance'),
            model.getObjectByName('Ground_Floor_Table_Instance'),
            model.getObjectByName('First_Floor_Table_Instance')
        ];

        //Chnage the Visibility of all the objects in the mesh
        mesh.forEach((child)=>{
            if(child){
                child.material.userData.outlineParameters = {
                    thickness: 0.003,
                    color: [0, 0, 0],
                    alpha: visiblity
                };
            }
        }) 
        
        //Then select all the memebers in the library child (Due to different material) and make their outline turn to zero.
        library_child.forEach((lib_material)=>{
            const obj = model.getObjectByName(lib_material);
            if(obj){
            obj.traverse((child)=>{
                    if(child.isMesh){
                        child.material.userData.outlineParameters = {
                            thickness: 0.003,
                            color: [0, 0, 0],
                            alpha: visiblity
                        };
                    }
                });
            }
        })
    }

    //if(mesh) {console.log(`Changed ${mesh.name} outline visibilty to ${visiblity}`);}; 
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
  const data = await loadTransforms();

  const count = data.length;

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
        ".search-container",
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
        ".the-icon",
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
        ".logo",
        {
            opacity: 0,
            scale: 0
        },
        {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out"
        }
    );

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
    

    //Frustum Display
    if(Frustum){animatePopUp();}
    else popupInvisible();

    //Geolocation
    if(geolocation){geolocationTracker();}

    

    render();

}

function render() {

    //renderer.render( scene, camera );

    effect.render( scene, camera );
    //This will make the outline go to zero immediately when the outline is turned off no matter what.
    if(!outlineVisible){
        changeOutline(0);
    } else if(outlineVisible && GSAP_Selected){
        //if the outline is turned on, then the outline will be turned on when the user has any active GSAP slected.
        changeOutline(1);
    } 
}
