var crystals = new Page( 'crystals' );


crystals.addToInitArray( function(){

this.textChunk = [

  "After traveling for what seemed like an eternity, Webby came upon a land of sparkling crystals. Although it told him nothing more about himself, the crystals were very pretty, so he took a moment to play with them. "

].join("\n" );


this.textChunk2 = [

"As he got closer to the crystals, the sounds they made conjured an image of a man wearing headphones. This made him remember that we was created using  a library called ‘three.js’, run by ‘Mr.doob’. Although he didn’t know what headphones were, seeing as he did not have ears, he still thought the word ‘doob’ looked a like a man wearing them."

].join("\n");

this.textChunk3 = [

"He also didn’t know what a library was, but was certain that his creator, Cabbibo, had no idea what he was doing, so this ‘three.js’ must have been pretty easy to work with.",
"","",
  "It made Webby happy to know more about where he came from, but it still was not enough, so he moved again into the unknown, yearning for more answers. "

].join("\n");

this.position.set(  500 , -2000 , 1400 );
this.cameraPos.set( 1000 , -1000 , 3600 );
this.iPlaneDistance = 1200;

this.cameraPos2 = new THREE.Vector3( 0 , -1000 , 4000 );
this.cameraPos3 = new THREE.Vector3( 3000 , -1000 , 1000 );


this.crystalParams = [
 
 {
  
    note:'heavyBeat',
    height:150

  },

  {
  
    note:'tooth',
    height:200

  },

  {
  
    note:'sniperShivers',
    height:150

  },
  {
    
    note:'darkFast',
    height:200,
    //color1: new THREE.Color( 

  },

 /* {
  
    note:'heavyBeat',
    height:150

  },*/

  {
  
    note:'sniperGlory1',
    height:100

  },

  {
  
    note:'shuffleClick',
    height:100

  },

  {
  
    note:'sniperDetail2',
    height:150

  },

  /* {
  
    note:'sniperGlory1',
    height:200

  },*/

  {
  
    note:'sniperGlory2',
    height:300

  },

  {
  
    note:'sniperDetail1',
    height:350

  },

  {
  
    note:'sniperSnare',
    height:300

  },

  /*{
  
    note:'tooth',
    height:300

  },*/






]
 

this.audio = {};
this.audio.array = [];

this.crystals = [];


}.bind( crystals ));

crystals.addToInitArray( function(){
  
  var f = 'audio/pages/crystals/'

  for( var i = 0; i < this.crystalParams.length; i++ ){
    
    var name = this.crystalParams[i].note;

    this.audio[ name ] = this.loadAudio( name , f + name + '.mp3' );
  
    this.audio.array.push( this.audio[ name ] );

  }

  var f = 'pages/crystals/';

  this.loadShader( 'crystalParticles' , f + 'ss-crystalParticles' , 'simulation' );
  
  this.loadShader( 'crystalParticles' , f + 'vs-crystalParticles' , 'vertex' ); 
  this.loadShader( 'crystalParticles' , f + 'fs-crystalParticles' , 'fragment' ); 
  
  this.loadShader( 'crystalHalo'  , f + 'vs-crystalHalo'  , 'vertex' ); 
  this.loadShader( 'crystalHalo'  , f + 'fs-crystalHalo'  , 'fragment' );
  
  this.loadShader( 'crystal' , f + 'vs-crystal' , 'vertex' ); 
  this.loadShader( 'crystal' , f + 'fs-crystal' , 'fragment' ); 

}.bind( crystals ) );


crystals.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = 1200;



  //G.iPlane.visible = true;

}.bind( crystals ));

// Setting up uniforms gui
crystals.addToStartArray( function(){

  G.tmpV3.set( -500 , 400 , 0 );

  console.log('CRYSTALS STARTED' );

  var globalLightPos = this.position.clone().add( G.tmpV3 );


  this.uniforms = {

    lightPos:{ type:"v3" , value:G.iPoint },


    baseMultiplier: { type:"f" , value : .6 },
    ringMultiplier: { type:"f" , value : 10.3 },
    reflMultiplier: { type:"f" , value : 1 },
    distanceCutoff: { type:"f" , value: 360 },
    distancePow:{ type:"f" , value: 4 },
    texScale:{ type:"f" , value:.000034 },
    normalScale:{ type:"f" , value:.6 },
    extra:{ type:"f" , value:1 }

  }

  // Crystal Params
  var cp = this.gui.addFolder( "Crystal Params" );

  var u = this.uniforms;
  cp.add( u.baseMultiplier , 'value' ).name( 'Base' );
  cp.add( u.ringMultiplier , 'value' ).name( 'Ring' );
  cp.add( u.reflMultiplier , 'value' ).name( 'Reflection' );
  cp.add( u.distanceCutoff , 'value' ).name( 'Distance Cutoff' );
  cp.add( u.distancePow , 'value' ).name( 'Distance Power' );
  cp.add( u.texScale , 'value' ).name( 'Texture Scale' );
  cp.add( u.normalScale , 'value' ).name( 'Normal Scale' );
  cp.add( u.extra , 'value' ).name( 'Extra' );


}.bind( crystals ));

crystals.addToStartArray( function(){

  for( var i = 0; i < this.audio.array.length; i++ ){

    var audio = this.audio.array[i];
    audio.reconnect( this.gain );

  }

}.bind( crystals) );


crystals.addToStartArray( function(){

  G.tmpV3.set( -500 , 400 , 0 );

  var globalLightPos = this.position.clone().add( G.tmpV3 );

  var uniforms = {

    t_audio:G.t_audio,
    t_normal:{ type:"t" , value : G.TEXTURES.norm_moss },

    cameraPos:{ type:"v3" , value : G.camera.position },
    hovered:{ type:"f" , value:0},
    playing:{ type:"f" , value:0},
    selected:{ type:"f" , value:0},
    special:{ type:"f" , value: 0 },
     
    lightPos: this.uniforms.lightPos,

    baseMultiplier: this.uniforms.baseMultiplier,
    ringMultiplier: this.uniforms.ringMultiplier,
    reflMultiplier: this.uniforms.reflMultiplier, 
    distanceCutoff: this.uniforms.distanceCutoff,
    distancePow:    this.uniforms.distancePow,
    texScale:       this.uniforms.texScale,
    normalScale:    this.uniforms.normalScale,
    extra:          this.uniforms.extra 


  }
  var attributes = {

    id:{ type:"f" , value:null },
    edge:{ type:"f" , value:null },
    uv:{ type:"v2" , value:null },

  }
  var mat = new THREE.ShaderMaterial({

    uniforms:uniforms,
    attributes: attributes,
    vertexShader: G.shaders.vs.crystal,
    fragmentShader: G.shaders.fs.crystal,

  }); 

  /*var mat = new THREE.MeshPhongMaterial({
   
    diffuse: 0x000000,
    specular: 0x88ffee,   
    shininess: 80
  });*/

  for( var i = 0; i < 10; i++ ){


    var geo = new CrystalGeo( 30 , 400 , 120, 20 );
  
    var mesh = new THREE.Mesh( geo , mat );

    mesh.position.x = (Math.random() - .5 ) * 2000;
    mesh.position.z = (Math.random() - .5 ) * 2000;
    mesh.rotation.x = Math.PI / 2;

    this.scene.add( mesh );

  }

  var uniforms = {

    t_audio:G.t_audio,
    t_normal:{ type:"t" , value : G.TEXTURES.norm_moss },

    cameraPos:{ type:"v3" , value : G.camera.position },
    hovered:{ type:"f" , value:0},
    playing:{ type:"f" , value:0},
    selected:{ type:"f" , value:1},
    special:{ type:"f" , value: 0 },
     
    lightPos: this.uniforms.lightPos,

    baseMultiplier: this.uniforms.baseMultiplier,
    ringMultiplier: this.uniforms.ringMultiplier,
    reflMultiplier: this.uniforms.reflMultiplier, 
    distanceCutoff: this.uniforms.distanceCutoff,
    distancePow:    this.uniforms.distancePow,
    texScale:       this.uniforms.texScale,
    normalScale:    this.uniforms.normalScale,
    extra:          this.uniforms.extra 


  }
  var attributes = {

    id:{ type:"f" , value:null },
    edge:{ type:"f" , value:null },
    uv:{ type:"v2" , value:null },

  }
  var mat = new THREE.ShaderMaterial({

    uniforms:uniforms,
    attributes: attributes,
    vertexShader: G.shaders.vs.crystal,
    fragmentShader: G.shaders.fs.crystal,

  }); 



  var geo = new CrystalGeo( 120 , 1000 , 3 , 20 );
  var mesh = new THREE.Mesh( geo , mat );

  mesh.position.x = -500;// (Math.random() - .5 ) * 2000;
  mesh.position.z = 0//(Math.random() - .5 ) * 2000;
  mesh.rotation.x = Math.PI / 2;

  this.scene.add( mesh );

  /*for( var i = 0; i < 10; i++ ){

    var geo = new CrystalGeo( 100 , 30 , 10 , 50 );
    var mesh = new THREE.Mesh( geo , mat );

    mesh.position.x = -500;// (Math.random() - .5 ) * 2000;
    mesh.position.y = 200;//(Math.random() - .5 ) * 2000;
    mesh.rotation.x = Math.PI / 2;

   // mesh.rotation. = (Math.random() - .5) * .3;
    mesh.rotation.y = (i / 10 ) * Math.PI * 2;

    this.scene.add( mesh );

    

  }*/

  

}.bind( crystals ));


crystals.addToStartArray( function(){

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 88,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });


  this.looper.crystals = this.crystals;


}.bind( crystals ) );


crystals.addToStartArray( function(){




  var centerCrystals = new THREE.Object3D();

  centerCrystals.position.x = -500;
  centerCrystals.position.y = 100;
  this.scene.add( centerCrystals );



  for( var i = 0; i < 3; i++ ){

    var crystal = new Crystal( this , this.crystalParams[i] );

    crystal.scene.position.x = (1-i) * 50;
    crystal.scene.rotation.z = (i-1)/2;
    this.crystals.push( crystal );

    crystal.activate( centerCrystals ); 
 
    //crystal.select();

  }
  
  
  for( var i = 3; i < this.crystalParams.length; i++ ){

    var s = 1 / (this.crystalParams.length-3);
    var x = (i -3) * s;

    var shift = Math.floor( x * 2 );

    var crystal = new Crystal( this , this.crystalParams[i] );


    var t = 2 * Math.PI * x;

    var rX = 400 * Math.cos( t );
    var rY = 400 * Math.sin( t );



    //var rX =1 + ( Math.random() -.5 ) * .1;
    //var rZ =1 + ( Math.random() -.5 ) * .1;
    
    crystal.scene.position.x =rX - 500;//( x-.25 + s*.5) * 1000 * rX - (500 * shift);
    crystal.scene.position.z =rY //(shift) * 200 * rZ;
    crystal.scene.position.y = 100;

    this.crystals.push( crystal );

    crystal.activate( this.scene );
 
    //crystal.select();

  }

  this.crystals[5].select();

 
}.bind( crystals ) );

crystals.addToStartArray( function(){
  
  this.text = new PhysicsText( this.textChunk );

  this.looper.start();

}.bind( crystals ) );




crystals.addToStartArray( function(){
  this.text2 = new PhysicsText( this.textChunk2 );
}.bind( crystals ) );

crystals.addToStartArray( function(){
  this.text3 = new PhysicsText( this.textChunk3 );
}.bind( crystals ) );

crystals.addToActivateArray( function(){

    
  G.iPlane.faceCamera = false;
  
  G.tmpV3.set( 0 , 450 , 0 );

  G.iPlane.position.copy( this.position.clone().add(G.tmpV3 ));
  G.tmpV3.set( 0 , 451 , 0 )
  G.iPlane.lookAt( this.position.clone().add( G.tmpV3 ) );

  //this.looper.start();
  this.text.activate();


  var offset = G.pageTurnerOffset;

  var percentTilEnd = 1 - this.looper.percentOfMeasure;
  var timeTilEnd = percentTilEnd * this.looper.measureLength;


  var callback = function(){

    this.text.kill( 5000 );

    this.tweenCamera( this.cameraPos2 , (timeTilEnd-.01) * 1000 , function(){

      this.text2.activate();

      var offset = G.pageTurnerOffset;

       for( var i = 0; i < this.crystals.length; i++ ){

          var c = this.crystals[i];
          if( i !== 0 && i !== 1 && i !== 2 && i !== 3 && i !== 9){
            
            if( !c.selected ) c.select();
          
          }else{

            if( c.selected ) c.select();
          }

        }


      var callback = function(){

        this.text2.kill( 3000 );


        var percentTilEnd = 1 - this.looper.percentOfMeasure;
        var timeTilEnd = percentTilEnd * this.looper.measureLength;

        this.tweenCamera( this.cameraPos3,  (timeTilEnd-.01) * 1000 , function(){
          
         
          console.log('TWESNS');
          this.text3.activate();
          this.endMesh.add( this );


          for( var i = 0; i < this.crystals.length; i++ ){

            var c = this.crystals[i];
            if(  i !== 3 && i !== 9 ){
              if( !c.selected ) c.select();
            }else{
              if( c.selected ) c.select();
            }

          }

        }.bind( this ));
      }.bind( this);

      this.transitionMesh2 = this.createTurnerMesh( offset , callback );
      this.scene.add( this.transitionMesh2 );

    }.bind( this  ));
  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );
  this.scene.add( this.transitionMesh1 );

 // this.endMesh.add( this );

}.bind( crystals ));

crystals.addToAllUpdateArrays( function(){

  for( var i = 0; i < this.crystals.length; i++ ){
    this.crystals[i].update();
  }
  
  this.text.update();
  this.text2.update();
  this.text3.update();

}.bind( crystals ));

crystals.addToDeactivateArray( function(){

  G.iPlane.faceCamera = true;
  this.text3.kill();

}.bind( crystals) );

crystals.addToEndArray( function(){

  this.looper.end();

}.bind( crystals ));

