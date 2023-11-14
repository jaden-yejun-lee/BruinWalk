class CarCube extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        this.arrays.position = [
            // Back face
            vec3(-0.5, -0.5, -0.5), vec3(0.5, -0.5, -0.5), vec3(0.5, 0.5, -0.5), vec3(-0.5, 0.5, -0.5),
            // Front face
            vec3(-0.5, -0.5, 0.5), vec3(0.5, -0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(-0.5, 0.5, 0.5),
            // Top face
            vec3(-0.5, 0.5, -0.5), vec3(0.5, 0.5, -0.5), vec3(0.5, 0.5, 0.5), vec3(-0.5, 0.5, 0.5),
            // Bottom face
            vec3(-0.5, -0.5, -0.5), vec3(0.5, -0.5, -0.5), vec3(0.5, -0.5, 0.5), vec3(-0.5, -0.5, 0.5),
            // Right face
            vec3(0.5, -0.5, -0.5), vec3(0.5, 0.5, -0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, -0.5, 0.5),
            // Left face
            vec3(-0.5, -0.5, -0.5), vec3(-0.5, 0.5, -0.5), vec3(-0.5, 0.5, 0.5), vec3(-0.5, -0.5, 0.5)
        ];
        this.arrays.normal = [
            // Back face
            vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1),
            // Front face
            vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            // Top face
            vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0),
            // Bottom face
            vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0),
            // Right face
            vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0),
            // Left face
            vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0)
        ];

        this.arrays.texture_coord = [
            // Back face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Front face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Top face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Bottom face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Right face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Left face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1)
        ];



        // Define the indices for the cube, 2 triangles per face
        this.indices = [
            0, 1, 2, 0, 2, 3,     // Back face
            4, 5, 6, 4, 6, 7,     // Front face
            8, 9, 10, 8, 10, 11,  // Top face
            12, 13, 14, 12, 14, 15, // Bottom face
            16, 17, 18, 16, 18, 19, // Right face
            20, 21, 22, 20, 22, 23  // Left face
        ];
    }
}

class Car {
    constructor() {
        this.body = new CarCube(); // The main body of the car
    }

    // Function to draw the car using the provided context and graphics state
    draw(context, graphics_state) {
        // The transformation that scales the cube into the car's body dimensions
        // Assuming the cube is 1x1x1, we want to scale it to 2x2x3
        let body_transform = Mat4.identity()
            .times(Mat4.scale(1, 1, 1.5)); // Scale to make the length 3, width 2, and height 2

        // Since the body should be lifted off the ground by the wheels, translate it upwards
        // Assuming the wheels are about 1 unit in diameter, and we want some clearance (say 0.25 units),
        // we would lift the body by half the wheel's diameter plus the clearance.
        body_transform = body_transform.times(Mat4.translation(0, 0.625, 0)); // Adjust Y translation as needed

        // Draw the body with the transformed dimensions
        this.body.draw(context, graphics_state, body_transform, new Material(this.shader)); 
    }
}


