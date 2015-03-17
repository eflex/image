/**
  Example:
  var image=require('image'); 

    var img = new image(file);

    img.resize(w,h);
    img.gravity('Center');//[NorthWest, North, NorthEast, West, Center, East, SouthWest, South, SouthEast]
    img.crop(w,h);
    img.quality(100);//{0 to 100}
    var info = yield img.identify();
    var result = yield img.write(dest)
    var result = yield img.stream(writeStream)
    .....

  *note:
    for more information check
      http://aheckmann.github.io/gm/docs.html
*/


var path = require('path');
var co = require('co');
var imageMagick = require('gm').subClass({ imageMagick: true });


var GM = module.exports = function (image_path){
  if(!(this instanceof GM)) return new GM(image_path);
  this.image = imageMagick(image_path);
  // return this;
}

/* return the gm intance */
GM.prototype.toObject = function (){
  return this.image
}

GM.prototype.resize = function (w,h){
  this.image.resize(w,h);
  return this;
}

GM.prototype.crop = function(w,h){
  this.image.crop(w,h);
  return this;
}

GM.prototype.gravity = function(loc){
  if(!loc) loc = 'Center';
  this.image.gravity(loc);
  return this;
}

GM.prototype.quality = function(qty){
  if(!qty) qty = 90;
  this.image.quality(qty);
  return this;
}


/* identify */
GM.prototype.identify= function (){
  var image = this.image;
  return function(cb){
    image.identify(cb);
  }
}

/* yieldable write */
GM.prototype.write = function *(dest_path){
  try{
    yield write(this.image, dest_path)
    return {message: 'success'}
  }catch(e){
    return {message: 'fail', error: e }
  }

  /* thunkified gm.write */
  function write(gm, dest){
    return function(cb){
      gm.write(dest, cb);
    }
  }
}


/**
  yieldable stream
  if no writable stream provided then returns a readable stream
*/
GM.prototype.stream = function *(writable_stream, type){
  if(!writable_stream) return this.image.stream(type);

  try{
    this.image.stream(type).pipe(writable_stream)
    return {message: 'success'};
  }catch(e){
    return {message: 'fail', error: e}
  }
}