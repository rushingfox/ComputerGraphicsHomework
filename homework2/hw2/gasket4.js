"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var points = [];
//var colors = [];

var NumTimesToSubdivide = 3;

//add a button to control the direction of rotation
var direction = true;
var move = true;
var speed = 100;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides

    var vertices = [
        vec3(  0.0000,  0.0000, -0.5000 ),
        vec3(  0.0000,  0.7071,  0.0000 ),
        vec3( -0.4330,  0.0000,  0.2500 ),
        vec3(  0.4330,  0.0000,  0.2500 )
    ];

    divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    //var cBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    //var vColor = gl.getAttribLocation( program, "vColor" );
    //gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    thetaLoc = gl.getUniformLocation( program, "theta" );

    //Initialize event handlers
    //for the button 1 and 2
    var mybutton = document.getElementById("ChangeDirectionButton");
    mybutton.addEventListener("click",function(){direction =!direction;});
    var mybutton2 = document.getElementById("ChangeStaticButton");
    mybutton2.addEventListener("click",function(){move =!move;});
    //for the slider
    document.getElementById("slide").onchange = function(event) {
        speed = 100 - event.target.value;
    };

    render();
};

function triangle( a, b, c, color )
{

    // add colors and vertices for one triangle
/*
    var baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.0)
    ];

*/ 


    //colors.push( baseColors[color] );
    points.push( a );
    //colors.push( baseColors[color] );
    points.push( b );
    //colors.push( baseColors[color] );
    points.push( c );
}

function tetra( a, b, c, d )
{
    // tetrahedron with each side using
    // a different color

    triangle( a, c, b, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
    triangle( b, c, d, 3 );
}

function divideTetra( a, b, c, d, count )
{
    // check for end of recursion

    if ( count === 0 ) {
        tetra( a, b, c, d );
    }

    // find midpoints of sides
    // divide four smaller tetrahedra

    else {
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var ad = mix( a, d, 0.5 );
        var bc = mix( b, c, 0.5 );
        var bd = mix( b, d, 0.5 );
        var cd = mix( c, d, 0.5 );

        --count;

        divideTetra(  a, ab, ac, ad, count );
        divideTetra( ab,  b, bc, bd, count );
        divideTetra( ac, bc,  c, cd, count );
        divideTetra( ad, bd, cd,  d, count );
    }
}


function render()
{
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //theta +=0.1;
        if (move) {
            theta += (direction ? 0.1 : -0.1);      
        }
        gl.uniform1f( thetaLoc, theta );
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
        setTimeout(
            function () {requestAnimFrame( render );},
            speed
        );
}