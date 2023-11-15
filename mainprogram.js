import { defs, tiny } from './examples/common.js';
//import { CarCube, Car } from './classes/Car.js'; // Adjust the relative path as necessary
import {RockCube, Rock} from './classes/Rock.js';
import {FloorCube, Floor} from './classes/Floor.js';
import {TreeCube, Tree, Cylindrical_Tube} from './classes/Tree.js';

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } = tiny;


export class MainProgram extends Scene {
    constructor() {
        console.log("this.tree.draw");
        super();
        // Shapes dictionary
        this.shapes = {
            //car_cube: new CarCube(),
            rock_cube: new RockCube(),
            sphereSubdivision4: new defs.Subdivision_Sphere(4),
            floor: new FloorCube(),
            tree_stump: new Cylindrical_Tube(),
            tree_top: new TreeCube()
        };

        // Materials dictionary
        this.materials = {
            //car: new Material(new defs.Phong_Shader(),
                //{ ambient: 0.5, diffusivity: 1, color: hex_color("#FF0000") }),
            rock: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("5A5A5A")}),
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: (1,1,1,1)}),
            floor: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("90EE90")}),
            tree_stump: new Material(new defs.Phong_Shader(),
                {color: hex_color("8B4513")}),
            tree_top: new Material(new defs.Phong_Shader(),
                {color: hex_color("42692F")})
        };

        //this.car = new Car();
        this.rock = new Rock();
        this.floor = new Floor();
        this.tree = new Tree();

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

    }

    make_control_panel() {

    }

    display(context, program_state) {


        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }


        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        // temporary sun/light source
        let sun_transform = Mat4.identity();
        const sunPosition = vec4(0,5,0,1);
        let radius = 2;
        let sunColor = color(1, 1, 1, 1);
        program_state.lights = [new Light(sunPosition, sunColor, (10**radius))];
        sun_transform = sun_transform.times( Mat4.scale(radius, radius, radius));
        sun_transform = sun_transform.times(Mat4.translation(0,5,0));
        this.shapes.sphereSubdivision4.draw(context, program_state, sun_transform, this.materials.sun.override({color: sunColor}));


        console.log('yes')
        //this.car.draw(context, program_state, this.shapes.car_cube, this.materials.car);
        this.rock.draw(context, program_state, this.shapes.rock_cube, this.materials.rock);
        this.floor.draw(context, program_state, this.shapes.floor, this.materials.floor);

        this.tree.draw(context, program_state, this.shapes, this.materials);

    }
}





