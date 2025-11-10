#version 300 es
precision highp float;

in vec4 a_instancePos;

uniform float u_squareSize;

out float v_type;

void main() {
    gl_Position = vec4(a_instancePos.xy, 0.0, 1.0);
    gl_PointSize = u_squareSize * a_instancePos.w;
    
    v_type = a_instancePos.z;
}