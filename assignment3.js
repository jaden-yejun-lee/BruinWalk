import { defs, tiny } from './examples/common.js';
import { VehicleManager } from './examples/common.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
const red = color(1, 0, 0, 1); // Red color, fully opaque
const white = color(1, 1, 1, 1); // White color, fully opaque
const grey = color(0.5, 0.5, 0.5, 1);

export class Assignment3 extends Scene {
    constructor() {
        super();

        this.shapes = {
            car: new defs.Car(),
            //starship: new defs.Starship(),
            rock: new defs.Rock(),
            tree: new defs.Tree(),
            floor: new defs.Floor(),
            bear_body: new defs.Bear_Body(),
            bear_face: new defs.Bear_Face(),
            bear_limbs1: new defs.Bear_Limbs1(),
            bear_limbs2: new defs.Bear_Limbs2(),
        };

        // *** Materials
        this.materials = {
            car: new Material(new defs.Phong_Shader(),
                { ambient: 0, diffusivity: 1, color: hex_color("#F0F0F0"), specularity: 1 }),
            starship: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, diffusivity: 0.5, color: hex_color("#F0F0F0") }),
            rock: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("5A5A5A")}),
            tree_stump: new Material(new defs.Phong_Shader(),
                {color: hex_color("8B4513")}),
            tree_top: new Material(new defs.Phong_Shader(),
                {color: hex_color("42692F")}),
            floor: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0.5, specularity: 1, color: hex_color("90EE90")}),
            bear: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, diffusivity: 0.5, color: hex_color("#954535") }),
        }

        this.direction = 0;
        this.x_movement = 0;
        this.z_movement = 0;


        const starship_shapes = {
            body: new defs.Cube(),
            pole: new defs.Capped_Cylinder(4, 4),
            flag: new defs.Square(),
            wheel: new defs.Torus(15, 15)
        };
        const starship_materials = {
            starship: new Material(new defs.Phong_Shader(), { ambient: 0, diffusivity: 1, color: hex_color("#F0F0F0"), specularity: 1 }),
            body: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: grey }),
            pole: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: white }),
            flag: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: red }),
            wheel: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: hex_color("#000000") }),
        };

        const starship_path1 = { start: vec3(-10, 0, 2), end: vec3(10, 0, 2), speed: 0.5 };
        const starship_path2 = { start: vec3(10, 0, 4), end: vec3(-10, 0, 4), speed: 0.5 };


        const van_shapes = {
            body: new defs.Cube(),
            wheel: new defs.Torus(15, 15),
        };

        const van_materials = {
            body: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: red }),
            wheel: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: hex_color("#000000") }),
        };

        const van_path = { start: vec3(10, 0, 2), end: vec3(-10, 0, 2), speed: 0.5 };
        const van_direction = vec3(-1, 0, 0); // For van going right to left

        const car_shapes = {
            body: new defs.Cube(),
            hood: new defs.Cube(),
            wheel: new defs.Torus(15, 15)
        };

        const car_materials = {
            body: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: red }),
            hood: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: hex_color("#F0F000") }),
                wheel: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.1, specularity: 0.1, color: hex_color("#000000") }),
            // Define other materials if needed
        };

        const car_path = { start: vec3(10, 0, 2), end: vec3(-10, 0, 2), speed: 0.5 };
        const car_direction = vec3(1, 0, 0);


        this.vehicle_manager = new VehicleManager();

        const starship1 = new defs.Starship(starship_materials, starship_path1, starship_shapes);
        const starship2 = new defs.Starship(starship_materials, starship_path2, starship_shapes, vec3(-1, 0, 0));
        const van = new defs.Van(van_materials, van_path, van_shapes, van_direction);
        const car = new defs.Car(car_materials, car_path, car_shapes, car_direction);

        //this.vehicle_manager.add_vehicle(starship1);
        //this.vehicle_manager.add_vehicle(starship2);
        //this.vehicle_manager.add_vehicle(van);
        this.vehicle_manager.add_vehicle(car);


        // Add vehicles to the manager

        // adjusted camera back to get more complete view of field
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 40), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    draw_bear(context, program_state, mt, t) {
        let angle = this.direction*Math.PI/2; //default front
        if (this.x_movement > 40) //x movement is bound by 0 to 2*x-width of screen
            this.x_movement = 40;
        if (this.x_movement < 0)
            this.x_movement = 0;
        if (this.z_movement > 20)//z movement is bound by -z-width to +z-width of screen
            this.z_movement = 20;
        if (this.z_movement < -20)
            this.z_movement = -20;
        let d_x = this.x_movement;
        let d_z = this.z_movement;
        mt = mt.times(Mat4.translation(d_x, 0, d_z));
        mt = mt.times(Mat4.rotation(angle, 0, 1, 0));
        let mt2 = mt;
        let mt1 = mt;

        let theta = 0.2*Math.sin(4*Math.PI*t);
        mt1 = mt1.times(Mat4.rotation(theta,1, 0, 0));
        mt2 = mt2.times(Mat4.rotation(-theta,1, 0, 0));
        this.shapes.bear_body.draw(context, program_state, mt, this.materials.bear);
        this.shapes.bear_face.draw(context, program_state, mt, this.materials.bear.override({color: hex_color("#000000")}));
        this.shapes.bear_limbs1.draw(context, program_state, mt1, this.materials.bear);
        this.shapes.bear_limbs2.draw(context, program_state, mt2, this.materials.bear);

    }
    make_control_panel() {
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => (this.initial_camera_location));
        this.new_line();
        this.key_triggered_button("Up", ['ArrowUp'], () => {
            this.z_movement = this.z_movement - 1;
            this.direction = 2;
            this.run = 1;
        });
        this.key_triggered_button("Down", ['ArrowDown'], () => {
            this.z_movement = this.z_movement + 1;
            this.direction = 0;
            this.run = 1;});
        this.key_triggered_button("Left", ['ArrowLeft'], () => {
            this.x_movement = this.x_movement - 1;
            this.direction = 3;
            this.run = 1;});
        this.key_triggered_button("Right", ['ArrowRight'], () => {
            this.x_movement = this.x_movement + 1;
            this.direction = 1;
            this.run = 1;});
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }
        const t = program_state.animation_time / 1000; // Current time in seconds

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        let model_transform = Mat4.identity();

        const light_pos = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_pos, color(1, 1, 1, 1), 1000)];

        //Drawing bear:
        let bear_mt = Mat4.identity();
        bear_mt = bear_mt.times(Mat4.translation(-20,2,0));
        this.draw_bear(context, program_state, bear_mt, t);
        //this.vehicle_manager.update_and_draw(context, program_state);

        // draws floor
        this.shapes.floor.draw(context, program_state, Mat4.identity(), this.materials.floor);

        // draws rocks
        let rock_transform = Mat4.identity();
        this.shapes.rock.draw(context, program_state, rock_transform, this.materials.rock);
        //rock_transform = rock_transform.times(Mat4.translation(-8,0,0));
        //this.shapes.rock.draw(context, program_state, rock_transform, this.materials.rock);

        // draws trees
        let tree_transform = Mat4.identity()
            .times(Mat4.translation(10, 0, 0));
        this.shapes.tree.draw(context, program_state, tree_transform, this.materials.tree_stump, this.materials.tree_top);
        //tree_transform = Mat4.identity().times(Mat4.translation(4,0,0));
        //this.shapes.tree.draw(context, program_state, tree_transform, this.materials.tree_stump, this.materials.tree_top);

        let i = 0;

        // Creates a row of rocks on top side of floor
        for (i = -20; i <= 20; i += 2) {
            rock_transform = Mat4.identity();
            rock_transform = rock_transform.times(Mat4.translation(i, 0, -20));
            this.shapes.rock.draw(context, program_state, rock_transform, this.materials.rock)
        }

        // Creates a row of trees on right side of floor
        for (i = -18; i <= 20; i += 2) {
            tree_transform = Mat4.identity();
            tree_transform = tree_transform.times(Mat4.translation(20, 0, i));
            this.shapes.tree.draw(context, program_state, tree_transform, this.materials.tree_stump, this.materials.tree_top)
        }

        // for (let path of this.starship_paths) {
        //     // Calculate the current position along the path
        //     const position_along_path = (t * path.speed) % 1; // This will be a value between 0 and 1
        //     // Interpolate between the start and end points based on position_along_path
        //     let model_transform = Mat4.identity()
        //         .times(Mat4.translation(...path.start.mix(path.end, position_along_path)))
        //         .times(Mat4.rotation(Math.PI / 2, 0, 1, 0)) 
        //         .times(Mat4.rotation(Math.PI / 2, 0, 1, 0)) 
        //         .times(Mat4.rotation(Math.PI / 2, -1, 0, 0));

        //     // Draw the starship at the current position
        //     this.shapes.starship.draw(context, program_state, model_transform, this.materials.starship);
        // }
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

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = { color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
          center = model_transform * vec4(0.0, 0.0, 0.0, 1.0);
          point_position = model_transform * vec4(position, 1.0);
          gl_Position = projection_camera_model_transform * vec4(position, 1.0);          
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        return this.shared_glsl_code() + `
        void main(){
            float frequency_multiplier = 30.0; 
            float scalar = sin(frequency_multiplier * distance(point_position.xyz, center.xyz));
            vec4 band_color = vec4(0.65, 0.42, 0.18, 1.0); // Adjusted color for a different shade
            gl_FragColor = scalar * band_color;
        }`;
    }
}
