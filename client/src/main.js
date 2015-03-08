// client/src/main.js

// Import dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var ImageSurface = famous.surfaces.ImageSurface;
var Surface = famous.core.Surface;
var PhysicsEngine = famous.physics.PhysicsEngine;
var Particle = famous.physics.bodies.Particle;
var Drag = famous.physics.forces.Drag;
var RepulsionForce = famous.physics.forces.Repulsion;
var Timer = famous.utilities.Timer;

// Use dat physics!
var physics = new PhysicsEngine();

// create the main context
var mainContext = Engine.createContext();


// ========== Setup orbital equations ========== //

// Create orbit objects
var circularOrbit = {};
var ellipticalOrbit = {};

// Add methods to circularOrbit
// Inputs are ojects with keys x, y, and z and corresponding position value pairs
// Ex firstParticle = {x: 12, y: 2, z: -4.2};
circularOrbit.distance = function(firstParticle, secondParticle){
  var distance = Math.sqrt(Math.pow(secondParticle.x - firstParticle.x, 2) + Math.pow(secondParticle.y - firstParticle.y, 2) + Math.pow(secondParticle.z - firstParticle.z, 2));
  return distance;
};

// Determine the gravity given altitude and velocity
circularOrbit.gravity = function(altitude, velocity){
  var k = 1; // This is a constant that needs to be determined, currently works with a reasonable error
  var gravity = k * velocity * velocity * altitude;
  console.log('gravity: ', gravity);
  return gravity;
};

// Determine the altitude given gravity and velocity
circularOrbit.altitude = function(gravity, velocity){
  var altitude = gravity / (velocity * velocity);
  console.log('altitude: ', altitude);
  return altitude;
};

// Determine the altitude given gravity and velocity
circularOrbit.velocity = function(altitude, gravity){
  var velocity = Math.sqrt(gravity / altitude);
  console.log('velocity: ', velocity);
  return velocity;
};

// Create orbit variables
var altitudeInitial = 400;
var velocityInitial = 0.2;


// ========== Setup planet ========== //

var planetSurface = new Surface({
  properties: {
    backgroundColor: 'blue'
  }
});

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


// ========== Setup satellite ========== //

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


// ========== Awesome physics ========== //

// Define the gravity that will be applied
var gravity = new RepulsionForce({
  // Note: this becomes unstable at large velocities
  // A possible way to deal with this is to use the GRAVITY method
  // See Famo.us API docs http://famo.us/docs/api/latest/physics/forces/Repulsion
  // Also look at the repulsion source code https://github.com/Famous/famous/blob/develop/src/physics/forces/Repulsion.js

  strength: -circularOrbit.gravity(altitudeInitial, velocityInitial)
});

// Apply gravity to the planet and the satellite
physics.attach(gravity, satelliteParticle, planetParticle);

// Give the satellite an initial velocity
satelliteParticle.setVelocity([velocityInitial, 0, 0]);

mainContext.add(planetModifier).add(planetSurface);
mainContext.add(satelliteModifier).add(satelliteSurface);

// Display altitude
Timer.every(function(){
  console.log('Altitude: ', circularOrbit.distance(satelliteParticle.position, planetParticle.position))
}, 60);



