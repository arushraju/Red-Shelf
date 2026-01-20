
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';


let camera, controls, scene, renderer;

init();
//render(); // remove when using animation loop




function init() {

    

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFFCDB2 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 551.5, 318.043, 348.3 );

    camera_animate();

    // controls

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.enablePan = false;

    controls.minDistance = 100;
    controls.maxDistance = 900;

    controls.maxPolarAngle = Math.PI / 2;

    // world

    const loader = new GLTFLoader();

    loader.load( './Mesh.glb', function ( gltf ) {

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
//FORM DATA
const book_id = new FormData('fname');
console.log(book_id);

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
            ease: "none"
        },
    );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    //console.log(camera.position)
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

}

function render() {

    renderer.render( scene, camera );

}
