import { defs, tiny } from '../examples/common.js';
const { vec, vec3, vec4, color, Mat4, Material, Shape, Vector3, Vector, hex_color } = tiny;



const Grid_Patch = defs.Grid_Patch =
    class Grid_Patch extends Shape {
        // A grid of rows and columns you can distort. A tesselation of triangles connects the
        // points, generated with a certain predictable pattern of indices.  Two callbacks
        // allow you to dynamically define how to reach the next row or column.
        constructor(rows, columns, next_row_function, next_column_function, texture_coord_range = [[0, rows], [0, columns]]) {

            super("position", "normal", "texture_coord");
            let points = [];
            for (let r = 0; r <= rows; r++) {
                points.push(new Array(columns + 1));
                // Allocate a 2D array.
                // Use next_row_function to generate the start point of each row. Pass in the progress ratio,
                // and the previous point if it existed.
                points[r][0] = next_row_function(r / rows, points[r - 1] && points[r - 1][0]);
            }
            for (let r = 0; r <= rows; r++) {
                // From those, use next_column function to generate the remaining points:
                for (let c = 0; c <= columns; c++) {
                    if (c > 0) points[r][c] = next_column_function(c / columns, points[r][c - 1], r / rows);

                    this.arrays.position.push(points[r][c]);
                    // Interpolate texture coords from a provided range.
                    const a1 = c / columns, a2 = r / rows, x_range = texture_coord_range[0],
                        y_range = texture_coord_range[1];
                    this.arrays.texture_coord.push(vec((a1) * x_range[1] + (1 - a1) * x_range[0], (a2) * y_range[1] + (1 - a2) * y_range[0]));
                }
            }

            for (let r = 0; r <= rows; r++) {
                // Generate normals by averaging the cross products of all defined neighbor pairs.
                for (let c = 0; c <= columns; c++) {
                    let curr = points[r][c], neighbors = new Array(4), normal = vec3(0, 0, 0);
                    // Store each neighbor by rotational order.
                    for (let [i, dir] of [[-1, 0], [0, 1], [1, 0], [0, -1]].entries())
                        neighbors[i] = points[r + dir[1]] && points[r + dir[1]][c + dir[0]];
                    // Leave "undefined" in the array wherever
                    // we hit a boundary.
                    // Take cross-products of pairs of neighbors, proceeding
                    // a consistent rotational direction through the pairs:
                    for (let i = 0; i < 4; i++)
                        if (neighbors[i] && neighbors[(i + 1) % 4])
                            normal = normal.plus(neighbors[i].minus(curr).cross(neighbors[(i + 1) % 4].minus(curr)));
                    normal.normalize();
                    // Normalize the sum to get the average vector.
                    // Store the normal if it's valid (not NaN or zero length), otherwise use a default:
                    if (normal.every(x => x == x) && normal.norm() > .01) this.arrays.normal.push(normal.copy());
                    else this.arrays.normal.push(vec3(0, 0, 1));
                }
            }


            for (let h = 0; h < rows; h++) {
                // Generate a sequence like this (if #columns is 10):
                for (let i = 0; i < 2 * columns; i++)    // "1 11 0  11 1 12  2 12 1  12 2 13  3 13 2  13 3 14  4 14 3..."
                    for (let j = 0; j < 3; j++)
                        this.indices.push(h * (columns + 1) + columns * ((i + (j % 2)) % 2) + (~~((j % 3) / 2) ?
                            (~~(i / 2) + 2 * (i % 2)) : (~~(i / 2) + 1)));
            }
        }

        static sample_array(array, ratio) {
            // Optional but sometimes useful as a next row or column operation. In a given array
            // of points, intepolate the pair of points that our progress ratio falls between.
            const frac = ratio * (array.length - 1), alpha = frac - Math.floor(frac);
            return array[Math.floor(frac)].mix(array[Math.ceil(frac)], alpha);
        }
    }


const Surface_Of_Revolution = defs.Surface_Of_Revolution =
    class Surface_Of_Revolution extends Grid_Patch {
        // SURFACE OF REVOLUTION: Produce a curved "sheet" of triangles with rows and columns.
        // Begin with an input array of points, defining a 1D path curving through 3D space --
        // now let each such point be a row.  Sweep that whole curve around the Z axis in equal
        // steps, stopping and storing new points along the way; let each step be a column. Now
        // we have a flexible "generalized cylinder" spanning an area until total_curvature_angle.

        constructor(rows, columns, points, texture_coord_range, total_curvature_angle = 2 * Math.PI) {
            const row_operation = i => Grid_Patch.sample_array(points, i),
                column_operation = (j, p) => Mat4.rotation(total_curvature_angle / columns, 0, 0, 1).times(p.to4(1)).to3();

            super(rows, columns, row_operation, column_operation, texture_coord_range);
        }
    }




export class Cylindrical_Tube extends Surface_Of_Revolution {
    // An open tube shape with equally sized sections, pointing down Z locally.

    constructor(rows, columns, texture_range) {
        super(rows, columns, Vector3.cast([1, 0, .5], [1, 0, -.5]), texture_range);
    };

}

const Square = defs.Square =
    class Square extends Shape {
        // **Square** demonstrates two triangles that share vertices.  On any planar surface, the
        // interior edges don't make any important seams.  In these cases there's no reason not
        // to re-use data of the common vertices between triangles.  This makes all the vertex
        // arrays (position, normals, etc) smaller and more cache friendly.
        constructor() {
            super("position", "normal", "texture_coord");
            // Specify the 4 square corner locations, and match those up with normal vectors:
            this.arrays.position = Vector3.cast([-1, -1, 0], [1, -1, 0], [-1, 1, 0], [1, 1, 0]);
            this.arrays.normal = Vector3.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]);
            // Arrange the vertices into a square shape in texture space too:
            this.arrays.texture_coord = Vector.cast([0, 0], [1, 0], [0, 1], [1, 1]);
            // Use two triangles this time, indexing into four distinct vertices:
            this.indices.push(0, 1, 2, 1, 3, 2);
        }
    }


export class TreeCube extends Shape {
    // **Cube** A closed 3D shape, and the first example of a compound shape (a Shape constructed
    // out of other Shapes).  A cube inserts six Square strips into its own arrays, using six
    // different matrices as offsets for each square.
    constructor() {
        super("position", "normal", "texture_coord");
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 2; j++) {
                const square_transform = Mat4.rotation(i == 0 ? Math.PI / 2 : 0, 1, 0, 0)
                    .times(Mat4.rotation(Math.PI * j - (i == 1 ? Math.PI / 2 : 0), 0, 1, 0))
                    .times(Mat4.translation(0, 0, 1));
                // Calling this function of a Square (or any Shape) copies it into the specified
                // Shape (this one) at the specified matrix offset (square_transform):
                Square.insert_transformed_copy_into(this, [], square_transform);
            }
    }
}



export class Tree {
     constructor() {
        this.stump = new Cylindrical_Tube(20, 20);
        this.top = new TreeCube();
    }

    draw(context, program_state, shapes, material) {

        let stump_transform = Mat4.identity()
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.translation(-8, 0, 0))
            .times(Mat4.scale(1, 1, 1.5))
        // draws stump
        this.stump.draw(context, program_state, stump_transform, material.tree_stump);
        stump_transform = stump_transform
            .times(Mat4.scale(1, 1, 0.5))
            .times(Mat4.rotation(Math.PI/2, -1, 0, 0))

        let treeTop_transform = stump_transform
            .times(Mat4.translation(0, 2, 0));
        // draws first box for top part of tree
        this.top.draw(context, program_state, treeTop_transform, material.tree_top)
        treeTop_transform = treeTop_transform
            .times(Mat4.translation(0, 2, 0))
        // draws second box for top part of tree
        this.top.draw(context, program_state, treeTop_transform, material.tree_top)

    }
}