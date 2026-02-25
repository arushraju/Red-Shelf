//-------------IMPORTS---------------//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'; //To render the outline

let camera, controls, scene, renderer;

//Make the back button disappear
document.querySelector('.book').style.display = 'none';

//I define the phase of the app
/*
    If the user is at phase 0 this means he is in the app but with no book submitted.
    If the user is at phase 1 this mean he is inside the GSAP
    If the user is at phase 2 this means he is outside the GSAP with book submitted.
*/

let app_phase;

//For the frustum
const popup_name = ["Stationary_Shop", "Seminar_Room" , "Reception" , "Computer" , 'Kiosk','Drop_Box_1','Drop_Box_2','Security','Text_Books','Reading_Room'];
const entrancePopup_name = ['Entrance_1','Entrance_2','Entrance_3','Entrance_4'];

const popup_objects = [];
const entrance_popup_object = [];

//This list will contain all the lements that I dont want to be cliked
const unclickables = ['Cube003','Cube041','Cycle','Cycle_Stand','First_Floor_Table_Instance','Ground_Floor_Table_Instance'];

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

document.querySelector('.percentage-bar-option').addEventListener('click',()=>{
    console.log('Percentage Bar option was clicked');
    document.querySelector('.drop-down-options').style.display = 'none';
    isDropDownOpen = false;
    if(!percentageDisplay){
        percentageDisplay = true;
        document.querySelector('.percentage-bar-container').style.display = 'flex';
    } else{
        percentageDisplay = false;
        document.querySelector('.percentage-bar-container').style.display = 'none';
    }
})

//Loading the World
const loader = new GLTFLoader(loadingManager);

let model = null;
const meshesByName = {};
const interactive_objects = [];
const bookshelfs_nearby = [];

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

    //Update the scale of pop up

    //Now we display the pop up
    if(entrance_1_visible) Entrance1_pop_up.style.display = 'block';
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

    //outlineVisible
    //If the outline is ON
    changeOutline(0);
    
    
    //Now the form disappers and the refresh button appears instaed
    document.querySelector('.refresh-button-container').style.display = 'block';
    //back and option container must not appear yet
    document.querySelector('.back-option-container').style.display = 'none';
    //Search bar has to disappear
    form.style.display = 'none';

    document.querySelector('.button-24').style.background = 'rgb(139, 0, 0)';
    document.querySelector('.button-24').style.color = 'rgba(255, 255, 255, 1)';
    

    //After pressing the submit button make the library to change it's opacity to 0.5 and for now all the GSAP will turn their scale to zero.
    let list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19','GSAP20','GSAP21'];

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
        //Library turn the opacity to 0.5
        if (child.isMesh && child.name == 'Cube041') {
            child.material.transparent = true;
            gsap.to(
                child.material,
                {
                    opacity : 0.5,
                    duration : 1,
                    onComplete : ()=>{
                        child.material.depthTest = true;
                        child.material.depthWrite = false;
                    }
                }
            )
        }
    });

    ID = bookID.value;

    //This function will make the neccessary GSAP depending on the ID entered Opaque, and will also make the bookshelf nearby to enter into the list bookshelf_nearby
    gsap_and_bookshelf(ID,list);

    //Now that interactive objects are filled we could could play the animation of all the GSAP
    

    //And then make the shelf and the corresponding GSAP red, and scaled up.
    makeShelfRed(ID);

    form.reset();
});

//Function to make the GSAP and nearby bookshelf opaque and transparent respectivelty
function gsap_and_bookshelf(id,list){

    //Depending on the ID update the list which will contian all the neccesary GSAP
    if(id >= 1 && id <= 62){
        //These are the list of all the neccesary GSAP that needs to be turned on or scaled up.
        if((id >= 21 && id <= 37) || (id >= 1 && id <= 12)) list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP15'];
        else if((id <= 20 && id >= 13) || (id <= 62 && id >= 38)) list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP15','GSAP18'];

        //These will be all the bookshelf that are near the search bookshelf into the bookshelf_nearby list.
        if(id>=1 && id<=20){
            for (let i = 1; i <= 20; i++) {
                const child = model.getObjectByName(String(i));

                if (child && child.isMesh && child.name!=id) {
                    bookshelfs_nearby.push(String(i));
                }
            }
        } else if(id>=21 && id<=30) {
            for (let i = 21; i <= 30; i++) {
                const child = model.getObjectByName(String(i));

                if (child && child.isMesh && child.name!=id) {
                    bookshelfs_nearby.push(String(i));
                }
            }
        } else if(id > 30 && id <= 62) {
            for (let i = 30; i <= 62; i++) {
                const child = model.getObjectByName(String(i));

                if (child && child.isMesh && child.name!=id) {
                    bookshelfs_nearby.push(String(i));
                }
            }
        }
    } else if(id == 63) {
        list = ['GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP1','GSAP3','GSAP13','GSAP20','GSAP21'];
    } else if(id == 64) {
        list = ['GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP1','GSAP3','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19']
    }

    //This will push the neccesary GSAP into interactive objects and will also scale them up.
    model.traverse((child)=>{
        //Push the neccesary GSAP into the intercative objects to make them intercative.
        if(list.includes(`${child.name}`)){
            gsap.to(
                    child.scale,
                    {
                        x : 1,
                        y : 1,
                        z : 1,
                        duration : 1
                    }
            );
            interactive_objects.push(child);
        }
    });
}

//Function to make the searched shelf Red
function makeShelfRed(id){
    //console.log(`You have searched for the bookshelf wiht id : ${id}`);

    //Now the bookshelf with name equal to this id must turn to red
    model.traverse((child)=>{
        if(child.name == `${id}`){
            child.material.opacity = 1;
            child.material.color.set(0xff0000); // red
        } else {

        }
    })
}

//----------------------Refresh-------------------------//
document.querySelector('.refresh').addEventListener('click',()=>{
    //console.log('You have clicked the Refresh button')
    window.location.reload();
})


//-----------------BACK BUTTON------------------//
document.querySelector(".back").addEventListener('click',()=>{
    //Change the phase of the app
    

    //After pressing the back button the opcaity of mesh must turn back to normal
    //console.log(ID);
    if(ID !== ""){
        //refresh button appears
        document.querySelector('.refresh-button-container').style.display = 'block';
        //back and option container must not appear yet
        document.querySelector('.back-option-container').style.display = 'none';
        if(model){
            model.traverse((child)=>{
                if(child.isMesh && child.name == 'Cube041' && child.name!==`${ID}`){
                    gsap.to(
                        child.material,
                        {
                            opacity : 0.5,
                            duration : 1,
                            onComplete  :()=>{
                                child.material.depthWrite = false;
                                child.material.depthTest = true;
                            }
                        }
                    )
                }

                //Make the bookshelfs near the target scaled up again
                if (child.isMesh && bookshelfs_nearby.includes(child.name)){
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
            });
        };
    }
    //If there is no book ID selected then make the make the search bar appear
    else{
        //console.log("You haven't entered any bookID");
        document.querySelector('.form').style.display = 'block';
    }
        
    //console.log('You have clicked the back button');
    //Make the back button disapper
    
    document.querySelector('.book').style.display = 'none';
    

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
    //Then make the other GSAP's Scale equal to one
    interactive_objects.forEach((child)=>{
        //console.log(child.name);
        gsap.to(
            child.scale,
            {
                x:1,
                y:1,
                z:1,
                duration:1
            }
        )
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

    //Kill the animation of all the GSAP icon
    interactive_objects.forEach((child)=>{
        gsap.killTweensOf(child.scale);
        child.scale.x = 1;
        child.scale.y = 1;
        child.scale.z = 1;
    })

    //Make the outline go away
    changeOutline(0);
});

//This function will display the back option
function displayBack(){
    //Make the Form Disapper
    document.querySelector('.form').style.display = 'none';
    //Disapper the refresh button
    document.querySelector('.refresh-button-container').style.display = 'none';
    //document.querySelector('.book').style.display = 'block';
    document.querySelector('.back-option-container').style.display = 'block';
    document.querySelector('.book').style.display = 'flex';
}

//----------------RAYCASTING----------------//
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let worldPos = new THREE.Vector3(); //To store the location of GSAP

document.addEventListener( 'click', onPointerMove );

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

            if(selectedObject /*&& selectedObject.name !== 'Cube003'*/ && !unclickables.includes(selectedObject.name)){
                //Remove gsap for the previous GSAP
                if(GSAP_Selected) {
                    previuosly_selected_GSAP = GSAP_Selected;
                    //console.log(`Previously Selected object is ${previuosly_selected_GSAP.name}`);
                }
                
            }
            
            
            
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
                if(ID >= 1 && ID <= 12){
                    animate_Selection(selectedObject,17,0.5,0);
                } else if(ID >= 12 && ID <= 20) {
                    animate_Selection(selectedObject,17,0,-0.5);
                    next_GSAP = 'GSAP18';
                } else if (ID >= 21 && ID <= 37) {
                    animate_Selection(selectedObject,17,-0.5,0);
                } else if (ID >= 37 && ID <= 62) {
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
                if(ID >= 12 && ID <= 20){
                    animate_Selection(selectedObject,16,0.5,0);
                    next_GSAP = null;
                } else if (ID > 37 && ID <=62) {
                    animate_Selection(selectedObject,16,-0.5,0);
                    next_GSAP = null;
                }   
            } else if(selectedObject.name == "GSAP19") {
                animate_Selection(selectedObject,16,0.5,0);
                next_GSAP = null;
            } else if(selectedObject.name == "GSAP20") {
                animate_Selection(selectedObject,16,-0.5,0);
                next_GSAP = 'GSAP21';
            } else if(selectedObject.name == "GSAP21") {
                animate_Selection(selectedObject,16,-0.1,0.1);
                next_GSAP = null;
            }

            //If the selected object is Bookshelf of the library
            if(Number(selectedObject.name) >=1 && Number(selectedObject.name) <= 62 && selectedObject.name == ID){
                //make the Bookshelf Bounce
                gsap.timeline()
                    .to(selectedObject.scale, {
                        x : 0.8,
                        y : 0.8,
                        z : 0.8,
                        duration: 0.15,
                        ease: "power3.in"
                    })
                    .to(selectedObject.scale, {
                        x : 1.3,
                        y : 1.3,
                        z : 1.3,
                        ease: "elastic.out(1,0.5)"
                    })
                    .to(selectedObject.scale, {
                        x : 1,
                        y : 1,
                        z : 1,
                        ease: "power2.out"
                    });
                //make the pop up appear for the target bookshelf.

                
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

//This function could be used to animate a particular GSAP.
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
//Entrance 4 (GSAP1)
document.querySelector('#Entrance_4-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP1');
    animate_Selection(selectedObject,18,-0.5,0);
    next_GSAP = 'GSAP9';
});
//Entrance 1 (GSAP5)
document.querySelector('#Entrance_1-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP5');
    animate_Selection(selectedObject,18,0.5,0);
    next_GSAP = 'GSAP6';
});
//Entrance 2 (GSAP2)
document.querySelector('#Entrance_2-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP4');
    animate_Selection(selectedObject,18,0.5,0);
    next_GSAP = 'GSAP8';
});
//Entrance 3
document.querySelector('#Entrance_3-pop-up').addEventListener('click',()=>{
    selectedObject = model.getObjectByName('GSAP3');
    animate_Selection(selectedObject,18,-0.5,0);
    next_GSAP = 'GSAP8';
});


//This will bring the camera to the selected GSAP
function animate_Selection(selected_object,camera_height,camera_orientation_y,camera_orientation_x){

    //Also when selected a GSPA location, all the mesh except for the bookshelf nearby must turn opaque
    if(model){
        model.traverse((child)=>{
            if(child.isMesh && child.name == 'Cube041'){
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

            //Make the bookshelf that are near the searched bookshelf scaled to zero 
            if (child.isMesh && bookshelfs_nearby.includes(child.name)){
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
    };
    

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
                // Chnage the outline
                if(outlineVisible){
                    //Also make the outline come back
                    changeOutline(1);
                } else changeOutline(0);
                
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
            if((ID >= 38 && ID <= 62) || (ID >= 13 && ID <= 20)){
                list = ['GSAP13', 'GSAP11', 'GSAP12', 'GSAP14' , 'GSAP15', 'GSAP18'];
            } else if ((ID >= 21 && ID <= 37) || (ID >= 1 && ID <= 12)) {
                list = ['GSAP13', 'GSAP11', 'GSAP12', 'GSAP14' , 'GSAP15'];
            } else if (ID == 63) {
                list = ['GSAP13','GSAP20','GSAP21']; 
            } else if(ID == 64) {
                list = ['GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19'];
            }
            let i=0
            for(;i<list.length;i++){
                if(GSAP.name == list[i]) break;
            }
            percentage = (200/9) + ((i+1)/(list.length))*(700/9);
        }
    }
    return percentage;
}
//--------------------------------------//

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFFCDB2 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    const canvas = renderer.domElement;

    

    //---------Event listeners--------//

    canvas.addEventListener('pointerdown', function onFirstClick() {
        // console.log('First click was made');
        // rotation_increment = 0;
        canvas.removeEventListener('pointerdown', onFirstClick);
    });

    

    //---------------------------------//
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 551.5, 318.043, 348.3 );

    

    // controls

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    //controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    //controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    //To disable the pan motion
    controls.enablePan = false;

    controls.minDistance = 0;
    controls.maxDistance = 900;

    controls.maxPolarAngle = Math.PI / 2;

    
    // world
    loader.load( 'Mesh.glb', function ( gltf ) {
        model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                meshesByName[child.name] = child;
                child.material.transparent = true;
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

        //Add the Cartoonish outline to the model
        //cartoonify_Model(model);

        // //Interactive objects
        // gltf.scene.traverse((obj)=>{
        //     //console.log(obj.name);
        //     if(obj.name == "GSAP1" || 
        //         obj.name == "GSAP3" || 
        //         obj.name == "GSAP4" || 
        //         obj.name == "GSAP5" || 
        //         obj.name == "GSAP6" || 
        //         obj.name == "GSAP8" ||
        //         obj.name == "GSAP9" ||
        //         obj.name == "GSAP11" ||
        //         obj.name == "GSAP12" ||
        //         obj.name == "GSAP13" ||
        //         obj.name == "GSAP14" ||
        //         obj.name == "GSAP15" ||
        //         obj.name == "GSAP16" ||
        //         obj.name == "GSAP17" ||
        //         obj.name == "GSAP18"){
        //         interactive_objects.push(obj);
        //     }
        // });
      
            

        //Mesh to be instanced
        const cycleMesh = gltf.scene.getObjectByName('Cycle');
        const CycleStandMesh = gltf.scene.getObjectByName('Cycle_Stand');
        const AirConditioner_mesh = gltf.scene.getObjectByName('Air_Conditioner_Instance');
        const first_floor_instance = gltf.scene.getObjectByName('First_Floor_Table_Instance');
        const Ground_Floor_Table = gltf.scene.getObjectByName('Ground_Floor_Table_Instance');
        //const Direction_mesh = gltf.scene.getObjectByName('Direction_instance');

        if (!cycleMesh) {console.error('Mesh named "cycle" not found');return;}

        //Instancing
        createInstances(cycleMesh.geometry, cycleMesh.material,loadCycleTransforms);//Cycle Instance
        createInstances(CycleStandMesh.geometry,CycleStandMesh.material,loadCycleStandTransforms);//Cycle Stand Instance
        createInstances(AirConditioner_mesh.geometry,AirConditioner_mesh.material,loadAirConditionTransforms);//Air Conditioner Instance
        createInstances(first_floor_instance.geometry,first_floor_instance.material,loadFirstFloorTablesTransform)//First floor tables
        createInstances(Ground_Floor_Table.geometry,Ground_Floor_Table.material,loadGroundFloorTablesTransform);
        

    }, undefined, function ( error ) {

    console.error( error );

    } );  

    // lights

    const color = 0xFFFFFF;
    const skyColor = 0xF1F0E4;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
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
            model.getObjectByName('Cube041') , 
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
    }  
    //if(mesh) {console.log(`Changed ${mesh.name} outline visibilty to ${visiblity}`);};
    
}



//-------------------Geometry Instancing----------------------//
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

async function createInstances(geometry, material,loadTransforms) {
  const data = await loadTransforms();

  const count = data.length;

  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    material,
    count
  );

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
    if(entrance_frustum){animateEntrancePopup();}
    

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
