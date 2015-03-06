/*global famous*/
// import dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var ImageSurface = famous.surfaces.ImageSurface;
var Surface = famous.core.Surface;
var PhysicsEngine = famous.physics.PhysicsEngine;
var Particle = famous.physics.bodies.Particle;
var Drag = famous.physics.forces.Drag;
var RepulsionForce = famous.physics.forces.Repulsion;

// Create orbit object
var circularOrbit = {};

// Add methods to circularOrbit
circularOrbit.distance = function(x1, y1, z1, x2, y2, z2){
  var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  return distance;
};

circularOrbit.gravity = function(altitude, velocity){
  var k = 1; // This is a constant that needs to be determined, currently works with 
  var gravity = k * velocity * Math.sqrt(altitude);
  console.log('gravity: ', gravity);
  return gravity;
};

// Create orbit variables
var altitudeInitial = 100;
var velocityInitial = 0.1;


// create the main context
var mainContext = Engine.createContext();

var physics = new PhysicsEngine();

var planetSurface = new Surface({
  properties: {
    backgroundColor: 'blue'
  }
})

var planetParticle = new Particle();

physics.addBody(planetParticle);

var planetModifier = new Modifier({
  size: [100, 100],
  align: [0.5, 0.5],
  origin: [0.5, 0.5],
  transform: function() {
    return planetParticle.getTransform();
  }
});

var satelliteSurface = new Surface({
  properties: {
    backgroundColor: 'gray'
  }
});

var satelliteParticle = new Particle({
  position: [0, -altitudeInitial, 0]
});

physics.addBody(satelliteParticle);

var satelliteModifier = new Modifier({
  size: [25, 25],
  align: [0.5, 0.5],
  origin: [0.5, 0.5],
  transform: function() {
    return satelliteParticle.getTransform();
  }
});

var gravity = new RepulsionForce({
  strength: -circularOrbit.gravity(100, 0.1)
  // strength: -2
});

// var dragForce = new Drag({
//   strength: 0.001
// })

physics.attach(gravity, satelliteParticle, planetParticle);

satelliteParticle.setVelocity([velocityInitial, 0, 0]);

mainContext.add(planetModifier).add(planetSurface);

mainContext.add(satelliteModifier).add(satelliteSurface);
// your app here
var logo = new ImageSurface({
    size: [200, 200],
    content: 'http://code.famo.us/assets/famous_logo.png',
    classes: ['double-sided']
});

var initialTime = Date.now();
var centerSpinModifier = new Modifier({
    origin: [0.5, 0.5],
    align: [0.5, 0.5],
    transform : function () {
        return Transform.rotateY(.002 * (Date.now() - initialTime));
    }
});


// mainContext.add(centerSpinModifier).add(logo);

// Try to put it all together
