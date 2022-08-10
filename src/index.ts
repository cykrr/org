import {Scene, WebGLRenderer, Color} from 'three'
import {OrthographicCamera, PerspectiveCamera} from 'three'
import {Clock} from 'three'
//import {BoxGeometry} from 'three'

import {CircleGeometry, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters} from 'three'

import {Vector3} from 'three'
import {DoubleSide, FrontSide, BackSide} from 'three'
//

import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

import {Object3D} from 'three'
import {BufferGeometry, BufferAttribute, BoxGeometry} from 'three'


/* Scene camera renderer */

let scene = new Scene();

let renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);


const camera = new OrthographicCamera(0, window.innerWidth,
                     0, window.innerHeight,
                     -1, 1);

/* Constants */
const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;
const radius = 50;

var geometry = new CircleGeometry(radius, 36);

const material = new MeshBasicMaterial( { color: 0x303030 } );
material.side = DoubleSide;

class Bubble {
    text: string = "Label";
    mesh: Mesh = null
    childs: Bubble[]|null = null;

    constructor (x: number = cx, y: number = cy) {
        const mesh = new Mesh( geometry, material );

        const div: HTMLDivElement = document.createElement("div");
        div.className = "label";

        div.innerText = this.text;

        div.contentEditable = "true";
        const label = new CSS2DObject(div);
        mesh.add(label);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        this.mesh = mesh;
    }

};

let root: Bubble[]|null = [];
var selection: Bubble = null;

renderer.setClearColor(new Color (0x20/0xff, 0x20/0xff, 0x20/0xff));
function animate()
{
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();
 
var mouse: Vector3 = new Vector3();
var mouse_offset: Vector3 = new Vector3();

function inputDown(x: number, y: number)
{
    mouse.set(x, y, 0);

    for (var i = 0; i < root.length; i++)
    {
        if (root[i].mesh.position.distanceTo(mouse) <= radius)
        {
            selection = root[i];
            mouse_offset.copy(mouse).sub(selection.mesh.position)
            break;
        }
        selection = null;
    }

    if (selection)
    {
        console.log("selection")
        document.onmousemove = (me: MouseEvent) => {
            inputMove(me.clientX, me.clientY);
        }
        document.ontouchmove = (te: TouchEvent) => {
            inputMove(te.touches[0].clientX, te.touches[0].clientY);
        };
    }

}

function inputUp()
{
    document.onmousemove = null;
    document.ontouchmove = null;
}

function inputMove(x: number, y: number) {
            console.log("hold")
            selection.mesh.position.x = x - mouse_offset.x;
            selection.mesh.position.y = y - mouse_offset.y;

}

document.onmousedown = (me: MouseEvent) => {
    inputDown(me.clientX, me.clientY);
}

document.addEventListener("touchstart", (te: TouchEvent) => {
    console.log("t");
    inputDown(te.touches[0].clientX, te.touches[0].clientY);
}, false);

document.onmouseup = () => {
    inputUp();
}
document.ontouchend = () => {
    inputUp();
}

document.ondblclick = (me: MouseEvent) => {
    console.log("double")

    if (selection === null)
    {
        root.push(new Bubble(me.clientX, me.clientY));
    } 

}
document.ontouchstart = () => {

}
