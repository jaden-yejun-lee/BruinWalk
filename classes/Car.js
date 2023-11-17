import { defs, tiny } from '../examples/common.js';
const { vec, vec3, vec4, color, Mat4, Material, Shape } = tiny;

export class CarCube extends Shape {
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

export class Car {
    constructor() {
        this.body = new CarCube(); // The main body of the car
    }

    // Function to draw the car using the provided context and graphics state
    draw(context, graphics_state) {
        // Car body size: 2x2x3 units (WxHxL)
        // Wheel diameter: 0.5 units, clearance: 0.1 units
        // Lift the car body by half the wheel's diameter plus clearance
        let lift_height = 0.5 / 2 + 0.1;

        // Create a transformation matrix for the car body
        let body_transform = Mat4.identity()
            .times(Mat4.translation(0, lift_height, 0))  // Lift the car body up
            .times(Mat4.scale(1, 1, 1.5)); // Scale to make the car body 2x2x3 units

        // Draw the car body with the transformed dimensions and material
        this.shapes.Car.draw(context, program_state, body_transform, material);
    }
}


