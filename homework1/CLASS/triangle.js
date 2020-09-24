
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var q = 1;//the angle of twisting
    var accuracy = 16;//the Density of the Division
    var vertices0 = [];//in the begining, I used Float32Array but finally it seems to be lack in function "push"
    //  Configure WebGL
    run(-0.5, -0.5, 0.5,-0.5, 0,0.5,1,accuracy,vertices0,q);//at the first time, I set the length of the triangle as 2 which made it exploded out of the screen
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices0), gl.STATIC_DRAW );//flatten function is of vital importance: converting the common array to Float32Array type

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 768 );
}

function run(x1,y1,x2,y2,x3,y3,num,the_accuracy,the_array,angle)//actually, this function came out error with its "the_array" parameter, because the Float32Array type does not have "push" function
{
    if (num==the_accuracy) {
        the_array.push(convert(x1,y1,angle)[0],convert(x1,y1,angle)[1],convert(x2,y2,angle)[0],convert(x2,y2,angle)[1],convert(x3,y3,angle)[0],convert(x3,y3,angle)[1]);
        return 0;
    }
    else
    {
        num=num*2;
        var x1new = 0.5*(x1+x3);
        var y1new = 0.5*(y1+y3);
        var x2new = 0.5*(x2+x3);
        var y2new = 0.5*(y2+y3);
        var x3new = 0.5*(x1+x2);
        var y3new = 0.5*(y1+y2);
        run(x1,y1,x3new,y3new,x1new,y1new,num,the_accuracy,the_array,angle);
        run(x3new,y3new,x2,y2,x2new,y2new,num,the_accuracy,the_array,angle);
        run(x1new,y1new,x2new,y2new,x3,y3,num,the_accuracy,the_array,angle);
        run(x1new,y1new,x2new,y2new,x3new,y3new,num,the_accuracy,the_array,angle);
        return 0;
    }
}

function convert(x,y,angle) {
    var d = distancefromorigin(x,y);
    var return_array=[(x*Math.cos(angle*d)-y*Math.sin(angle*d)),(x*Math.sin(angle*d)+y*Math.cos(angle*d))];
    return return_array;
}

function distancefromorigin(x,y) {
    return Math.sqrt(x*x+y*y);
}