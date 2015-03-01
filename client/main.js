var Engine = famous.core.Engine
var Surface = famous.core.Surfaces
var Modifier = famous.core.Modifier
var PhysicsEngine = famous.physics.PhysicsEngine
var Particle = famous.physics.bodies.Particle

var context = Engine.createContext();

var physics = new PhysicsEngine();

var planetSurface = new Surface({
  properties: {
    backgroundColor: 'blue'
  }
});

var planetParticle = new Particle({
  position: [0, 0, 0]
});

physics.addBody(planetParticle);

var planetModifier = new Modifier({
  size: [100, 100],
  align: [0.5, 0.5],
  origin: [0.5, 0.5],
  transform: function() {
    return planetParticle.getTransform();
  }
});

planetParticle.setVelocity([0.1, 0.1, 0]);

context.add(planetModifier).add(planetSurface);
