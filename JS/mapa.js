import * as juego from './juego.js';
import * as yasha from './yasha.js';
import * as enemigo from './enemigo.js';

var scene;
var light;
var oscuridad = false;

export function create(s, allTiles)
{
	scene = s;

	for(var i; i < allTiles.lenght; i++)
	{
		allTiles[i].setPipeline('Light2D');
	}

	yasha.player.setPipeline('Light2D');

	scene.lights.enable().setAmbientColor(0x656565);
	scene.lights.enable().active = false;
	light = scene.lights.addLight(0, 0, 0);
}

export function encenderOscuridad()
{
	oscuridad = true;
}

export function darkMode()
{
	if(oscuridad)
	{
		scene.lights.enable().active = true;
	}

	else
	{
		scene.lights.enable().active = false;
		console.log(scene.lights.enable().active)
	}

	oscuridad = false;
}