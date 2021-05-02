import  * as yasha from './yasha.js';

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
var lago;
var fondo;
var muros;
var objetos;
var objetos2;
var playerVelocidad;
var player;
var grupoFuego;
var grupoHielo;
var freezeTiles;
var allTiles;
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

function preload()
{
	//this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/sprites.json');
	this.load.image('cuevaTiles', 'assets/mapas/terrain.png');
	this.load.tilemapTiledJSON('CuevaMago', 'assets/mapas/mapa_CuevaMago.json');
	//this.load.image('boss', 'assets/sprites/enemigoBoss.png');

	yasha.preload.call(this)
}

function create()
{
	scene = this;

	const mapa = this.make.tilemap({key:'CuevaMago'});

	const tileset = mapa.addTilesetImage('terrain', 'cuevaTiles');

	lago = mapa.createLayer('lago', tileset).setDepth(5);
	fondo = mapa.createLayer('fondo', tileset);
	muros = mapa.createLayer('muros', tileset).setDepth(0);
	objetos = mapa.createLayer('objetos', tileset).setDepth(4);
	objetos2 = mapa.createLayer('objetos2', tileset).setDepth(0);

	mapa.x = 0;
	mapa.y = 0;

	allTiles = [objetos, muros, fondo, objetos2, lago];

	tileFuego = mapa.createFromObjects('fuegoTiles');
	antorchas = new Array();
	tileFuego.forEach(obj => {
		this.physics.world.enable(obj);
		obj.setAlpha(0);
		obj.encendido = false;

		antorchas.unshift(obj);
	});

	yasha.create(allTiles, antorchas, config);

	freezeTiles = lago.filterTiles(tile => tile.properties.ice).map(x => x.index);

	//console.log(freezeTiles)
	//console.log(lago)

	yasha.setFreeze(lago, freezeTiles);
	//yasha.freeze(lago,lago)
	var cosas = yasha.grupoHielo
	console.log(cosas)

 	lago.setTileIndexCallback(freezeTiles, yasha.freeze, this.physics.add.overlap(yasha.grupoHielo, lago));

	objetos.setCollisionByProperty({collides: true});
	muros.setCollisionByProperty({collides: true});

	this.lights.enable().setAmbientColor(0x656565);
	light = scene.lights.addLight(0, 0, 0);

	objetos.setPipeline('Light2D');
	muros.setPipeline('Light2D');
	fondo.setPipeline('Light2D');
	objetos2.setPipeline('Light2D');
	lago.setPipeline('Light2D');
}

function update()
{
	yasha.update();
}