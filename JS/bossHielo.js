import * as juego from './juego.js';
import * as yasha from './yasha.js';

var scene;

export function preload()
{
	this.load.spritesheet('bossHielo', 'assets/sprites/bossHielo.png', {frameWidth:32, frameHeight:32});

	scene = this;
}

export var boss;

export function create(obj)
{
	scene.anims.create({
			key:'boss',
			frames: scene.anims.generateFrameNames('bossHielo'),
			frameRate: 4,
			repeat: -1
		});

	generarBoss(obj);
}

export function bossTrue(arrayObj)
{
	var arrayObjEncencido = true;

	for(var i = 0; i < arrayObj.length; i++)
	{
		if(arrayObj[i].encendido == false)
		{
			arrayObjEncencido = false;
		}
	}

	if(arrayObjEncencido == true)
	{
		mago.body.enable = true;
		mago.detectionbox.body.enable = true;
		mago.setAlpha(1);
	}
}

export function generarBoss(obj)
{
	boss = scene.physics.add.sprite(obj.x, obj.y, 'bossHielo').setDepth(2).setPipeline('Light2D');
	boss.setSize(30, 39);
	boss.setScale(4);
	boss.play('boss', true);

	boss.detectionbox = scene.add.rectangle(boss.x, boss.y, 400, 400);
	scene.physics.add.existing(boss.detectionbox, false);
}