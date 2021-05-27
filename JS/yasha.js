import * as utilidades from './utilidades.js';
import * as juego from './juego.js';
import * as mago from './magoNPC.js';

var scene;
export var player;
var contFuego;
var contHielo;
var playerVelocidad;
export var grupoFuego;
export var grupoHielo;
var camara;
var cursor;
var puntero;
var cuadroTexto;
var cuadroTexto2;
var imagenTexto;
var pointer;
var light;
var KeyW;
var KeyA;
var KeyS;
var KeyD;
var Hielo;
var config;
var textoMago = false;


export function preload()
{
	this.load.image('Yasha', 'assets/sprites/yasha.png');
	this.load.image('YashaBack', 'assets/sprites/yashaBack.png');
	this.load.image('disparoHielo', 'assets/sprites/hielo.png');
	this.load.image('textoHielo', 'assets/sprites/hieloTexto.png');
	this.load.image('cursor','assets/sprites/cursor.png');
	this.load.spritesheet('fuego', 'assets/sprites/fuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaBackF', 'assets/sprites/yashaBackFuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaBackFH', 'assets/sprites/yashaBackFuegoHielo.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaF', 'assets/sprites/yashaFuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaBackFH', 'assets/sprites/yashaFuegoHielo.png', {frameWidth:32, frameHeight:32});

	scene = this;
}

export function create(allTiles, antorchas, conf, light)
{
	config = conf;
	contFuego = 3;
	contHielo = 3;

	playerVelocidad = 125;

	player = scene.physics.add.sprite(-980, 2250, 'Yasha').setDepth(2).setPipeline('Light2D');
	player.setOrigin(0.5);
	player.hieloTrue = false;
	player.body.allowDrag = false;

	player.maxVida = 8;
  	player.vida = player.maxVida;

	grupoFuego = scene.physics.add.group();

	grupoHielo = scene.physics.add.group().setDepth(2);

	player.muerto = false;

	scene.anims.create({
		key:'hot',
		frames: scene.anims.generateFrameNames('fuego'),
		frameRate: 10,
		repeat: -1
	});

	scene.anims.create({
		key:'backF',
		frames: scene.anims.generateFrameNames('YashaBackF'),
		frameRate: 3,
		repeat: -1
	});

	scene.anims.create({
		key:'backFH',
		frames: scene.anims.generateFrameNames('YashaBackFH'),
		frameRate: 3,
		repeat: -1
	});

	scene.anims.create({
		key:'yashaF',
		frames: scene.anims.generateFrameNames('YashaF'),
		frameRate: 3,
		repeat: -1
	});

	scene.anims.create({
		key:'yashaFH',
		frames: scene.anims.generateFrameNames('YashaFH'),
		frameRate: 3,
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

	cursor = scene.add.sprite(0,0,'cursor').setDepth(20);
	cursor.setOrigin(0.5)

	cursor.pointer = pointer;
}

export function updatePuntero()
{
	cursor.x = player.x - config.width / 2 + pointer.x - 14;
	cursor.y = player.y - config.height / 2 + pointer.y + 15;
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

	puntero.x = player.x - config.width / 2 + pointer.x;
	puntero.y = player.y - config.height / 2 + pointer.y;

	player.luz.x = player.x
	player.luz.y = player.y

	updatePuntero();
	updateTexto();
}

export function quitarVida()
{
	
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
		player.vectorY = 0;
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

	if (Hielo.isDown && contHielo <= 0 && player.hieloTrue == true)
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
		player.play('backF', true);
	}

	else if(player.look == 'down')
	{
		player.play('yashaF', true);
	}
}

function generarFuego()
{
	var f = grupoFuego.create(puntero.x, puntero.y, 'fuego').setDepth(20);
	f.play('hot');
	f.scale = 1;

	contFuego = 40;

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
		var f = scene.add.sprite(objeto.x, objeto.y, 'fuego').setDepth(15);
		f.play('hot');

		f.light = scene.lights.addLight(objeto.x, objeto.y, 800).setColor(0xffffff).setIntensity(2);

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

function updateTexto()
{
	if(cuadroTexto != undefined)
	{
		cuadroTexto.x = player.x - config.width / 2 + config.width / 2;
		cuadroTexto.y = player.y - config.height / 2 + config.height - 50;

		cuadroTexto2.x = player.x - config.width / 2 + config.width / 2;
		cuadroTexto2.y = player.y - config.height / 2 + config.height - 50;

		scene.magoText.x = player.x - config.width / 2 + 16;
		scene.magoText.y = player.y - config.height / 2 + 310;

		imagenTexto.x = player.x - config.width / 2 + 540;
		imagenTexto.y = player.y - config.height / 2 + 350;

		if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), mago.mago.detectionbox.getBounds()))
		{
			cuadroTexto.setAlpha(1)
			cuadroTexto2.setAlpha(1)
			scene.magoText.setAlpha(1)
			imagenTexto.setAlpha(1)
		}
		else{
			cuadroTexto.setAlpha(0)
			cuadroTexto2.setAlpha(0)
			scene.magoText.setAlpha(0)
			imagenTexto.setAlpha(0)
		}

	}
}

export function encenderHielito(yasha, obj)
{
	player.hieloTrue = true;

	if(textoMago == false)
	{
		cuadroTexto = scene.add.rectangle(player.x - config.width / 2 + config.width / 2, player.y - config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16);


		cuadroTexto2 = scene.add.rectangle(player.x - config.width / 2 + config.width/2, player.y - config.height / 2 + config.height - 50, config.width-8, 100 - 8, 0x000000).setDepth(17);

		scene.magoText = scene.add.text(player.x - config.width / 2 + 16, player.y - config.height / 2 + 310, 'Mago: \nOtro novato en busca de poder... \nToma esto y dejame en paz.', {fontSize: '12px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(18);

		imagenTexto = scene.physics.add.sprite(player.x - config.width / 2 + 540, player.y - config.height / 2 + 330, 'textoHielo').setDepth(18).setScale(2);
	}

	textoMago = true;
}