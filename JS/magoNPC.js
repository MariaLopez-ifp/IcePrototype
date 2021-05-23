import * as juego from './juego.js';
import * as yasha from './yasha.js';

var scene;

export function preload()
{
	this.load.spritesheet('magoHielo', 'assets/sprites/magoHielo.png', {frameWidth:88, frameHeight:44});

	scene = this;
}

export var mago;

export function create()
{
	scene.anims.create({
			key:'magia',
			frames: scene.anims.generateFrameNames('magoHielo'),
			frameRate: 4,
			repeat: -1
		});

	generarMago();
}

export function generarMago()
{
	mago = scene.physics.add.sprite(-240, -350, 'magoHielo').setDepth(6).setPipeline('Light2D');
	mago.play('magia', true);
}