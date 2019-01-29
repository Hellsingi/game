const Bowmasters = {};
Bowmasters.Boot = function(game) {};
Bowmasters.Boot.prototype = {
    preload() {
        this.add.plugin(PhaserSpine.SpinePlugin);
        this.load.image("logo", "images/Resources/UI/logo.png");    },
    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        //this.scale.setScreenSize(true);
        this.state.start('Preloader');
    }
};