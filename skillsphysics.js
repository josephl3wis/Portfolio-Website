// Create the simulation function
function initSimulation() {
  // Import Matter.js modules
  var Engine = Matter.Engine,
      Render = Matter.Render,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

  // Create the engine
  var engine = Engine.create(),
      world = engine.world;

  // Get the container element
  var containerElement = document.querySelector(".tag-canvas");

  // Calculate container dimensions
  var containerWidth = containerElement.clientWidth + 2;
  var containerHeight = containerElement.clientHeight + 2;

  // Create the renderer
  var render = Render.create({
    element: containerElement,
    engine: engine,
    options: {
      width: containerWidth,
      height: containerHeight,
      pixelRatio: 2,
      background: "transparent",
      border: "none",
      wireframes: false
    }
  });

  // Create the static bodies
  var ground = Bodies.rectangle(containerWidth / 2 + 160, containerHeight + 80, containerWidth + 320, 160, { render: { fillStyle: "#000000" }, isStatic: true });
  var wallLeft = Bodies.rectangle(-80, containerHeight / 2, 160, containerHeight, { isStatic: true });
  var wallRight = Bodies.rectangle(containerWidth + 80, containerHeight / 2, 160, 1200, { isStatic: true });
  var roof = Bodies.rectangle(containerWidth / 2 + 160, -80, containerWidth + 320, 160, { isStatic: true });

  // Add the static bodies to the world
  World.add(engine.world, [ground, wallLeft, wallRight, roof]);

  // Create the mouse
  var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

  // Add mouse constraint to the world
  World.add(world, mouseConstraint);

  // Update mouse
  render.mouse = mouse;

  // Remove default mouse wheel listeners
  mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
  mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

  // Track mouse events
  let click = false;

  document.addEventListener("mousedown", () => (click = true));
  document.addEventListener("mousemove", () => (click = false));
  document.addEventListener("mouseup", () =>
    console.log(click ? "click" : "drag")
  );

  // Open hyperlink on mouseup event
  Events.on(mouseConstraint, "mouseup", function (event) {
    var mouseConstraint = event.source;
    var bodies = engine.world.bodies;
    if (!mouseConstraint.bodyB) {
      for (i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        if (click === true) {
          if (
            Matter.Bounds.contains(body.bounds, mouseConstraint.mouse.position)
          ) {
            var bodyUrl = body.url;
            console.log("Body.Url >> " + bodyUrl);
            if (bodyUrl != undefined) {
              window.open(bodyUrl, "_blank");
              console.log("Hyperlink was opened");
            }
            break;
          }
        }
      }
    }
  });

  // Run the engine and renderer
  Engine.run(engine);
  Render.run(render);
}

// Select the container element
var containerElement = document.querySelector(".tag-canvas");

// Create an intersection observer
var observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      initSimulation();
      observer.disconnect();
    }
  });
}, {});

// Observe the container element
observer.observe(containerElement);
