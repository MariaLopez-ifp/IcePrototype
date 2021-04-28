var scene;
var player;
var contFuego;
var contHielo;
var playerVelocidad;
var grupoFuego;
var grupoHielo;
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

	player = scene.physics.add.sprite(-240,-50, 'Yasha').setDepth(2);
	player.setOrigin(0.5);

	grupoFuego = scene.physics.add.group();

	grupoHielo = scene.physics.add.group().setDepth(20);

	player.muerto = false;

	scene.anims.create({
		key:'hot',
		frames: scene.anims.generateFrameNames('fuego', {start:0, end:3}),
		frameRate: 10,
		repeat: -1
	});

	scene.physics.add.overlap(grupoFuego, antorchas, burn, null, scene);

	scene.physics.add.collider(player, allTiles);

	scene.cameras.main.startFollow(player);

	camara = scene.cameras.main;

	puntero = new Phaser.Geom.Point();

	pointer = scene.input.activePointer;

	player.setPipeline('Light2D');

	KeyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	KeyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	KeyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	KeyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	Hielo = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
}

function input()
{
	if(KeyW.isDown)
	{
		player.vectorY=-1;
	}

	else if(KeyS.isDown)
	{
		player.vectorY=1;
	}

	else
	{
		player.vectorY=0;
	}

	if(KeyA.isDown)
	{
		player.vectorX=-1;
	}

	else if(KeyD.isDown)
	{
		player.vectorX=1;
	}

	else
	{
		player.vectorX=0;
	}

	if (pointer.isDown && contFuego <= 0)
	{
		generarFuego();
	}

	if (Hielo.isDown && contHielo <= 0)
	{
		generarHielo();
	}

	player.dir = new Phaser.Math.Vector2( player.vectorX, player.vectorY);
	player.dir.normalize();
	player.setVelocityX(playerVelocidad*player.dir.x);
	player.setVelocityY(playerVelocidad*player.dir.y)
}

function generarFuego()
{
	var f = grupoFuego.create(puntero.x, puntero.y, 'fuego').setDepth(20);
	f.play('hot');
	f.scale = 1;
	contFuego = 30;
	f.light = scene.lights.addLight(f.x, f.y, 100).setColor(0xffffff).setIntensity(1);
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

export function burn(objeto, fuego)
{
	if(!objeto.encendido)
	{
		var f = scene.add.sprite(objeto.x, objeto.y, 'fuego').setDepth(20);
		f.play('hot');

		f.light = scene.lights.addLight(objeto.x, objeto.y, 800).setColor(0xffffff).setIntensity(2);

		objeto.encendido = true;
	}
}

function generarHielo()
{
	var h = grupoHielo.create (player.x, player.y, 'disparoHielo').setDepth(20);
		h.angle = Math.atan2(puntero.y - h.y, puntero.x - h.x) * 180 / Math.PI;
		h.angle += 45;

		contHielo = 30;

		scene.physics.moveToObject(h, puntero, 240);
}

function updateHielo()
{
	for(var i = 0; i < grupoHielo.getChildren().length; i++)
    {
    	var h = grupoHielo.getChildren()[i];

    	if(h.x > config.width + h.width * 0.25 / 2)
		{
			h.destroy();
		}
    }
}

function freeze(objeto, lago)
{
    if (lago.properties.freeze)
    {
        lago.setAlpha(0);

        lago.properties.freeze = false;
    }

    setTimeout(()=>
    {
        if(!lago.properties.freeze)
        {
            lago.properties.freeze = true;
        }

        lago.setAlpha(1);

    },4000);

    //console.log(hielo.properties.veneno);
}

export function setFreeze(layer, id)
{
	layer.setTileIndexCallback(id, freeze, scene.physics.add.overlap(grupoHielo, layer));
}