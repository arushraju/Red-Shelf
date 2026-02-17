//-------------IMPORTS---------------//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';


let camera, controls, scene, renderer;

//Make the back button disappear
document.querySelector('.book').style.display = 'none';

//-------------------LOADING PAGE----------------------//
const loadingManager = new THREE.LoadingManager();
const loading_page = document.querySelector('.loading-page-container');

//For the frustum
const popup_name = ["Stationary_Shop", "Seminar_Room" , "Reception" , "Description_4"];
const popup_objects = [];
//This will contian only the required pop ups.
let popup_board = [];

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
    else {
        Frustum = false;
        stationary_pop_up.style.display = 'none';
        seminar_pop_up.style.display = 'none';
        reception_pop_up.style.display = 'none';
    }
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

//------------------RAY CASTING-------------------//

let selectedObject = null;
let GSAP_Selected = null;


//------------------FORM SUBMIT---------------------//
const form = document.querySelector('#searchForm');
const bookID = document.querySelector('#fname'); //This will store the ID of the book
let ID = bookID.value;

form.addEventListener('submit',function (e){
    e.preventDefault();
    


    //Now the form disappers and the refresh button appears instaed
    document.querySelector('.refresh-button-container').style.display = 'block';
    //back and option container must not appear yet
    document.querySelector('.back-option-container').style.display = 'none';
    //Search bar has to disappear
    form.style.display = 'none';

    document.querySelector('.button-24').style.background = 'rgb(139, 0, 0)';
    document.querySelector('.button-24').style.color = 'rgba(255, 255, 255, 1)';
    

    //After pressing the submit button make the library to change it's opacity to 0.5 and for now all the GSAP will turn their scale to zero.
    let list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP19'];

    model.traverse((child) => {
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

    //And then make the shelf and the corresponding GSAP red, and scaled up.
    makeShelfRed(ID);

    form.reset();
});

//Function to make the GSAP and nearby bookshelf opaque and transparent respectivelty
function gsap_and_bookshelf(id,list){
    if(id >= 1 && id <= 62){
        //These are the list of all the neccesary GSAP that needs to be turned on or scaled up.
        list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP15','GSAP18'];

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

                //Make the bookshelfs near the target also opaque
                if (child.isMesh && bookshelfs_nearby.includes(child.name)){
                    //console.log(`Bookshelf with ID ${child.name} will be turned transparent`);
                    child.material.transparent = true;
                
                    gsap.to(
                        child.material,
                        {
                            opacity : 1,
                            duration : 1,
                            onComplete : ()=>{
                                child.material.depthTest = true;
                                child.material.depthWrite = false;
                            }
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
    //console.log('The back button has to appear');
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
            selectedObject = res.object;
            if(selectedObject && selectedObject.name !== 'Cube041'){
                GSAP_Selected = selectedObject;
            }
            
            
            //now that if the clicked object is GASP1
            if(selectedObject.name == "GSAP1"){
                //console.log("Do what you want to with GSAP1");
                animate_Selection(selectedObject,18,-0.5,0);
            } else if(selectedObject.name == "GSAP3") {
                //console.log("Do what you want to with GSAP3");
                animate_Selection(selectedObject,18,-0.5,0);
            } else if(selectedObject.name == "GSAP4") {
                //console.log("Do what you want to with GSAP4");
                animate_Selection(selectedObject,18,0.5,0);
            } else if(selectedObject.name == "GSAP5") {
                //console.log("Do what you want to with GSAP5");
                animate_Selection(selectedObject,18,0.5,0);
            } else if(selectedObject.name == "GSAP6") {
                //console.log("Do what you want to with GSAP6");
                animate_Selection(selectedObject,18,0.5,0);
            } else if(selectedObject.name == "GSAP8") {
                //console.log("Do what you want to with GSAP8");
                animate_Selection(selectedObject,18,0,+0.5);
            } else if(selectedObject.name == "GSAP9") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,15,0,0.5);
            } else if(selectedObject.name == "GSAP11") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,16,0,-0.5);
            } else if(selectedObject.name == "GSAP12") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,16,0.5,0);
            } else if(selectedObject.name == "GSAP13") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,16,-1,0);
            } else if(selectedObject.name == "GSAP14") {
                //console.log("Do what you want to with GSAP9");
                if(ID >= 1 && ID <= 62){
                    animate_Selection(selectedObject,16,0,-0.5);
                } else if(ID){
                    animate_Selection(selectedObject,16,0,0.5);
                }
                
            } else if(selectedObject.name == "GSAP15") {
                //console.log("Do what you want to with GSAP9");
                if(ID >= 1 && ID <= 20){
                    animate_Selection(selectedObject,17,0.5,0);
                } else if (ID > 20 && ID <=62){
                    animate_Selection(selectedObject,17,-0.5,0);
                }
                
            } else if(selectedObject.name == "GSAP16") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,16,1,0);
            } else if(selectedObject.name == "GSAP17") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,16,1,0);
            } else if(selectedObject.name == "GSAP18") {
                //console.log("Do what you want to with GSAP9");
                if(ID >= 1 && ID <= 20){
                    animate_Selection(selectedObject,16,0.5,0);
                } else if (ID > 20 && ID <=62) {
                    animate_Selection(selectedObject,16,-0.5,0);
                }
                
            } else if(selectedObject.name == "GSAP19") {
                //console.log("Do what you want to with GSAP9");
                if(ID >= 1 && ID <= 20){
                    animate_Selection(selectedObject,16,-0.5,0);
                } else if (ID > 20 && ID <=62) {
                    animate_Selection(selectedObject,16,0.5,0);
                }
                
            }
        }
    }
}

//---- FRUSTUM-----//
const frustum = new THREE.Frustum();

const pop_up_content = {
    "Stationary_Shop" : {
        name : "<h1>Stationary Shop</h1>",
        content  :"<p>Can find the stationary accessories in here</p>",
        link : '<a href="tel:+1234567890">Phone Number : 1234567890</a>',
    },
    "Seminar_Room" : {
        name : "<h1>Seminar Room<h1>",
        content : "<p>Could be used for so and so<p>",
        link : '<a href="mailto:seminar@iitk.ac.in">Email : seminar@iitk.ac.in</a>'
    },
    "Reception" : {
        name : "<h1>Reception</h1>",
        content : "<p>Could be used for issueing the book",
        link : "<a href='mailto:lib@iitk.ac.in'>Emial : lib@iitk.ac.in</a>"
    },
    "Description_4" : {
        name : "<h1>Electronic Book Issue</h1>",
        content : "<p>Could be used to issue the book</p>",
        link : "<a href='mailto:book@iitk.ac.in'>Email : book@iitk.ac.in</a>"
    }
}

function makePopup(key,element){
    element.querySelector('.heading').innerHTML = pop_up_content[key].name;
    element.querySelector('.content').innerHTML = pop_up_content[key].content;
    element.querySelector('.details').innerHTML = pop_up_content[key].link;
}

//This will prepare the content inside the pop ups.
const stationary_pop_up = document.querySelector('#stationary-pop-up');
const seminar_pop_up = document.querySelector('#seminar-pop-up');
const reception_pop_up = document.querySelector('#reception-pop-up');
//const table_pop_up = document.querySelector('#table-pop-up');
makePopup("Stationary_Shop",stationary_pop_up);
makePopup("Seminar_Room",seminar_pop_up);
makePopup("Reception",reception_pop_up);
//makePopup("Description_4");


//This function will update the cordinate of the pop up
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
    let table_pop_up_visible = false;

    // Loop through all popup objects
    popup_objects.forEach(obj => {
        const position = new THREE.Vector3();
        obj.getWorldPosition(position); // get object's 3D world position

        if (frustum.containsPoint(position)) {
            
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
                //else reception_room_visible = false;
            }
        }
    });


    if(stationary_shop_visible) stationary_pop_up.style.display = 'block';
    else stationary_pop_up.style.display = 'none';
    if(seminar_room_visible) seminar_pop_up.style.display = 'block';
    else seminar_pop_up.style.display = 'none';
    if(reception_room_visible) reception_pop_up.style.display = 'block';
    else reception_pop_up.style.display = 'none';

    
}


//-----------------SELECTION ANIMATION-----------------------//
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

            //Make the bookshelf that are near the searched bookshelf to be transparent. Also make the bookshlef that is near the 
            if (child.isMesh && bookshelfs_nearby.includes(child.name)){
                //console.log(`Bookshelf with ID ${child.name} will be turned transparent`);
                child.material.transparent = true;
            
                gsap.to(
                    child.material,
                    {
                        opacity : 0,
                        duration : 1,
                        onComplete : ()=>{
                            child.material.depthTest = true;
                            child.material.depthWrite = false;
                        }
                    }
                )
            }  
        });
    };

    selected_object.getWorldPosition(worldPos);
    //console.log(`World Position = (${worldPos.x}, ${worldPos.y}, ${worldPos.z})`);
    //Make the camera go there
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
            }
        }, 
    );

    gsap.to(
        controls,
        {
            maxDistance : camera_height,
            minDistance: camera_height,
            duration : 1.1
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

    gsap.to(
        selected_object.scale,
        {
            x:0,
            y:0,
            z:0,
            duration : 1
        }
    )

    //Then make the selective GSAP scale equal to zero.
    interactive_objects.forEach((child)=>{ 
        if(child.name!==selectedObject.name){
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
        }
    });

    //Update the height of the percentage bar
    let updated_height = updatePercentageBar(GSAP_Selected,ID);

    //And then the percentage bar coul;d be animated
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
    //console.log(`ID = ${ID} | GSAP = ${GSAP.name}`);
    //If the ID is between 1 to 62
    if(ID < 62 && ID > 1){
        let list = ['GSAP13', 'GSAP11', 'GSAP12', 'GSAP14' , 'GSAP15', 'GSAP18'];
        if(GSAP.name == 'GSAP5' || GSAP.name == 'GSAP4' || GSAP.name == 'GSAP3' || GSAP.name == 'GSAP1'){
           return 1;
        } else {
            if(GSAP.name == 'GSAP6' || GSAP.name == 'GSAP8'){return (100/9);}
            else if(GSAP.name == 'GSAP9'){return (200/9);}
            else{
                let i=0
                for(;i<list.length;i++){
                    if(GSAP.name == list[i]) break;
                }
                return (200/(list.length + 2)) + ((i+1)/(list.length + 2))*100;
            }
        }
    }

    return 
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
        let list = ['GSAP1','GSAP3','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP18'];
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
        if (!cycleMesh) {console.error('Mesh named "cycle" not found');return;}

        //Instancing
        createInstances(cycleMesh.geometry, cycleMesh.material,loadCycleTransforms);//Cycle Instance
        createInstances(CycleStandMesh.geometry,CycleStandMesh.material,loadCycleStandTransforms);//Cycle Stand Instance
        createInstances(AirConditioner_mesh.geometry,AirConditioner_mesh.material,loadAirConditionTransforms);//Air Conditioner Instance
        

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

    //console.log(popup_objects[0]);

    //console.log(camera.position);
    //console.log(camera.rotation);
    controls.update();

    //Rotate the camera


    //Frustum Display
    if(Frustum){animatePopUp();}
    //Geolocation
    if(geolocation){geolocationTracker();}

    //console.log(popup_objects);

    render();

}

function render() {

    renderer.render( scene, camera );

}
