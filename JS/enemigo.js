import * as mapa from './juego.js';
import * as yasha from './yasha.js';

var scene;
var grupoEnemigos;

export function preload()
{
	this.load.spritesheet('enemigo', 'assets/sprites/enemigo.png', {frameWidth:32, frameHeight:32});

	scene = this;
}

export var enemigoGroup

export function create()
{
	grupoEnemigos = scene.physics.add.group();
	
	scene.anims.create({
			key:'slime',
			frames: scene.anims.generateFrameNames('enemigo'),
			frameRate: 4,
			repeat: -1
		});

	generarEnemigo();
}

export function generarEnemigo()
{
	var e = grupoEnemigos.create(-240, 150, 'enemigo').setDepth(10).setPipeline('Light2D');
	e.play('slime', true);
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