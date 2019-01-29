Bowmasters.Game = function (game) {
  Bowmasters.GAME_WIDTH = 1920;
  Bowmasters.GAME_HEIGHT = 1080;
  groundH = 1000;
  characterHeight = 350;
  grounLevel = 80;
  groundLevel = 1900;
  padding = 300;
  spriteScale = 0.5;
  anchorPoint = 0.5;
  gravity = 7000;
  throwSpeed = 3300;
  zoomLevel = 1;
  guiPadding = 100;
  playerXposition = Bowmasters.GAME_WIDTH / 4 + Bowmasters.GAME_HEIGHT / 2;
};

let enemy = 0;
let enemyHealth = 100;
let playerHealth = 100;
let player = 0;
let playerWeapon = 0;
let enemyWeapon = 0;
let playerAiming = false;
let playerShooting = false;
let playerAnswer = true;
let enemyAnswer = false;
let groundCollide = true;

Bowmasters.Game.prototype = {

  create() {

    this.world.setBounds(0, 0, Bowmasters.GAME_WIDTH, Bowmasters.GAME_HEIGHT);
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = gravity;

    // Background

    this.background = this.add.tileSprite(0, 0, 5049, 2002, 'background');
    this.background.scale.setTo(spriteScale);
    this.ground = this.add.tileSprite(0, groundH, 5049, 326, 'ground');
    this.ground.scale.setTo(spriteScale);
    this.physics.arcade.enable(this.ground);
    this.ground.body.enable = true;
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    lifeBarGroup = game.add.group();
    lifeBarGroup.fixedToCamera = true;


    this.healthGraphic = this.add.graphics(Bowmasters.GAME_WIDTH / 4, 75, lifeBarGroup);
    this.healthGraphic.beginFill(0xa5279f, 1);
    this.healthGraphic.drawRoundedRect(0, 0, Bowmasters.GAME_WIDTH / 2, 110, 55);

    this.lifebarLogo = this.add.image(Bowmasters.GAME_WIDTH / 2, 10, 'logo', {}, lifeBarGroup);
    this.lifebarLogo.anchor.setTo(anchorPoint, 0);
    this.lifebarLogo.scale.setTo(spriteScale);

    // Info player graphic

    this.healthPlayerBarGraphic = this.add.graphics(0, 0, lifeBarGroup);
    this.healthPlayerBarGraphic.beginFill(0xff0000);
    this.healthPlayerBarGraphic.drawRoundedRect(-this.lifebarLogo.width * 1.5, this.lifebarLogo.height * 0.3, 330, 70, 35);
    this.healthPlayerInfoBar = this.add.sprite(Bowmasters.GAME_WIDTH / 4 - 40, 95, this.healthPlayerBarGraphic.generateTexture(), {}, lifeBarGroup);
    this.healthPlayerBarGraphic.destroy();

    this.playerImgInfoBar = this.add.image(Bowmasters.GAME_WIDTH / 4, 70, 'icon_thor_odinson', {}, lifeBarGroup);
    this.playerImgInfoBar.anchor.setTo(anchorPoint, 0);
    this.playerImgInfoBar.scale.setTo(spriteScale);


    // Info enemy graphic

    this.healthEnemyBarGraphic = this.add.graphics(0, 0, lifeBarGroup);
    this.healthEnemyBarGraphic.beginFill(0xff0000, 1);
    this.healthEnemyBarGraphic.drawRoundedRect(0, 0, 330, 70, 35);
    this.healthEnemyInfoBar = this.add.sprite(Bowmasters.GAME_WIDTH - Bowmasters.GAME_WIDTH / 4 + 40, 95, this.healthEnemyBarGraphic.generateTexture(), {}, lifeBarGroup);
    this.healthEnemyInfoBar.anchor.setTo(1, 0);
    this.healthEnemyBarGraphic.destroy();

    this.enemyImgInfoBar = this.add.image(Bowmasters.GAME_WIDTH - Bowmasters.GAME_WIDTH / 4, 70, 'icon_upgrade_loki', {}, lifeBarGroup);
    this.enemyImgInfoBar.anchor.setTo(anchorPoint, 0);
    this.enemyImgInfoBar.scale.setTo(spriteScale);

    // Show Heroes
    player = this.add.spine(padding, groundH, 'thor');
    player.scale.setTo(spriteScale);
    player.addAnimationByName(0, 'idle_apple', true);

    enemy = this.add.spine(Bowmasters.GAME_WIDTH - padding, groundH, 'loki');
    enemy.scale.y *= spriteScale;
    enemy.scale.x *= -spriteScale;
    enemy.addAnimationByName(0, 'idle_apple', true);


    // PLAYER___ PHYSICS
    this.playerAsTarget = this.add.graphics(player.x - 30, player.y - characterHeight);
    this.playerAsTarget.beginFill('#00ff00', 0);
    this.playerAsTarget.drawRect(0, 0, 100, characterHeight);
    this.physics.arcade.enable(this.playerAsTarget);
    this.playerAsTarget.body.enable = true;
    this.playerAsTarget.body.allowGravity = false;
    this.playerAsTarget.body.immovable = true;

    // Physics
    this.enemyAsTarget = this.add.graphics(enemy.x - 60, enemy.y - characterHeight);
    this.enemyAsTarget.beginFill('#00ff00', 0);
    this.enemyAsTarget.drawRect(0, 0, 100, characterHeight);
    this.physics.arcade.enable(this.enemyAsTarget);
    this.enemyAsTarget.body.enable = true;
    this.enemyAsTarget.body.allowGravity = false;
    this.enemyAsTarget.body.immovable = true;

    // CAMERA FIRST STEP
    this.camera.follow(player);
    lifeBarGroup.scale.setTo(0.65);
    this.camera.scale.x += spriteScale;
    this.camera.scale.y += spriteScale;


    // Tutorial
    tutorialGroup = this.add.group();

    this.tutorialShadow = game.add.graphics(0, 0, tutorialGroup);
    this.tutorialShadow.lineColor = 0x000000;
    this.tutorialShadow.lineAlpha = 0.9;
    this.tutorialShadow.lineWidth = guiPadding * 2;
    for (i = 0; i < Math.max(Bowmasters.GAME_WIDTH, Bowmasters.GAME_HEIGHT) / 2; i++) {
      this.tutorialShadow.drawCircle(player.x, player.y - characterHeight / 2 - 65, characterHeight + guiPadding * (2 + i * 4));
    }



    this.handTutorial = this.add.sprite(300, 700, 'tutor_hand', {}, tutorialGroup);
    this.handTutorial.scale.setTo(2);
    this.add.tween(this.handTutorial).to({
      x: 100,
      y: 800
    }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);


    this.textTutorial = this.add.text(105, 497, 'Tap & Drag', {
      font: '75px Arial',
      fill: '#ffffff',
      align: 'center'
    }, tutorialGroup);
    tutorialGroup.position.y = 70;



    // Distance
    this.EnemyDistanseGroup = this.add.group();
    this.EnemyDistanseGroup.fixedToCamera = true;

    this.enemyDistanceUnderlay = this.add.graphics(0, 0, this.EnemyDistanseGroup);
    this.enemyDistanceUnderlay.beginFill(0x813a86);
    this.enemyDistanceUnderlay.drawRoundedRect(Bowmasters.GAME_WIDTH / 2 + 90, groundH / 2, 150, 140, 30);

    this.enemyDistanceArrow = game.add.sprite(Bowmasters.GAME_WIDTH / 2 + 250, groundH / 2 + 70, 'arrow', {}, this.EnemyDistanseGroup);
    this.enemyDistanceArrow.scale.setTo(2);
    this.enemyDistanceArrow.anchor.setTo(anchorPoint);

    this.enemyDistanceIcon = this.add.image(Bowmasters.GAME_WIDTH / 2 + 165, groundH / 2 + 50, 'icon_upgrade_loki', {}, this.EnemyDistanseGroup);
    this.enemyDistanceIcon.anchor.setTo(anchorPoint);
    this.enemyDistanceIcon.scale.setTo(0.35);


    this.enemyDistanceText = game.add.text(Bowmasters.GAME_WIDTH / 2 + 165, groundH / 2 + 115, '' + Math.floor((enemy.x - this.camera.x - Bowmasters.GAME_WIDTH) / 50) + ' m', {
      font: "40 px Arial",
      fill: "#ffffff",
      align: "center"
    }, this.enemyDistanceMeterGroup);
    this.enemyDistanceText.anchor.setTo(1, 0);
    this.enemyDistanceText.scale.setTo(spriteScale);
    game.camera.focusOn(player);


    // Winner
    prizeGroup = game.add.group();
    prizeGroup.fixedToCamera = true;
    prizeGroup.visible = false;

    this.winBox = game.add.sprite(player.x, player.y - characterHeight * 2.1, 'flag_victory', {}, prizeGroup);
    this.winBox.scale.setTo(spriteScale);
    this.winBox.anchor.setTo(anchorPoint);

    this.prizeSquare = this.add.graphics(0, 0, prizeGroup, prizeGroup);
    this.prizeSquare.anchor.setTo(anchorPoint);
    this.prizeSquare.beginFill('0xa5279f', 1);
    this.prizeSquare.drawRect(Bowmasters.GAME_WIDTH / 3 - 30, 0, Bowmasters.GAME_WIDTH, Bowmasters.GAME_HEIGHT);

    this.prizeLogo = this.add.image(this.prizeSquare.x + 955, this.prizeSquare.y + 120, 'logo', {}, prizeGroup);
    this.prizeLogo.anchor.setTo(anchorPoint);
    this.prizeLogo.scale.setTo(spriteScale);

    this.prizeTextBox = this.add.graphics(this.prizeSquare.x + 955 - 470 / 2, 260, prizeGroup);
    this.prizeTextBox.beginFill(0x000000, 0.4);
    this.prizeTextBox.drawRoundedRect(0, 0, 470, 70, 35);

    this.prizeText = this.add.text(this.prizeSquare.x + 955, 300, 'You got a prize!', {
      font: '45px Courier',
      fill: '#ffffff',
      align: 'center'
    }, prizeGroup);
    this.prizeText.anchor.setTo(anchorPoint);

    this.prizeChest = this.add.image(this.prizeSquare.x + 955, this.prizeSquare.y + 470, 'chest', {}, prizeGroup);
    this.prizeChest.anchor.setTo(anchorPoint);
    this.prizeChest.scale.setTo(spriteScale);

    this.playGameBox = this.add.graphics(this.prizeSquare.x + 955 - 400 / 2, 600, prizeGroup);
    this.playGameBox.beginFill(0x08c9d8, 0.9);
    this.playGameBox.drawRoundedRect(0, 0, 400, 100, 50);

    this.prizeText = this.add.text(this.prizeSquare.x + 955, 655, 'PLAY NOW', {
      font: '70px Courier',
      fill: '#ffffff',
      align: 'center'
    }, prizeGroup);
    this.prizeText.anchor.setTo(anchorPoint);




    // Aim Line
    this.aimLineGR = this.add.graphics();
    this.aimLineGR.beginFill('0xffffff', 0.8);
    for (let i = 1; i < 10; i++) {
      this.aimLineGR.drawCircle(60 * i, 0, 20 - i);
    }
    aimLine = this.add.sprite(0, 0, this.aimLineGR.generateTexture());
    aimLine.visible = false;
    this.aimLineGR.destroy();

    // Aim Line Right Green
    this.aimLineRightGR = this.add.graphics();
    this.aimLineRightGR.beginFill('0x9ce200', 0.6);
    for (let i = 1; i < 10; i++) {
      this.aimLineRightGR.drawCircle(60 * i, 0, 20 - i);
    }
    aimLineRight = this.add.sprite(0, 0, this.aimLineRightGR.generateTexture());
    aimLineRight.visible = false;
    this.aimLineRightGR.destroy();



    this.input.onDown.add(this.playerAim);
    this.input.onUp.add(this.playerShot);
    this.input.addMoveCallback(this.adjustAiming, this);
  },


  update() {

    game.physics.arcade.collide(playerWeapon, this.ground, () => {
      if (groundCollide) {
        playerWeapon.body.velocity.set(0);
        playerWeapon.body.immovable = true;
        playerWeapon.body.allowGravity = false;
        game.tweens.remove(game.playerWeaponTween);
        enemy.setAnimationByName(0, 'fall', false);
        game.camera.follow(enemy, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);

        if (enemyHealth <= 0) {
          playerWeapon.kill();
          this.playerWin();
        } else {
          setTimeout(() => {
            enemy.onEvent.add((i, e) => {
              playerWeapon.kill();
              enemyAnswer = true;
              this.enemyShot(i, e);
            });
          }, 1000);
        }
        groundCollide = false;
      }
    });

    game.physics.arcade.collide(playerWeapon, this.enemyAsTarget, () => {
      enemyHealth -= 50;
      this.healthEnemyInfoBar.width = this.healthEnemyInfoBar.width / 100 * enemyHealth;
      this.healthEnemyInfoBar.updateCrop();
      playerWeapon.kill();
      game.camera.follow(enemy, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);

      switch (enemyHealth) {
        case 0:
          this.finishHim();
          break;
          
          case -50:
          this.playerWin();
          break;
          /*
        case -50:
          this.fatality();
          break;
          */
        default:
          enemy.setAnimationByName(0, 'fall', false);
          setTimeout(() => {
            enemy.onEvent.add((i, e) => {
              enemyAnswer = true;

              this.enemyShot(i, e);
            });
          }, 1000);
          break;
      }
    });


    game.physics.arcade.collide(enemyWeapon, this.playerAsTarget, () => {
      enemyWeapon.kill();
      playerHealth -= 30;
      this.healthPlayerInfoBar.width -= 330 / 100 * 30;
      this.healthPlayerInfoBar.updateCrop();
      player.setAnimationByName(0, 'default', false);
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);
      setTimeout(() => {
        playerShooting = false;
        playerAiming = false;
        playerAnswer = true;

      }, 700);
    });


    game.physics.arcade.collide(enemyWeapon, this.ground, () => {
      enemyWeapon.body.immovable = true;
      enemyWeapon.body.velocity.set(0);
      enemyWeapon.body.allowGravity = false;
      game.tweens.remove(game.enemyWeaponTween);
      player.setAnimationByName(2, 'scare', false);
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);
      setTimeout(() => {
        enemyWeapon.kill();
        playerShooting = false;
        playerAiming = false;
        playerAnswer = true;
      }, 700);
    });

    /////////////////////////////////////////////////////////////

   

    /*
          this.distanceInMeters = Math.floor((enemy.x - game.camera.x - Bowmasters.GAME_WIDTH / 2) / 20);
          if (this.distanceInMeters > 10) {
            Bowmasters.Game.distanseGroup.visible = true;
            textTutorial.text = `${this.distanceInMeters} m`;
          } else {
            Bowmasters.distanseGroup.visible = false;
          }
        
*/

  },




  playerAim() {

    tutorialGroup.destroy();

    if (playerAnswer) {
      playerWeapon = game.add.sprite(player.x - 190, player.y - 220, 'hammer');
      playerWeapon.scale.setTo(spriteScale);
      playerWeapon.anchor.setTo(anchorPoint);
      playerWeapon.angle = -140;
      playerWeapon.visible = false;

      if (!this.playerShooting) {
        playerAiming = true;
        playerWeapon.visible = true;
        player.setAnimationByName(0, 'grenade_draw', false);
      }
    }

  },


  adjustAiming(e) {
    if (playerAiming) {
      // between distance position
      const distX = e.position.x - e.positionDown.x;

      if (distX < 30) {
        aimLine.position.set(player.x + 80, player.y - 240);
        aimLine.visible = true;
        aimLineRight.position.set(player.x + 80, player.y - 240);
        aimLineRight.visible = true;
        aimLineRight.angle = Phaser.Math.radToDeg(-0.5);
        this.direction = Phaser.Math.angleBetween(e.position.x, e.position.y, e.positionDown.x, e.positionDown.y);
        aimLine.angle = Phaser.Math.radToDeg(this.direction);
      } else {
        aimLine.visible = false;
        aimLineRight.visible = false;
      }
    }
  },


  playerShot() {
    if (aimLine.visible && playerAnswer) {
      const angleOfFire = Phaser.Math.degToRad(aimLine.angle - 360);
      game.physics.enable(playerWeapon, Phaser.Physics.ARCADE);
      //playerWeapon.body.velocity.set(0, 0);
      playerWeapon.body.enable = true;
      playerWeapon.body.velocity.set(this.throwSpeed * Math.cos(angleOfFire), this.throwSpeed * Math.sin(angleOfFire));
      game.playerWeaponTween = game.add.tween(playerWeapon).to({
        angle: 270
      }, 700, 'Linear', true, 0, -1, false);
      playerShooting = true;
      game.camera.follow(playerWeapon);
      player.setAnimationByName(0, 'grenade_shot', false);

      playerAiming = false;
      playerAnswer = false;
      groundCollide = true;
      aimLine.visible = false;
      aimLineRight.visible = false;
    }
  },


  enemyShot(trackIndex, event) {
    if (event.data.name == 'Got_up' && enemyAnswer && enemyHealth > 0) {
      enemyWeapon = game.add.sprite(enemy.x + 90, enemy.y - 300, 'spear');
      enemyWeapon.scale.setTo(spriteScale);
      enemyWeapon.anchor.setTo(anchorPoint);
      enemyWeapon.angle = -40;
      enemyWeapon.visible = true;
      game.physics.enable(enemyWeapon, Phaser.Physics.ARCADE);
      enemyWeapon.body.enable = true;
      enemy.setAnimationByName(1, 'grenade_shot', false);
      game.enemyWeaponTween = game.add.tween(enemyWeapon).to({
        angle: -120
      }, 1300, 'Linear', true, false);

      if (playerHealth > 50) {
        enemyWeapon.body.velocity.set(-2500, 0.001);
      } else {
        enemyWeapon.body.velocity.set(-1000, 10);
      }
      game.camera.follow(enemyWeapon);
      enemyAnswer = false;


    }
  },



  finishHim() {
    enemy.setAnimationByName(0, 'finish_him', true);
    this.finishHimBox = game.add.sprite(enemy.x, enemy.y - characterHeight, 'finish_him');
    this.finishHimBox.scale.setTo(spriteScale);
    this.finishHimBox.anchor.setTo(anchorPoint);
    setTimeout(() => {
      this.finishHimBox.destroy();
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);
      playerShooting = false;
      playerAnswer = true;
      playerAiming = false;
    }, 1500);
  },




  //  End            
  playerWin() {
    lifeBarGroup.destroy();
    //distanseGroup.destroy();
    prizeGroup.visible = true;
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);
    player.setAnimationByName(0, 'win', true);

    playerAnswer = false; 
    enemyAnswer = false;
  },

};