import * as utilidades from './utilidades.js';
import * as yasha from './yasha.js';

var portals = new Array();
var coolDown = 120
var scene
var tiempoActivo = 0;

export function preload()
{
	scene = this
}

export function createAnims()
{
}

export function create(capa)
{
	capa.forEach(obj => {

		if(obj.name == 'portal')
		{
			scene.physics.world.enable(obj);

			obj.setSize(4, 4)
			obj.setAlpha(0)

			obj.body.height = 4
			obj.body.width = 4

			obj.body.offset.x += 14
			obj.body.offset.y += 14

			createPortal(obj);
		}
	})

	createLinks(scene)

	return portals
}

function createPortal(obj)
{
	utilidades.convertToProperties(obj)
	obj.coolDown = 0

	portals.unshift(obj)
}

export function collisionPortal(obj)
{
	scene.physics.add.overlap(obj, portals, teleport, teleportTimeout, scene);
}

function teleportTimeout()
{
	tiempoActivo++;

	if (tiempoActivo > 20)
	{
		tiempoActivo = 0
		return true
	}
	return true
}

function teleport(entity, obj)
{
	if (obj.coolDown <= 0 && tiempoActivo == 10)
	{
		obj.coolDown = coolDown
		obj.destino.coolDown = coolDown

		entity.x = obj.destino.x
		entity.y = obj.destino.y
		tiempoActivo = 0;
	}
}

function createLinks()
{
	for (var i = 0; i < portals.length; i++) {
		var p = portals[i]
		
		p.linked=false;
		for (var e = 0; e < portals.length; e++)
		{
			var d = portals[e]
			if(p.properties.destino == d.properties.puerta)
			{
				p.destino=d
				p.linked=true;
			}
		}
		if(!p.linked)
		{
			p.destino=p
		}
	}
}

export function update()
{
	for (var i = 0; i < portals.length; i++){
		portals[i].coolDown--
	}
}