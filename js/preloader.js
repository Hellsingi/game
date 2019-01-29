Bowmasters.Preloader = function (game) {
    Bowmasters.GAME_WIDTH = 1920;
    Bowmasters.GAME_HEIGHT = 1080;
};
Bowmasters.Preloader.prototype = {
    preload() {
        this.logo = this.add.image(Bowmasters.GAME_WIDTH / 2, Bowmasters.GAME_HEIGHT / 4, 'logo');
        this.logo.anchor.setTo(0.5, 0);

        this.preloadBar = this.add.graphics();
        this.preloadBar.beginFill(0xA645B6);
        this.preloadBar.drawRoundedRect(Bowmasters.GAME_WIDTH / 4 , Bowmasters.GAME_HEIGHT / 1.5 - 10, Bowmasters.GAME_WIDTH / 2, 70, 35);

        this.progressBarGR = this.add.graphics();
        this.progressBarGR.beginFill(0xff6100);
        this.progressBarGR.drawRoundedRect(Bowmasters.GAME_WIDTH / 4, Bowmasters.GAME_HEIGHT / 1.5, Bowmasters.GAME_WIDTH / 2, 50, 25);

        this.progressBar = this.add.sprite(Bowmasters.GAME_WIDTH  / 4 , Bowmasters.GAME_HEIGHT  / 1.5 , this.progressBarGR.generateTexture());
        this.progressBarGR.destroy();
        this.load.setPreloadSprite(this.progressBar);

        //Background
        this.load.image('background', 'images/Resources/BG/bm_bg.png');
        this.load.image('ground', 'images/Resources/BG/bm_ground.png');
       

        // Loki
        this.load.spine('loki', 'images/Resources/Character/Loki/loki_upgraded.json');
        this.load.image('spear', 'images/Resources/Character/Loki/upgrade_loki_spear.png');

        // Thor
        this.load.spine('thor', 'images/Resources/Character/Thor/thor_odinson.json');
        this.load.image('hammer', 'images/Resources/Character/Thor/hammer_thor.png');

        // FX
        this.load.image('ash_pile', 'images/Resources/FX/FX_Ash_pile_0.png');
        this.load.image('coil_l', 'images/Resources/FX/FX_Light_coil_L.png');
        this.load.image('coil_m', 'images/Resources/FX/FX_Light_coil_M.png');
        this.load.image('lightning_0', 'images/Resources/FX/FX_Mjolnir_lightning_0.png');
        this.load.image('lightning_1', 'images/Resources/FX/FX_Mjolnir_lightning_1.png');
        this.load.image('lightning_1a', 'images/Resources/FX/FX_Mjolnir_lightning_1a.png');
        this.load.image('star', 'images/Resources/FX/star.png');

        // UI
        this.load.image('arrow', 'images/Resources/UI/arrow.png');
        this.load.image('chest', 'images/Resources/UI/chest.png');
        this.load.image('finish_him', 'images/Resources/UI/finish_him.png');
        this.load.image('flag_victory', 'images/Resources/UI/flag_victory.png');
        this.load.image('icon_thor_odinson', 'images/Resources/UI/icon_thor_odinson.png');
        this.load.image('icon_upgrade_loki', 'images/Resources/UI/icon_upgrade_loki.png');
        this.load.image('tutor_hand', 'images/Resources/UI/tutor_hand.png');
        
    
    },
    create() {
        this.state.start('Game');
    }
};