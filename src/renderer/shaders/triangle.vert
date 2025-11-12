#version 300 es
precision highp float;

in vec2 a_position;
in float a_color;
in float a_sizeMultiplier;
in float a_type;

uniform float u_squareSize;

out float v_color;
out float v_type;
out float v_pointSize;
out float v_sizeMultiplier;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = u_squareSize * a_sizeMultiplier;
    
    v_color = a_color;
    v_type = a_type;
    v_pointSize = gl_PointSize;
    v_sizeMultiplier = a_sizeMultiplier;
}