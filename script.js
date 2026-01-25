
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';


let camera, controls, scene, renderer;

//Make the back button disappear
document.querySelector('.book').style.display = 'none';



let model = null;
const meshesByName = {};
const interactive_objects = [];
const bookshelfs_nearby = [];

document.querySelector('.refresh-button-container').style.display = 'none';

//-------------Ray Casting--------------//

let selectedObject = null;

//This function will display the back option
function displayBack(){
    //Make the Form Disapper
    document.querySelector('.form').style.display = 'none';
    //Disapper the refresh button
    document.querySelector('.refresh-button-container').style.display = 'none';
    document.querySelector('.book').style.display = 'block';
}

//------FORM SUBMIT--------//
const form = document.querySelector('#searchForm');
const bookID = document.querySelector('#fname'); //This will store the ID of the book
let ID = bookID.value;

form.addEventListener('submit',function (e){
    e.preventDefault();
    


    //Now the form disappers and the refresh button appears instaed
    document.querySelector('.refresh-button-container').style.display = 'block';
    form.style.display = 'none';

    document.querySelector('.button-24').style.background = 'rgb(139, 0, 0)';
    document.querySelector('.button-24').style.color = 'rgba(255, 255, 255, 1)';
    

    //After pressing the submit button make the library to change it's opacity to 0.5.
    let list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP17','GSAP18']
    model.traverse((child) => {
        if(list.includes(child.name)){
            child.scale.x = 0;
            child.scale.y = 0;
            child.scale.z = 0;
        }
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

    //Depending on the ID I will include only those elements in interactive obejcts that are necessary
    if(ID >= 1 && ID <= 36){
        list = ['GSAP3','GSAP1','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSAP13','GSAP11','GSAP12','GSAP14'];
        model.traverse((child)=>{
            if(list.includes(`${child.name}`)){
                gsap.to(
                    child.scale,
                    {
                        x : 1,
                        y : 1,
                        z : 1,
                        duration : 1
                    }
                )
                interactive_objects.push(child);
            }
        });
        for (let i = 1; i <= 36; i++) {
            const child = model.getObjectByName(String(i));

            if (child && child.isMesh && child.name!=ID) {
                bookshelfs_nearby.push(String(i));
            }
        }
    }
        
    

    //And then make the shelf and the corresponding GSAP red, and scaled up.
    makeShelfRed(ID);

    form.reset();
});

//Function to make the shelf Red
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

//-------Refresh---------//
document.querySelector('.refresh').addEventListener('click',()=>{
    //console.log('You have clicked the Refresh button')
    window.location.reload();
})



//-------BACK BUTTON------//
document.querySelector(".back").addEventListener('click',()=>{
    //After pressing the back button the opcaity of mesh must turn back to normal
    //console.log(ID);
    if(ID !== ""){
        //And then make the refresh button appear
        document.querySelector('.refresh-button-container').style.display = 'block';
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
});

//------------RAYCASTING------------//
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
            
            //now that if the clicked object is GASP1
            if(selectedObject.name == "GSAP1"){
                //console.log("Do what you want to with GSAP1");
                animate_Selection(selectedObject,18,-0.5,1);
            } else if(selectedObject.name == "GSAP3") {
                //console.log("Do what you want to with GSAP3");
                animate_Selection(selectedObject,18,1,1);
            } else if(selectedObject.name == "GSAP4") {
                //console.log("Do what you want to with GSAP4");
                animate_Selection(selectedObject,18,0,-1.5);
            } else if(selectedObject.name == "GSAP5") {
                //console.log("Do what you want to with GSAP5");
                animate_Selection(selectedObject,18,0,-1.5);
            } else if(selectedObject.name == "GSAP6") {
                //console.log("Do what you want to with GSAP6");
                animate_Selection(selectedObject,20,-1,0);
            } else if(selectedObject.name == "GSAP8") {
                //console.log("Do what you want to with GSAP8");
                animate_Selection(selectedObject,18,+0.5,0);
            } else if(selectedObject.name == "GSAP9") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP11") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,0.1,0);
            } else if(selectedObject.name == "GSAP12") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP13") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP14") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP15") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP16") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP17") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            } else if(selectedObject.name == "GSAP18") {
                //console.log("Do what you want to with GSAP9");
                animate_Selection(selectedObject,12,1,0);
            }
        }
    }
}

//--------SELECTION ANIMATION-----------//
function animate_Selection(selected_object,camera_height,camera_orientation_y,camera_orientation_x){

    //Also when selected a GSPA location, all the mesh excpet fo the bookshelf nearby must turn opaque
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
                //And also 
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

    const loader = new GLTFLoader();
    

    loader.load( 'Mesh.glb', function ( gltf ) {
        model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                meshesByName[child.name] = child;
                child.material.transparent = true;
            }
        });

        //Also make all the gsap turn the scale down
        let list = ['GSAP1','GSAP3','GSAP4','GSAP5','GSAP6','GSAP8','GSAP9','GSA13','GSAP11','GSAP12','GSAP14','GSAP16','GSAP18'];
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

    camera_animate();

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

//--------------Geometry Instancing-----------------//
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
    //console.log(camera.rotation);
    controls.update();

    //Rotate the camera


    render();

}

function render() {

    renderer.render( scene, camera );

}
