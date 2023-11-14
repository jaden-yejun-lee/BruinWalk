import { defs, tiny } from './examples/common.js';
import { CarCube, Car } from './classes/Car.js'; // Adjust the relative path as necessary

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } = tiny;


export class MainProgram extends Scene {
    constructor() {
        super();
        // Shapes dictionary
        this.shapes = {
            car_cube: new CarCube(), 
        };

        // Materials dictionary
        this.materials = {
            car: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, diffusivity: 1, color: hex_color("#FF0000") }), 
        };

        this.car = new Car();

    }

    make_control_panel() {

    }

    display(context, program_state) {
        this.car.draw(context, program_state, this.shapes.car_cube, this.materials.car);
    }
}





