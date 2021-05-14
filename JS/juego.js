import  * as yasha from './yasha.js';
import  * as enemigo from './enemigo.js';
import  * as oscuridad from './mapa.js';

var config = {
	type: Phaser.AUTO,
	width:600,
	height:400,
	pixelArt:true,
	physics:{
		default:'arcade',
		arcade:{
			debug:false,
			gravity:{y:0}
		}
	},
	scene:{
		preload:preload,
		create:create,
		update:update
	},
	scale:{
		zoom:2
	}
}

var game = new Phaser.Game(config);
var scene;
var contFuego;
var contHielo;
var tierra;
var lago;
var fondo;
var muros;
var luz;
var objetos;
var objetos2;
var playerVelocidad;
var player;
var grupoFuego;
var grupoHielo;
var freezeTiles;
var allTiles;
var darkTiles;
var allTilesets;
var tileFuego;
var antorchas;
var camara;
var puntero;
var pointer;
var light;
var KeyW;
var KeyA;
var KeyS;
var KeyD;
var Hielo;
var i;
var f;

export function preload()
{
	//this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/sprites.json');
	this.load.image('cuevaTiles', 'assets/mapas/terrain.png');
	this.load.image('snowTiles', 'assets/mapas/snow.png');
	this.load.tilemapTiledJSON('CuevaMago', 'assets/mapas/mapa_CuevaMago.json');
	//this.load.image('boss', 'assets/sprites/enemigoBoss.png');

	yasha.preload.call(this)
	enemigo.preload.call(this)
}

function create()
{
	scene = this;

	const mapa = this.make.tilemap({key:'CuevaMago'});

	const tileset = mapa.addTilesetImage('terrain', 'cuevaTiles');
	const tileset2 = mapa.addTilesetImage('snow', 'snowTiles');

	allTilesets = [tileset,tileset2]

	lago = mapa.createLayer('lago', allTilesets).setDepth(1);
	fondo = mapa.createLayer('fondo', allTilesets);
	tierra = mapa.createLayer('tierra', allTilesets);
	luz = mapa.createLayer('luz', allTilesets);
	muros = mapa.createLayer('muros', allTilesets).setDepth(0);
	objetos = mapa.createLayer('objetos', allTilesets).setDepth(5);
	objetos2 = mapa.createLayer('objetos2', allTilesets).setDepth(1);

	mapa.x = 0;
	mapa.y = 0;

	allTiles = [objetos, muros, fondo, objetos2, lago, luz, tierra];

	tileFuego = mapa.createFromObjects('fuegoTiles');
	antorchas = new Array();
	tileFuego.forEach(obj => {
		this.physics.world.enable(obj);
		obj.setAlpha(0);
		obj.encendido = false;

		antorchas.unshift(obj);
	});

	yasha.create(allTiles, antorchas, config);
	enemigo.create();
	oscuridad.create(scene, allTiles);


	freezeTiles = lago.filterTiles(tile => tile.properties.ice).map(x => x.index);
	darkTiles = luz.filterTiles(tile => tile.properties.dark).map(x => x.index);

	yasha.setFreeze(lago, freezeTiles);
	var cosas = yasha.grupoHielo

 	lago.setTileIndexCallback(freezeTiles, yasha.freeze, this.physics.add.overlap(yasha.grupoHielo, lago));
	 
	lago.setTileIndexCallback(freezeTiles, yasha.freeze, this.physics.add.overlap(yasha.grupoFuego, lago));

	luz.setTileIndexCallback(darkTiles, oscuridad.encenderOscuridad, this.physics.add.overlap(yasha, luz));

	objetos.setCollisionByProperty({collides: true});
	muros.setCollisionByProperty({collides: true});
	objetos2.setCollisionByProperty({collides: true});
}

function update()
{
	yasha.update();
	oscuridad.darkMode();
}