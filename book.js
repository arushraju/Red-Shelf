import * as THREE from 'three';
//import { loadingManager } from './script_test.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let perspectiveCamera, controls, scene, renderer;

const params = {
    orthographicCamera: false
};

const frustumSize = 400;

const loadingManager = new THREE.LoadingManager();

//Loading the Shelf
const loader = new GLTFLoader(loadingManager);

let bookshelf_A_obj = null;
let bookshelf_B_obj = null;
let bookshelf_A_range_obj = null;
let bookshelf_B_range_obj = null;

let bookshelf_A1_obj = null;
let bookshelf_A2_obj = null;
let bookshelf_A3_obj = null;
let bookshelf_A4_obj = null;
let bookshelf_A5_obj = null;
let bookshelf_A6_obj = null;
let bookshelf_A7_obj = null;

let bookshelf_B1_obj = null;
let bookshelf_B2_obj = null;
let bookshelf_B3_obj = null;
let bookshelf_B4_obj = null;
let bookshelf_B5_obj = null;
let bookshelf_B6_obj = null;
let bookshelf_B7_obj = null;

//This array will store the bookshelf images
const bookshelf_texture = [];

export async function book_init() {

    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera = new THREE.PerspectiveCamera( 60, aspect, 1, 1000 );
    perspectiveCamera.position.z = 10;
    perspectiveCamera.position.x = -10;
    perspectiveCamera.position.y = 10;

    // world

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFFBDBD );

    
    await loader.load( './shelf.glb', async (gltf) => {

        //These are the objects that neds to be updated depending on the bookshelf selected.
        bookshelf_A_obj = gltf.scene.getObjectByName("Shelf_Number_A");
        bookshelf_B_obj = gltf.scene.getObjectByName("Shelf_Number_B");
        bookshelf_A_range_obj = gltf.scene.getObjectByName("A_Range");
        bookshelf_B_range_obj = gltf.scene.getObjectByName("B_Range");

        bookshelf_A1_obj = gltf.scene.getObjectByName("A1");
        bookshelf_A2_obj = gltf.scene.getObjectByName("A2");
        bookshelf_A3_obj = gltf.scene.getObjectByName("A3");
        bookshelf_A4_obj = gltf.scene.getObjectByName("A4");
        bookshelf_A5_obj = gltf.scene.getObjectByName("A5");
        bookshelf_A6_obj = gltf.scene.getObjectByName("A6");
        bookshelf_A7_obj = gltf.scene.getObjectByName("A7");

        bookshelf_B1_obj = gltf.scene.getObjectByName("B1");
        bookshelf_B2_obj = gltf.scene.getObjectByName("B2");
        bookshelf_B3_obj = gltf.scene.getObjectByName("B3");
        bookshelf_B4_obj = gltf.scene.getObjectByName("B4");
        bookshelf_B5_obj = gltf.scene.getObjectByName("B5");
        bookshelf_B6_obj = gltf.scene.getObjectByName("B6");
        bookshelf_B7_obj = gltf.scene.getObjectByName("B7");



        scene.add(gltf.scene);

        //And then load the images for the bookshelf
        for(let i = 1; i <= 54; i++){
            await loadTexture(i);
        }

        //And then add this to the objects
        ///await shownBookshelf("A",2);

    });

    // lights

    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0x002288, 3 );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0x555555 , 10);
    
    scene.add( ambientLight );

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );

    //Append the render inside the helper pop up
    const book_model = document.querySelector('.bookshelf-model');
    const search_book = document.querySelector('.bookshelf-search');
    const canvas = renderer.domElement;

    //This is to set the size of the canvas
    const rect = book_model.getBoundingClientRect();
    console.log(rect.width);
    console.log(rect.height);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    //Now we will set the position of the canvas at the div
    canvas.style.top = `${rect.top}px`;
    canvas.style.left = `${rect.left}px`;

    // Adding Borders
    canvas.style.border = '1px solid black';

    canvas.classList.add("book-search-canvas");

    book_model.appendChild( canvas );

    window.addEventListener( 'resize', ()=>{onWindowResize(book_model)} );

    createControls( perspectiveCamera );

    //And then hide the bookshelf model
    book_model.style.display = 'none';
    //And also hide the search menu
    search_book.style.display = 'none'; 
}

const textureLoader = new THREE.TextureLoader(loadingManager);

async function loadTexture(bookshelf_number) {

    let A_image = textureLoader.load(
        `./Bookshelf_Labelling/Side/${bookshelf_number}a.png`
    );

    let B_image = null;
    if(bookshelf_number <= 53){
        B_image = textureLoader.load(
            `./Bookshelf_Labelling/Side/${bookshelf_number}b.png`
        );
    }
    

    let A_range_image = textureLoader.load(
        `./Bookshelf_Labelling/Range/${bookshelf_number}a_range.png`
    );

    let B_range_image = null;
    if(bookshelf_number <= 53){
        B_range_image = textureLoader.load(
            `./Bookshelf_Labelling/Range/${bookshelf_number}b_range.png`
        );
    }
    

    A_image.center.set(0.5, 0.5);
    A_image.rotation = Math.PI;

    A_range_image.center.set(0.5, 0.5);
    A_range_image.rotation = Math.PI;

    if(B_image && B_range_image){
        B_image.center.set(0.5, 0.5);
        B_image.rotation = Math.PI;

        B_range_image.center.set(0.5, 0.5);
        B_range_image.rotation = Math.PI;
    }
    

    let texture = {
        number: bookshelf_number,

        A_image : A_image,
        B_image : B_image,
        A_range_image : A_range_image,
        B_range_image : B_range_image,
    };

    bookshelf_texture.push(texture);
}

/**
 * This functino will take shelf side and the bookshelf number and will make it visible for the 
 * @param {CharacterData} shelf_side - Side of the bookshelf could be A or B
 * @param {Number} bookshelf_number - This is the number of the bookshelf
 */
export async function shownBookshelf(shelf_side, bookshelf_number){
    const book_model = document.querySelector('.bookshelf-model');
    const search_book = document.querySelector('.bookshelf-search');

    book_model.style.display = 'none';
    search_book.style.display = 'none';

    //Make the bookshelf white in color
    const white = 0xffffff;
    bookshelf_A1_obj.material.color.set( white );
    bookshelf_A2_obj.material.color.set( white );
    bookshelf_A3_obj.material.color.set( white );
    bookshelf_A4_obj.material.color.set( white );
    bookshelf_A5_obj.material.color.set( white );
    bookshelf_A6_obj.material.color.set( white );
    bookshelf_A7_obj.material.color.set( white );
    bookshelf_B1_obj.material.color.set( white );
    bookshelf_B2_obj.material.color.set( white );
    bookshelf_B3_obj.material.color.set( white );
    bookshelf_B4_obj.material.color.set( white );
    bookshelf_B5_obj.material.color.set( white );
    bookshelf_B6_obj.material.color.set( white );
    bookshelf_B7_obj.material.color.set( white );

    //First prepare the images of the bookshelf
    bookshelf_A_obj.material.map = bookshelf_texture[bookshelf_number-1].A_image;
    bookshelf_A_obj.material.needsUpdate = true;
    
    bookshelf_B_obj.material.map = bookshelf_texture[bookshelf_number-1].B_image;
    bookshelf_B_obj.material.needsUpdate = true;
    
    bookshelf_A_range_obj.material.map = bookshelf_texture[bookshelf_number-1].A_range_image;
    bookshelf_A_range_obj.material.needsUpdate = true;
    
    bookshelf_B_range_obj.material.map = bookshelf_texture[bookshelf_number-1].B_range_image;
    bookshelf_B_range_obj.material.needsUpdate = true;

    //If the call number is present then dont show the search bar
    const red = 0xFF0000;
    if(shelf_side){
        switch (shelf_side) {
            case "A":
                bookshelf_A1_obj.material.color.set( red );
                bookshelf_A2_obj.material.color.set( red );
                bookshelf_A3_obj.material.color.set( red );
                bookshelf_A4_obj.material.color.set( red );
                bookshelf_A5_obj.material.color.set( red );
                bookshelf_A6_obj.material.color.set( red );
                bookshelf_A7_obj.material.color.set( red );
                break;
            case "B":
                bookshelf_B1_obj.material.color.set( red );
                bookshelf_B2_obj.material.color.set( red );
                bookshelf_B3_obj.material.color.set( red );
                bookshelf_B4_obj.material.color.set( red );
                bookshelf_B5_obj.material.color.set( red );
                bookshelf_B6_obj.material.color.set( red );
                bookshelf_B7_obj.material.color.set( red );
                break;
        }
    } else {
        //Make the Search Bar and the bookshelf appear without chnage in the color
        //For now I am setting it to none
        search_book.style.display = 'none';
    }

    
    book_model.style.display = 'block';

    // //Append the render inside the helper pop up
    
}

function createControls( camera ) {

    controls = new TrackballControls( camera, renderer.domElement );

    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1;
    controls.noPan = true;
    
    controls.maxDistance = 20;
    controls.minDistance = 8;

    controls.keys = [ 'KeyA', 'KeyS', 'KeyD' ];

}

function onWindowResize(book_model) {

    const aspect =
        book_model.clientWidth /
        book_model.clientHeight;
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    renderer.setSize(
    book_model.clientWidth,
    book_model.clientHeight
);

    controls.handleResize();

}

function animate() {

    controls.update();

    render();

}

function render() {

    const camera = ( params.orthographicCamera ) ? orthographicCamera : perspectiveCamera;

    renderer.render( scene, camera );

}