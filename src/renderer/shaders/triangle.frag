#version 300 es
precision highp float;

out vec4 fragColor;

in float v_color;
in float v_type;
in float v_pointSize;
in float v_sizeMultiplier;

uniform float u_squareSize;

void main() {
    vec2 coord = gl_PointCoord - 0.5;
    vec2 absCoord = abs(coord);
    float halfSize = 0.5;
    float cornerRadius = 0.25;
    float scaleFactor = u_squareSize / v_pointSize;
    float thickness = 0.06 * scaleFactor;
    if (v_sizeMultiplier > 5.0) {
        cornerRadius = 0.16;
    }

    float dist;

    if (v_type == 2.0) { // inside home cells
        dist = length(coord) - halfSize; 
    } else { // regular cells
        dist = length(max(absCoord - vec2(halfSize - cornerRadius), 0.0)) - cornerRadius;
    }

    vec2 fw2 = fwidth(gl_PointCoord);
    float fw = max(length(fw2), 0.001);
    
    float alpha = 1.0 - smoothstep(-fw * 0.5, fw * 0.5, dist);
    
    float innerAlpha = 1.0 - smoothstep(-thickness - fw * 0.5, -thickness + fw * 0.5, dist);
    
    float finalAlpha = alpha - innerAlpha;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);
    
    if (finalAlpha > 0.0) {
        if (v_color == 0.0) {
            fragColor = vec4(0.3, 0.3, 0.3, finalAlpha);      // Gray
        } else if (v_color == 1.0) {
            fragColor = vec4(0.8, 0.0, 0.0, finalAlpha);      // Red
        } else if (v_color == 2.0) {
            fragColor = vec4(0.0, 0.9, 0.2, finalAlpha);      // Green
        } else if (v_color == 3.0) {
            fragColor = vec4(0.2, 0.2, 0.8, finalAlpha);      // Blue
        } else if (v_color == 4.0) {
            fragColor = vec4(1.0, 0.7, 0.0, finalAlpha);      // Yellow
        }
    } else {
        discard;
    }
}
