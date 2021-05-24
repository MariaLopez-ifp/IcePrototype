import * as juego from './juego.js';
import * as yasha from './yasha.js';

var scene;

export function preload()
{
	this.load.spritesheet('enemigo', 'assets/sprites/enemigo.png', {frameWidth:32, frameHeight:32});
	this.load.image('polvoHielo', 'assets/sprites/polvo.png');

	scene = this;
}

export var grupoEnemigos
export var grupoDispEnemigo

export function create(obj)
{
	grupoEnemigos = scene.physics.add.group();
	grupoDispEnemigo = scene.physics.add.group();

	scene.anims.create({
			key:'slime',
			frames: scene.anims.generateFrameNames('enemigo'),
			frameRate: 4,
			repeat: -1
		});
}

export function generarEnemigo(obj)
{
	var e = grupoEnemigos.create(obj.x, obj.y, 'enemigo').setDepth(2).setPipeline('Light2D');
	e.play('slime', true);

	e.detectionbox = scene.add.rectangle(e.x, e.y, 290, 290);
	scene.physics.add.existing(e.detectionbox, false);

	e.detectionbox.tiempoDisparo = 0;

	scene.physics.add.overlap(yasha.player, e.detectionbox, disparoEnemigo, null, scene);
}

function disparoEnemigo(py,en)
{
	if(en.tiempoDisparo <= 0)
	{
		en.tiempoDisparo = 15;

		var d = grupoDispEnemigo.create(en.x - 15, en.y + 5, 'polvoHielo').setDepth(5).setPipeline('Light2D');

	 	d.setAlpha(0.3);

	 	var separar = Phaser.Math.Between(-50, 50)

	 	scene.physics.moveTo(d, yasha.player.x + separar, yasha.player.y + separar, 50);

		d.tiempoVida = 360;
	}

	en.tiempoDisparo--;
}

export function updateDispEnem()
{
	Phaser.Actions.Call(grupoDispEnemigo.getChildren(),function(d)
	{
		d.tiempoVida--;
		if(d.tiempoVida <= 0)
		{
			d.destroy();
		}
	});
}

































/*export function create(allLayers)
{
	enemigoGroup = scene.physics.add.group();
	scene.physics.add.collider(enemigoGroup, enemigoGroup);
	scene.physics.add.collider(enemigoGroup, allLayers);
}

export function createShapeshifter(obj)
{
	var e = enemigoGroup.create(obj.x, obj.y, 'enemigo')

	s.setDepth(4);

	s.setScale(1.5);

	s.setOrigin(0.5,0.9)
	s.vida = 6;
}

export function update()
{
	Phaser.Actions.Call(shapeShifterGroup.getChildren(),function(s)
	{
		if(s.detectionbox.detectado && !s.transformado)
		{
			s.transformado = true;
			s.play('shapeshifterTransform')
		}

		if(s.transformado == true && !s.inmovil && s.vida > 0)
		{
			if(s.anims.currentFrame.isLast)
			{
				s.play('shapeshifterWalk', true)
				s.move = true;

				scene.physics.moveTo(s, heroes.cabeza.x, heroes.cabeza.y+11, 150);
			}
		}
		else
		{
			s.setVelocityX(0)
			s.setVelocityY(0)
		}

		if(s.vida <= 0)
		{
			s.play('shapeshifterWalk', false);
			s.detectionbox.destroy();
			s.setTexture('shapeshifterMuerto');
			s.setTint(0xaaaaaa)
			s.body.enable = false;
		}


		s.detectionbox.y = s.y;
		s.detectionbox.x = s.x;


	})
}

export function herir(obj, e) {
	if (!e.inmune) {
		//console.log(obj)
		e.detectionbox.detectado = true;
		if (obj.dano != null) {
			e.vida -= obj.dano;
		}else{e.vida --;}
		e.inmune = true;

		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				e.inmune = true;

				e.setAlpha(value % 2)

				if (value == 0) {
					e.setAlpha(1)
					e.inmune = false;
				}
			}
		});
	}
}*/