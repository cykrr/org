import { Mesh, Vector3 } from 'three'
export var mouse = new Vector3();

export function onMouseDown(e: MouseEvent)
{
    console.log("x: " + e.clientX + " y: " + e.clientY)
}

export function onMouseMove(e: MouseEvent)
{
    console.log("x: " + e.clientX + " y: " + e.clientY)
}
