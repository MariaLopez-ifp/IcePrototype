import * as utilidades from './utilidades.js';

var scene;
export var player;
var contFuego;
var contHielo;
var playerVelocidad;
export var grupoFuego;
export var grupoHielo;
var camara;
var puntero;
var pointer;
var light;
var KeyW;
var KeyA;
var KeyS;
var KeyD;
var Hielo;
var config;


export function preload()
{
	this.load.image('Yasha', 'assets/sprites/yasha.png');
	this.load.image('YashaBack', 'assets/sprites/yashaBack.png');
	this.load.image('disparoHielo', 'assets/sprites/hielo.png');
	this.load.spritesheet('fuego', 'assets/sprites/fuego.png', {frameWidth:32, frameHeight:32});

	scene = this;
}

export function create(allTiles, antorchas, conf, light)
{
	config = conf;
	contFuego = 3;
	contHielo = 3;

	playerVelocidad = 125;

	player = scene.physics.add.sprite(-240, 850, 'Yasha').setDepth(2).setPipeline('Light2D');
	player.setOrigin(0.5);
	player.setCircle(12, 4, 8);

	grupoFuego = scene.physics.add.group();

	grupoHielo = scene.physics.add.group().setDepth(2);

	player.muerto = false;

	scene.anims.create({
		key:'hot',
		frames: scene.anims.generateFrameNames('fuego'),
		frameRate: 10,
		repeat: -1
	});

	scene.physics.add.overlap(grupoFuego, antorchas, burn, null, scene);

	scene.physics.add.collider(player, allTiles);

	scene.physics.add.collider(grupoHielo, allTiles);

	scene.cameras.main.startFollow(player);

	camara = scene.cameras.main;

	puntero = new Phaser.Geom.Point();

	pointer = scene.input.activePointer;

	KeyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	KeyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	KeyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	KeyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	Hielo = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	player.luz = scene.lights.addLight(player.x, player.y, 0);
}

export function update()
{
    if(player.muerto == false)
    {
        input();
    }

    updateHielo();
	contHielo--;

	updateFuego();
	contFuego--;

	//updateEnemigo();

	puntero.x = player.x - config.width / 2 + pointer.x;
	puntero.y = player.y - config.height / 2 + pointer.y;

	player.luz.x = player.x
	player.luz.y = player.y
}

function input()
{
	if(KeyW.isDown)
	{
		player.vectorY = -1;
		player.look = 'up';
	}

	else if(KeyS.isDown)
	{
		player.vectorY = 1;
		player.look = 'down';	
	}

	else
	{
		player.vectorY  =0;
	}

	if(KeyA.isDown)
	{
		player.vectorX = -1;
	}

	else if(KeyD.isDown)
	{
		player.vectorX = 1;
	}

	else
	{
		player.vectorX = 0;
	}

	if (pointer.isDown && contFuego <= 0)
	{
		generarFuego();
	}

	if (Hielo.isDown && contHielo <= 0)
	{
		generarHielo();
	}

	playerAnims();

	player.dir = new Phaser.Math.Vector2(player.vectorX, player.vectorY);
	player.dir.normalize();
	player.setVelocityX(playerVelocidad*player.dir.x);
	player.setVelocityY(playerVelocidad*player.dir.y)
}

export function playerAnims()
{
	if(player.look == 'up')
	{
		// player.stop();
		player.setTexture('YashaBack');
		// player.emitter.stop();
	}

	else if(player.look == 'down')
	{
		// player.stop();
		player.setTexture('Yasha');
		// player.emitter.stop();
	}
}

function generarFuego()
{
	var f = grupoFuego.create(puntero.x, puntero.y, 'fuego').setDepth(20);
	f.play('hot');
	f.scale = 1;

	contFuego = 30;

	f.light = scene.lights.addLight(f.x, f.y, 100).setColor(0xffffff).setIntensity(1);

	f.fuego = true;
}

function updateFuego()
{
	Phaser.Actions.Call(grupoFuego.getChildren(), function(obj)
	{
		obj.scale -= 0.009;
		obj.setScale(obj.scale);

		if(obj.scale <= 0)
		{
			scene.lights.removeLight(obj.light);
			obj.destroy();
		}

		obj.light._radius--;
	});
}

function generarHielo()
{
	var h = grupoHielo.create (player.x, player.y, 'disparoHielo').setDepth(20);
		h.angle = Math.atan2(puntero.y - h.y, puntero.x - h.x) * 180 / Math.PI;
		h.angle += 45;
		h.fragil = true;
		h.hielo = true;
		h.tiempo = 0;
		h.setCircle(2, 14, 14);

		contHielo = 30;

		scene.physics.moveToObject(h, puntero, 240);
}

function updateHielo()
{
	for(var i = 0; i < grupoHielo.getChildren().length; i++)
    {
    	var h = grupoHielo.getChildren()[i];
		h.tiempo++;

		if (h.tiempo > 90)
		{
			h.destroy();
		}
    }
}

export function burn(objeto, fuego)
{
	if(!objeto.encendido)
	{
		var f = scene.add.sprite(objeto.x, objeto.y, 'fuego').setDepth(20);
		f.play('hot');

		f.light = scene.lights.addLight(objeto.x, objeto.y, 800).setColor(0xffffff).setIntensity(1);

		objeto.encendido = true;
	}
}

export function derretir(fuego, nieve)
{
	if (nieve.properties != undefined && nieve.properties.snow == true && fuego.fuego)
    {
        nieve.setAlpha(0);

		utilidades.collisionSwitch(nieve, false);

        nieve.properties.snow = false;
    }
}

export function freeze(objeto, lago)
{
    if (lago.properties != undefined && !lago.properties.freeze && objeto.hielo )
    {
        lago.setAlpha(0);

        lago.properties.freeze = true;
    }

    if(lago.properties != undefined && lago.properties.freeze && objeto.fuego)
    {
		lago.setAlpha(1);

        lago.properties.freeze = false;
    }    
}

export function setFreeze(layer, id)
{
	layer.setTileIndexCallback(id, freeze, scene.physics.add.overlap(grupoHielo, layer));
}
