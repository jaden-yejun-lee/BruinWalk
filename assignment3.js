import { defs, tiny } from './examples/common.js';
//import { CarCube, Car } from './classes/Car.js'; // Adjust the relative path as necessary
import { RockCube, Rock } from './classes/Rock.js';
import { FloorCube, Floor } from './classes/Floor.js';
import { TreeCube, Tree, Cylindrical_Tube } from './classes/Tree.js';

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } = tiny;


export class Assignment3 extends Scene {
    constructor() {
        super();
        // Shapes dictionary
        this.shapes = {
            //car_cube: new CarCube(),
            rock_cube: new RockCube(),
            sphereSubdivision4: new defs.Subdivision_Sphere(4),
            floor: new FloorCube(),
            tree_stump: new Cylindrical_Tube(),
            tree_top: new TreeCube(),
            bear_body: new defs.Bear_Body(),
            bear_face: new defs.Bear_Face(),
            bear_limbs1: new defs.Bear_Limbs1(),
            bear_limbs2: new defs.Bear_Limbs2(),


        };

        // Materials dictionary
        this.materials = {
            //car: new Material(new defs.Phong_Shader(),
            //{ ambient: 0.5, diffusivity: 1, color: hex_color("#FF0000") }),
            rock: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("5A5A5A") }),
            sun: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: (1, 1, 1, 1) }),
            floor: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("90EE90") }),
            tree_stump: new Material(new defs.Phong_Shader(),
                { color: hex_color("8B4513") }),
            tree_top: new Material(new defs.Phong_Shader(),
                { color: hex_color("42692F") })
        };

        //this.car = new Car();
        this.rock = new Rock();
        this.floor = new Floor();
        this.tree = new Tree();

        bear: new Material(new defs.Phong_Shader(),
            { ambient: 0.5, diffusivity: 0.5, color: hex_color("#954535") }),



            this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

    }

    make_control_panel() {

    }

    display(context, program_state) {



        //this.car.draw(context, program_state, this.shapes.car_cube, this.materials.car);
        this.rock.draw(context, program_state, this.shapes.rock_cube, this.materials.rock);
        this.floor.draw(context, program_state, this.shapes.floor, this.materials.floor);
        this.tree.draw(context, program_state, this.shapes, this.materials);




        let model_transform = Mat4.identity();

        const light_pos = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_pos, color(1, 1, 1, 1), 1000)];

        //this.shapes.car_cube.draw(context, program_state, model_transform, this.materials.car_cube);
        let testbearmt = Mat4.identity();
        this.shapes.bear_body.draw(context, program_state, testbearmt, this.materials.bear);
        this.shapes.bear_face.draw(context, program_state, testbearmt, this.materials.bear.override({ color: hex_color("#000000") }));
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        let theta = 0.2 * Math.sin(4 * Math.PI * t);
        let testbearmt2 = testbearmt;
        testbearmt = testbearmt.times(Mat4.rotation(theta, 1, 0, 0));
        this.shapes.bear_limbs1.draw(context, program_state, testbearmt, this.materials.bear);
        testbearmt2 = testbearmt2.times(Mat4.rotation(-theta, 1, 0, 0));
        this.shapes.bear_limbs2.draw(context, program_state, testbearmt2, this.materials.bear);

    }
}

class Gouraud_Shader extends Shader { //edit here?
    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_poss_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;

        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_poss_or_vectors[i].xyz - 
                                               light_poss_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() { //NOT SURE IF THIS IS RIGHT
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

                vertex_color = vec4(shape_color.xyz * ambient, shape_color.w);
                vertex_color.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() { //NOT SURE IF THIS IS RIGHT
        return this.shared_glsl_code() + `
            void main(){
                gl_FragColor = vertex_color;
                return;
            } `;
    }

    send_material(gl, gpu, material) {

        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);

        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_poss_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_poss_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_poss_or_vectors, light_poss_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }


}






