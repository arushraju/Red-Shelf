
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';


let camera, controls, scene, renderer;

//Make the back button disappear
document.querySelector('.book').style.display = 'none';

init();

let model = null;
const meshesByName = {};
const axis = new THREE.Vector3(0, 1, 0);
let rotation_increment = -0.01;

//-------------Ray Casting--------------//

let selectedObject = null;
let previuosly_selected_object = null;

//This function will display the back option
function displayBack(){
    //Make the Form Disapper
    document.querySelector('.form').style.display = 'none';
    document.querySelector('.book').style.display = 'block';
}

//On clicking BACK button
document.querySelector(".back").addEventListener('click',()=>{
    console.log('You have clicked the back button');
    //Make the back button disapper
    document.querySelector('.form').style.display = 'block';
    document.querySelector('.book').style.display = 'none';
    
    if(previuosly_selected_object && selectedObject){
        console.log(`And the name of previuosly selected object is ${previuosly_selected_object.name}`);
        console.log(`And the name of selcted object is ${selectedObject.name}`);
    }
    

    //Reset the Controls
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
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

    //Reset size of all the meshes
    Object.values(meshesByName).forEach(mesh => {
        if (mesh.name === "Cube041") return;
        gsap.to(mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1
        });
    });

    previuosly_selected_object = null;
    selectedObject = null;
    first_time = true;
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let worldPos = new THREE.Vector3(); //To store the location of GSAP
let first_time = true;

//Now is the time to make the raycasting work
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

            

            if(res.object.name != "Cube041")
            {
                if(selectedObject && previuosly_selected_object){
                    console.log(`Selected Object is ${selectedObject.name}`);
                    console.log(`Previously Selected Object is ${previuosly_selected_object.name}`);
                }
                
                selectedObject = res.object;

                if(first_time){
                    previuosly_selected_object = selectedObject;
                    first_time = false;
                }

                if(previuosly_selected_object && previuosly_selected_object!=selectedObject){
                    gsap.to(
                        previuosly_selected_object.scale,
                        {
                            x:1,
                            y:1,
                            z:1,
                            duration : 1,
                            onComplete: ()=>{
                                previuosly_selected_object = selectedObject;
                                selectedObject = null;
                            }
                        }

                    );
                }
                if(selectedObject && previuosly_selected_object){
                    console.log(`Selected Object : ${selectedObject.name}`);
                    console.log(`Previously Selected Object : ${previuosly_selected_object.name}`);
                }
                

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
                }
                
            }
                
        }

    }

}

function animate_Selection(selected_object,camera_height,camera_orientation_y,camera_orientation_x){
    selected_object.getWorldPosition(worldPos);
    console.log(`World Position = (${worldPos.x}, ${worldPos.y}, ${worldPos.z})`);
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

    if(previuosly_selected_object && previuosly_selected_object != selectedObject){
        gsap.to(
            previuosly_selected_object.scale,
            {
                x:1,
                y:1,
                z:1,
                duration : 1,
            }

        );
    }
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
        console.log('First click was made');
        rotation_increment = 0;
        canvas.removeEventListener('pointerdown', onFirstClick);
    });

    document.addEventListener( 'click', onPointerMove );

    //---------------------------------//
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 551.5, 318.043, 348.3 );

    

    // controls

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    //To disable the pan motion
    controls.enablePan = false;

    controls.minDistance = 0;
    controls.maxDistance = 900;

    controls.maxPolarAngle = Math.PI / 2;

    camera_animate();
    // world

    const loader = new GLTFLoader();
    

    loader.load( './Mesh.glb', function ( gltf ) {
        model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                meshesByName[child.name] = child;
            }
        });
        scene.add( gltf.scene );

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

//Starting animation
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

    if(selectedObject && previuosly_selected_object){
        console.log(`Selected : ${selectedObject.name} | Previous_selection = ${previuosly_selected_object.name}`);
    }
    //console.log(camera.position);
    //console.log(camera.rotation);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    if(model){
        model.rotateOnAxis(axis,rotation_increment);
    }
  
    render();

}

function render() {

    renderer.render( scene, camera );

}
